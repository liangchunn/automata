import { ApplyType, RegExpStep } from '../types'
import { createDepthGuard } from '../util'
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
  const tick = createDepthGuard()
  const descriptor = automaton.descriptor
  const history: ApplyType[] = []
  history.push({
    kind: RegExpStep.DEFAULT,
    automaton: descriptor,
  })
  let result: ApplyType = prepareRegExpTransformation(descriptor)
  history.push(result)
  while (result.automaton.transitions.length > 1) {
    const fns = [applyERule, applyVRule, applySRule]
    fns.forEach(fn => {
      const nextResult = fn(result.automaton)
      if (nextResult.kind !== RegExpStep.NO_OP) {
        history.push(nextResult)
        result = nextResult
      }
    })
    tick()
  }
  return history
}
