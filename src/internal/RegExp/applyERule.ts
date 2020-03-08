import {
  AutomatonDescriptor,
  ApplyEType,
  AutomatonSymbol,
  RegExpStep,
} from '../../types'
import { head } from 'lodash'

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
