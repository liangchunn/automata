import { flatten, difference, head } from 'lodash'
import {
  AutomatonSymbol,
  AutomatonDescriptor,
  ApplyType,
  ApplyInitType,
  ApplyEType,
  ApplyVType,
  ApplySType,
  RegExpStep,
} from './types'
import { MAXIMUM_TRAVERSE_DEPTH } from './util'

/**
 * Gets the regular experssion string of a given automaton
 * @param automaton
 */
export function getRegExp(automaton: AutomatonDescriptor): string {
  let result = prepareRegExpTransformation(automaton).automaton
  while (result.transitions.length > 1) {
    result = applyERule(result).automaton
    result = applyVRule(result).automaton
    result = applySRule(result).automaton
  }
  const regExp = result.transitions[0].alphabet
  return regExp
}

/**
 * Converts an automaton into a RegExp automaton with the transformation history
 * @param automaton
 */
export function convertToRegExpWithHistory(automaton: AutomatonDescriptor) {
  let depth = 0
  const sink: ApplyType[] = []
  sink.push({
    kind: RegExpStep.DEFAULT,
    automaton,
  })
  let result: ApplyType = prepareRegExpTransformation(automaton)
  sink.push(result)
  while (result.automaton.transitions.length > 1) {
    depth++
    if (depth > MAXIMUM_TRAVERSE_DEPTH) {
      throw new Error()
    }
    const fns = [applyERule, applyVRule, applySRule]
    fns.forEach(fn => {
      const nextResult = fn(result.automaton)
      if (nextResult.kind !== RegExpStep.NO_OP) {
        sink.push(nextResult)
        result = nextResult
      }
    })
  }
  return sink
}

/**
 * Creates a generator that converts a given automaton into a regular expression automaton
 * @param automaton
 */
export function* convertToRegExpSteps(automaton: AutomatonDescriptor) {
  let result = prepareRegExpTransformation(automaton).automaton
  yield {
    step: 'I',
    result,
  }
  while (result.transitions.length > 1) {
    result = applyERule(result).automaton
    yield {
      step: 'E',
      result,
    }
    result = applyVRule(result).automaton
    yield {
      step: 'V',
      result,
    }
    result = applySRule(result).automaton
    yield {
      step: 'S',
      result,
    }
  }
  return {
    step: 'F',
    result,
  }
}

/**
 * Prepares an automaton to be converted into a RegExp automaton
 * @param automaton
 */
export function prepareRegExpTransformation(
  automaton: AutomatonDescriptor
): ApplyInitType {
  // we want to remove trap states because they can cause trouble when trying to
  // convert them into regular expressions

  // we first find all trapStates, which are states which have no outgoing transitions
  // we also have to keep in mind to ignore looping states, and end states
  const trapStates = automaton.states.reduce<string[]>((acc, state) => {
    const outgoingTransitionsWithoutLoops = automaton.transitions.filter(
      transition =>
        transition.from === state && transition.from !== transition.to
    )
    if (
      outgoingTransitionsWithoutLoops.length === 0 &&
      !automaton.finalStates.includes(state)
    ) {
      return [...acc, state]
    }
    return acc
  }, [])

  // now we get all the transitions which contain the trap states on the field 'to'
  // this is then used as a subtraction type on the bottom
  const trapTransitions = flatten(
    trapStates.map(trapState =>
      automaton.transitions.filter(transition => transition.to === trapState)
    )
  )

  const statesWithoutTraps = difference(automaton.states, trapStates)
  const transitionsWithoutTraps = difference(
    automaton.transitions,
    trapTransitions
  )

  return {
    automaton: {
      states: [
        ...statesWithoutTraps,
        AutomatonSymbol.START_SYMBOL,
        AutomatonSymbol.END_SYMBOL,
      ],
      finalStates: [AutomatonSymbol.END_SYMBOL],
      startStates: [AutomatonSymbol.START_SYMBOL],
      symbols: [...automaton.symbols, AutomatonSymbol.EPSILON],
      transitions: [
        ...transitionsWithoutTraps,
        ...automaton.finalStates.map(finalState => ({
          from: finalState,
          to: AutomatonSymbol.END_SYMBOL,
          alphabet: AutomatonSymbol.EPSILON,
        })),
        ...automaton.startStates.map(startState => ({
          from: AutomatonSymbol.START_SYMBOL,
          to: startState,
          alphabet: AutomatonSymbol.EPSILON,
        })),
      ],
    },
    kind: RegExpStep.INIT,
  }
}

/**
 * Applies the E rule by removing transitive transitions (a->b->c into a->c)
 * @param automaton
 */
