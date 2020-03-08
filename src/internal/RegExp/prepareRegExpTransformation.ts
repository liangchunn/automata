import { flatten, difference } from 'lodash'
import {
  AutomatonDescriptor,
  ApplyInitType,
  AutomatonSymbol,
  RegExpStep,
} from '../../types'

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
