import { ApplyType, RegExpStep } from '../types'
import { MAXIMUM_TRAVERSE_DEPTH } from '../util'
import {
  prepareRegExpTransformation,
  applyERule,
  applyVRule,
  applySRule,
} from '../internal/RegExp'
import { Automaton } from '../Automaton'

/**
 * Converts an automaton into a RegExp automaton with the transformation history
 * @param descriptor
 */
export function toRegExpWithHistory(automaton: Automaton) {
  const descriptor = automaton.descriptor
  let depth = 0
  const history: ApplyType[] = []
  history.push({
    kind: RegExpStep.DEFAULT,
    automaton: descriptor,
  })
  let result: ApplyType = prepareRegExpTransformation(descriptor)
  history.push(result)
  while (result.automaton.transitions.length > 1) {
    depth++
    if (depth > MAXIMUM_TRAVERSE_DEPTH) {
      throw new Error('Maximum depth exceeded')
    }
    const fns = [applyERule, applyVRule, applySRule]
    fns.forEach(fn => {
      const nextResult = fn(result.automaton)
      if (nextResult.kind !== RegExpStep.NO_OP) {
        history.push(nextResult)
        result = nextResult
      }
    })
  }
  return history
}
