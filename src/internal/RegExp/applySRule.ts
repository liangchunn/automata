import { difference } from 'lodash'
import {
  AutomatonDescriptor,
  ApplySType,
  RegExpStep,
  AutomatonSymbol,
} from '../../types'

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
