import {
  prepareRegExpTransformation,
  applyERule,
  applyVRule,
  applySRule,
} from '../internal/RegExp'
import { Automaton } from '../Automaton'

/**
 * Creates a generator that converts a given automaton into a regular expression automaton
 * @param descriptor
 */
export function* toRegExpGenerator(automaton: Automaton) {
  const descriptor = automaton.descriptor
  let result = prepareRegExpTransformation(descriptor).automaton
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
