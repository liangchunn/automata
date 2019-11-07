import { intersection, uniq, difference, flow } from 'lodash'
import { AutomatonDescriptor } from './types/AutomatonDescriptor'
import { AutomatonSymbol } from './types/AutomatonSymbol'

function validateSymbols(automaton: AutomatonDescriptor): AutomatonDescriptor {
  const illegalSymbols = [
    AutomatonSymbol.START_SYMBOL,
    AutomatonSymbol.END_SYMBOL,
  ]
  const foundIllegalSymbols = intersection(automaton.states, illegalSymbols)
  if (foundIllegalSymbols.length) {
    throw new Error(`Symbols cannot contain any of ${illegalSymbols}`)
  }
  return automaton
}

function validateTransitionStates(
  automaton: AutomatonDescriptor
): AutomatonDescriptor {
  const transitionStates = uniq([
    ...automaton.transitions.map(transition => transition.from),
    ...automaton.transitions.map(transition => transition.to),
  ])
  const diff = difference(transitionStates, automaton.states)
  if (diff.length) {
    throw new Error(
      `Found transitions with states ${diff} that are not included in states`
    )
  }
  return automaton
}

function validateStartStates(
  automaton: AutomatonDescriptor
): AutomatonDescriptor {
  const diff = difference(automaton.startStates, automaton.states)
  if (diff.length) {
    throw new Error(
      `Found start states ${diff} which are not included in states`
    )
  }
  return automaton
}

function validateFinalStates(
  automaton: AutomatonDescriptor
): AutomatonDescriptor {
  const diff = difference(automaton.finalStates, automaton.states)
  if (diff.length) {
    throw new Error(
      `Found final states ${diff} which are not included in states`
    )
  }
  return automaton
}

function validateTransitionSymbols(
  automaton: AutomatonDescriptor
): AutomatonDescriptor {
  const transitionSymbols = uniq(
    automaton.transitions.map(transition => transition.alphabet)
  )
  const diff = difference(transitionSymbols, automaton.symbols)
  if (diff.length) {
    throw new Error(
      `Found symbols ${diff} in transitions that are not included in symbols`
    )
  }
  return automaton
}

export function validateAutomaton(
  automaton: AutomatonDescriptor
): AutomatonDescriptor {
  return flow(
    validateSymbols,
    validateStartStates,
    validateFinalStates,
    validateTransitionStates,
    validateTransitionSymbols
  )(automaton)
}
