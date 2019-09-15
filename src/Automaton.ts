import { flatten, uniq, uniqBy, head } from 'lodash'
import { State, NullState } from './State'
import { Transition } from './Transition'
import { Tree, Node } from './Tree'
import { log } from './util/log'

export enum AutomatonType {
  DFA = 'DFA',
  NFA = 'NFA'
}

export type StateInit = string

export type TransitionInit = {
  from: StateInit
  to: StateInit
  alphabet: string
}

export type AutomatonContructorArgs = {
  states: StateInit[]
  transitions: TransitionInit[]
  startStates: StateInit[]
  finalStates: StateInit[]
  symbols: string[]
}

export class Automaton {
  public static START_SYMBOL = 'S'

  public states: State[]
  public startStates: State[]
  public finalStates: State[]
  public type: AutomatonType
  public symbols: string[]

  constructor({
    states: stateInit,
    transitions: transitionInit,
    startStates: startSymbols,
    finalStates,
    symbols
  }: AutomatonContructorArgs) {
    this.symbols = symbols
    // set up the states from the strinngs
    this.states = stateInit.map(label => {
      if (label === Automaton.START_SYMBOL) {
        throw new Error(
          `The global start symbol ${Automaton.START_SYMBOL} cannot be used in your state definition`
        )
      }
      return new State(label)
    })

    // set up the transitions for each state
    for (const state of this.states) {
      const transitions = transitionInit.filter(t => t.from === state.label)
      state.transitions = transitions.map(t => {
        const from = this.states.find(s => s.label === t.from)
        const to = this.states.find(s => s.label === t.to)
        if (!from) {
          throw new Error(
            `Could not find state 'from' with label ${t.from} in states`
          )
        }
        if (!to) {
          throw new Error(
            `Could not find state 'to' with label ${t.to} in states`
          )
        }
        return new Transition(from, to, t.alphabet)
      })
    }

    // for each start state, find the State objects from this.states
    const startState = startSymbols.map(startSymbol => {
      const foundState = this.states.find(s => s.label === startSymbol)
      if (!foundState) {
        throw new Error(`Could not find start symbol ${startSymbol} in states`)
      }
      return foundState
    })
    this.startStates = startState

    // for each final state, find the State objects from this.states
    this.finalStates = finalStates.map(f => {
      const state = this.states.find(s => s.label === f)
      if (!state) {
        throw new Error(`Could not find final state ${f} in states`)
      }
      return state
    })

    this.type = this.getAutomatonType(this)
  }

  /**
   * Gets the automaton type
   * An automaton is a NFA if
   *   - it contains more than one start state
   *   - there exists a state which has a duplicate alphabet in its transitions
   * @param automaton
   */
  private getAutomatonType(automaton: Automaton) {
    if (automaton.startStates.length > 1) {
      return AutomatonType.NFA
    }
    for (const state of automaton.states) {
      const transitions = state.transitions
      // TODO: does not handle duplicates!
      // TODO: for example s1 -a-> s2, s1 -a-> s2
      const reduced = uniq(transitions.map(t => t.alphabet))
      if (reduced.length !== transitions.length) {
        return AutomatonType.NFA
      }
    }
    return AutomatonType.DFA
  }

