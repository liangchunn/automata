import { flatten, difference, head } from 'lodash'
import { AutomatonSymbol } from './types/AutomatonSymbol'
import { AutomatonDescriptor } from './types/AutomatonDescriptor'

export function convertToRegExp(automaton: AutomatonDescriptor): string {
  let result = initializeRegExpTransformation(automaton)
  while (result.transitions.length > 1) {
    result = applyERule(result)
    result = applyVRule(result)
    result = applySRule(result)
  }
  const regExp = result.transitions[0].alphabet
  return regExp
}

export function initializeRegExpTransformation(
  automaton: AutomatonDescriptor
): AutomatonDescriptor {
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
    states: [
      ...statesWithoutTraps,
      AutomatonSymbol.START_SYMBOL,
      AutomatonSymbol.END_SYMBOL
    ],
    finalStates: [AutomatonSymbol.END_SYMBOL],
    startStates: [AutomatonSymbol.START_SYMBOL],
    symbols: [...automaton.symbols, AutomatonSymbol.EPSILON],
    transitions: [
      ...transitionsWithoutTraps,
      ...automaton.finalStates.map(finalState => ({
        from: finalState,
        to: AutomatonSymbol.END_SYMBOL,
        alphabet: AutomatonSymbol.EPSILON
      })),
      ...automaton.startStates.map(startState => ({
        from: AutomatonSymbol.START_SYMBOL,
        to: startState,
        alphabet: AutomatonSymbol.EPSILON
      }))
    ]
  }
}

export function applyERule(
  automaton: Readonly<AutomatonDescriptor>
): AutomatonDescriptor {
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
        .length
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
            alphabet
          })
        }
      }
      return {
        ...automaton,
        transitions: [...automaton.transitions, ...sink].filter(
          transition => transition.from !== state && transition.to !== state
        ),
        states: automaton.states.filter(initialState => initialState !== state)
      }
    }
  }
  return automaton
}

export function applyVRule(
  automaton: Readonly<AutomatonDescriptor>
): AutomatonDescriptor {
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
  const eligibleTransitions = Object.values(sink).filter(
    grouped => grouped.length > 1
  )

  const negatedTransitions = difference(
    automaton.transitions,
    flatten(eligibleTransitions)
  )

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
        alphabet
      }
    ]
  }, [])

  const newTransitions = [...negatedTransitions, ...reducedEligibleTransitions]

  return {
    ...automaton,
    transitions: newTransitions
  }
}

export function applySRule(
  automaton: Readonly<AutomatonDescriptor>
): AutomatonDescriptor {
  const transitionsWithLoops = automaton.transitions.filter(
    transition => transition.from === transition.to
  )
  let transitionsWithoutLoops = difference(
    automaton.transitions,
    transitionsWithLoops
  )

  const sink: {
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
    const outgoingTransitions = transitionsWithoutLoops.filter(
      transition => transition.from === state
    )
    for (const o of outgoingTransitions) {
      sink.push({
        from: o.from,
        to: o.to,
        alphabet: `${kleeneStarredAlphabet}${o.alphabet}`
      })
      transitionsWithoutLoops = difference(transitionsWithoutLoops, [o])
    }
  }
  return {
    ...automaton,
    transitions: [...transitionsWithoutLoops, ...sink]
  }
}
