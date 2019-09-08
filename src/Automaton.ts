import { flatten, uniq } from 'lodash'
import { State } from './State'
import { Transition } from './Transition'
import { Tree, Node } from './Tree'

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

export class Automaton {
  public static START_SYMBOL = 'S'

  public states: State[]
  public startState: State[]
  public finalStates: State[]
  public type: AutomatonType

  constructor(
    stateInit: StateInit[],
    transitionInit: TransitionInit[],
    startSymbols: StateInit[],
    finalStates: StateInit[]
  ) {
    this.states = stateInit.map(label => {
      if (label === Automaton.START_SYMBOL) {
        throw new Error(
          `The global start symbol ${Automaton.START_SYMBOL} cannot be used in your state definition`
        )
      }
      return new State(label)
    })
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
    // for each start symbol, find the State objects from this.state
    const startState = startSymbols.map(startSymbol => {
      const foundState = this.states.find(s => s.label === startSymbol)
      if (!foundState) {
        throw new Error(`Could not find start symbol ${startSymbol} in states`)
      }
      return foundState
    })
    this.startState = startState

    this.finalStates = finalStates.map(f => {
      const state = this.states.find(s => s.label === f)
      if (!state) {
        throw new Error(`Could not find final state ${f} in states`)
      }
      return state
    })

    this.type = this.getAutomatonType(this)
  }

  private getAutomatonType(automaton: Automaton) {
    if (automaton.startState.length > 1) {
      return AutomatonType.NFA
    }
    for (const state of automaton.states) {
      const transitions = state.transitions
      const reduced = uniq(transitions.map(t => t.alphabet))
      if (reduced.length !== transitions.length) {
        return AutomatonType.NFA
      }
    }
    return AutomatonType.DFA
  }

  public simulate(testString: string[] | string) {
    let states = this.startState

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
}