export function applyERule(
  automaton: Readonly<AutomatonDescriptor>
): ApplyEType {
  // find the lowest number of output edges excluding the start and the end state
  const statesWithoutAugmentation = automaton.states.filter(
    state =>
      state !== AutomatonSymbol.START_SYMBOL &&
      state !== AutomatonSymbol.END_SYMBOL
  )

  const sorted = statesWithoutAugmentation
    .map(state => ({
      state,
      in: automaton.transitions.filter(transition => transition.to === state)
        .length,
      out: automaton.transitions.filter(transision => transision.from === state)
        .length,
    }))
    .sort((a, b) => a.out - b.out)

  const first = head(sorted)

  if (first !== undefined) {
    const { state } = first
    const incomingTransitions = automaton.transitions.filter(
      transition => transition.to === state
    )
    const outgoingTransitions = automaton.transitions.filter(
      transition => transition.from === state
    )
    const hasLoop = incomingTransitions.filter(
      transition => transition.to === transition.from
    ).length

    const eligible =
      incomingTransitions.length >= 1 &&
      outgoingTransitions.length >= 1 &&
      !hasLoop

    if (eligible) {
      const sink: AutomatonDescriptor['transitions'] = []
      for (const incomingTransition of incomingTransitions) {
        for (const outgoingTransition of outgoingTransitions) {
          const from = incomingTransition.from
          const to = outgoingTransition.to
          const alphabet = `${incomingTransition.alphabet}${outgoingTransition.alphabet}`
          sink.push({
            from,
            to,
            alphabet,
          })
        }
      }
      return {
        automaton: {
          ...automaton,
          transitions: [...automaton.transitions, ...sink].filter(
            transition => transition.from !== state && transition.to !== state
          ),
          states: automaton.states.filter(
            initialState => initialState !== state
          ),
        },
        kind: RegExpStep.E,
        state: first.state,
      }
    }
  }
  return {
    automaton,
    kind: RegExpStep.NO_OP,
  }
}

/**
 * Applies the V rule by merging all parallel transitions (a-(x)->b, a->(y)->b to a->(x|y)->b)
 * @param automaton
 */
export function applyVRule(
  automaton: Readonly<AutomatonDescriptor>
): ApplyVType {
  // keeps track of transitions by keying them with the `from` label and `to` label
  const sink: Record<
    string,
    {
      from: string
      to: string
      alphabet: string
    }[]
  > = {}

  for (const transition of automaton.transitions) {
    const label = `${transition.from}${transition.to}`
    if (sink[label] === undefined) {
      sink[label] = []
    }
    sink[label].push(transition)
  }

  // finds all the transitions (values of the sink) which has more than 1 transition
  const eligibleTransitions = Object.values(sink).filter(
    grouped => grouped.length > 1
  )

  if (!eligibleTransitions.length) {
    return {
      automaton,
      kind: RegExpStep.NO_OP,
    }
  }

  // gets the negated set of transitions of the automta with the eligible transitions
  const negatedTransitions = difference(
    automaton.transitions,
    flatten(eligibleTransitions)
  )

  // for each grouped transitions, we want to merge the transition symbol into one transition by
  // appending them with the union symbol
  const reducedEligibleTransitions = eligibleTransitions.reduce((acc, curr) => {
    const alphabet = `(${curr
      .map(transition => transition.alphabet)
      .join(AutomatonSymbol.UNION_SYMBOL)})`
    const from = curr[0].from
    const to = curr[0].to
    return [
      ...acc,
      {
        from,
        to,
        alphabet,
      },
    ]
  }, [])

  // construct the new transitions of the automaton by merging the negated transitions
  // with the newly constructed merged transitions
  const newTransitions = [...negatedTransitions, ...reducedEligibleTransitions]

  return {
    automaton: {
      ...automaton,
      transitions: newTransitions,
    },
    kind: RegExpStep.V,
    transitions: eligibleTransitions,
  }
}

/**
 * Applies the S rule by removing loop states and merging them to the outgoing transitions of a particular state
 * @param automaton
 */
export function applySRule(
  automaton: Readonly<AutomatonDescriptor>
): ApplySType {
  // gets all transitions with loops
  const transitionsWithLoops = automaton.transitions.filter(
    transition => transition.from === transition.to
  )

  if (!transitionsWithLoops.length) {
    return {
      automaton,
      kind: RegExpStep.NO_OP,
    }
  }

  // gets the negated set of the automaton's transitions with the transitions with loops
  let transitionsWithoutLoops = difference(
    automaton.transitions,
    transitionsWithLoops
  )

  const mergedTransitions: {
    from: string
    to: string
    alphabet: string
  }[] = []

  for (const transition of transitionsWithLoops) {
    const state = transition.from
    const kleeneStarredAlphabet =
      transition.alphabet.length > 1
        ? `(${transition.alphabet})${AutomatonSymbol.KLEENE_STAR}`
        : `${transition.alphabet}${AutomatonSymbol.KLEENE_STAR}`
    // get all the outgoing transitions of a state
    const outgoingTransitions = transitionsWithoutLoops.filter(
      transition => transition.from === state
    )
    // merge the loop transition with the outgoing transitions of the given state
    for (const o of outgoingTransitions) {
      mergedTransitions.push({
        from: o.from,
        to: o.to,
        alphabet: `${kleeneStarredAlphabet}${o.alphabet}`,
      })
      transitionsWithoutLoops = difference(transitionsWithoutLoops, [o])
    }
  }
  return {
    automaton: {
      ...automaton,
      transitions: [...transitionsWithoutLoops, ...mergedTransitions],
    },
    kind: RegExpStep.S,
    transitions: transitionsWithLoops,
  }
}
