import { difference, flatten } from 'lodash'
import {
  AutomatonDescriptor,
  ApplyVType,
  RegExpStep,
  AutomatonSymbol,
} from '../../types'

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