  public simulate(testString: string[] | string) {
    let states = this.startStates

    // set up the execution tree
    const tree = new Tree(new Node(Automaton.START_SYMBOL, null, []))
    // set the root node's children to the start states
    tree.rootNode.children = states.map(
      s => new Node(s.label, tree.rootNode, [])
    )

    // now we keep track of a list of pointers to the current execution symbol
    let ptrs = tree.rootNode.children

    for (const char of testString) {
      // for every single state, execute the traverse method with the symbol
      // note that each state might fork into multiple states
      const nextStates = states.map(s => s.traverse(char))

      // since the next states produce a one to one relationship with the
      // current pointer, we set the children of the current pointers with the
      // states that are produced by nextStates

      if (nextStates.length !== ptrs.length) {
        throw new Error(
          'Invariant violation: next states and execution pointer must have the same length'
        )
      }

      for (let i = 0; i < ptrs.length; i++) {
        const ptr = ptrs[i]
        ptr.children = nextStates[i].map(i => new Node(i.label, ptr, []))
      }

      // now we advance the pointers one level deeper, by setting them
      // to the current pointer's children, and flat mapping it
      // this goes the same with the states
      ptrs = flatten(ptrs.map(i => i.children))
      states = flatten(nextStates)
    }

    // we now get all the final state labbels
    const finalStateLabels = this.finalStates.map(f => f.label)
    // filter the last executed pointers (deepest level) by
    // the criteria that the label is included in finalStateLabels
    const acceptedPtrs = ptrs.filter(ptr =>
      finalStateLabels.includes(ptr.label)
    )

    const acceptedPaths = []

    // for each last executed pointer, we
    // traverse up the tree and keep track of the execution paths
    // the pushing it into acceptedPaths
    for (const ptr of acceptedPtrs) {
      const sink = []
      let z: Node | null = ptr
      while (z !== null) {
        sink.push(z.label)
        z = z.parent
      }
      // reverse the paths since it is being traversed from bottom up
      acceptedPaths.push(sink.reverse())
    }

    return {
      accepted: acceptedPaths.length > 0,
      acceptedPaths,
      tree
    }
  }

  public convertToDfa() {
    if (this.type !== AutomatonType.NFA) {
      throw new Error('Conversion to a DFA requires a NFA automaton')
    }

    const queue = [this.startStates]

    const startStates: Set<string> = new Set()
    const states: Set<string> = new Set()
    const transitions: Set<TransitionInit> = new Set()

    let isFirstIteration = true
    let depth = 0

    while (queue.length) {
      const current = head(queue)!

      // error handling in case something really goes wrong
      depth++
      if (depth > 10000) {
        log({states, transitions, queue})
        throw new Error('Maximum depth exceeded')
      }

      // TODO: use set and don't rely on sorting
      const mergedLabel = current.map(s => s.label).sort().join(',')

      states.add(mergedLabel)

      if (isFirstIteration) {
        startStates.add(mergedLabel)
        isFirstIteration = false
      }

      // set up a new temporary state and merge all the transitions
      // so that we can use this to fire all the symbols
      const tempState = new State(mergedLabel)
      tempState.transitions = flatten(current.map(s => s.transitions))

      const nextStates: State[][] = []

      // fire for each symbol
      for (const symbol of this.symbols) {
        // get all the eligible states
        const eligibleStates = tempState.traverse(symbol)
        // remove all NullState and get the unique symbol by labels
        let eligibleNextStates = uniqBy(eligibleStates, s => s.label).filter(
          s => s.label !== NullState.NULL_STATE_LABEL
        )

        const eligibleMergedLabel = uniq(
          // TODO: use set and don't rely on sorting
          eligibleNextStates.map(s => s.label).sort()
        ).join(',')

        if (eligibleMergedLabel.length) {
          // if the transition already exists, we want
          // to remove it from the eligible next states
          // this is to prevent the program from running
          // into infinite loops if a transition is self recursive
          if (
            Array.from(transitions).find(
              t =>
                t.alphabet === symbol &&
                (t.to === eligibleMergedLabel || t.to === mergedLabel) &&
                (t.from === mergedLabel || t.from === eligibleMergedLabel)
            )
          ) {
            // TODO: breaks on NFA2
            eligibleNextStates = eligibleNextStates.filter(
              s => { 
                return !eligibleMergedLabel.split(',').includes(s.label)
              }
            )
          } else {
            transitions.add({
              from: mergedLabel,
              to: eligibleMergedLabel,
              alphabet: symbol
            })
          }
        }

        // if there are any eligible next states
        if (eligibleNextStates.length) {
          states.add(eligibleMergedLabel)
          nextStates.push(eligibleNextStates)
        }
      }

      // push next states into the queue
      if (nextStates.length) {
        queue.push(...nextStates)
      }
      // dequeue the processed state
      queue.shift()
    }

    console.log(Array.from(transitions))

    return new Automaton( {
      states: Array.from(states),
      transitions: Array.from(transitions),
      startStates: Array.from(startStates),
      finalStates: Array.from(states).filter(s => {
        for (const finalState of this.finalStates) {
          if (s.indexOf(finalState.label) !== -1) {
            return true
          }
        }
        return false
      }),
      symbols: this.symbols
    })
  }
}
