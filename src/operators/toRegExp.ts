import {
  applyERule,
  applySRule,
  applyVRule,
  prepareRegExpTransformation,
} from '../internal/RegExp'
import { Automaton } from '../Automaton'
import { createDepthGuard } from '../util'

/**
 * Gets the regular experssion string of a given automaton
 * @param descriptor
 */
export function toRegExp(automaton: Automaton): string {
  const tick = createDepthGuard()
  const descriptor = automaton.descriptor
  let result = prepareRegExpTransformation(descriptor).automaton
  while (result.transitions.length > 1) {
    result = applyERule(result).automaton
    result = applyVRule(result).automaton
    result = applySRule(result).automaton
    tick()
  }
  const regExp = result.transitions[0].alphabet
  return regExp
}
