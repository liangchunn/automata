import { head, flatten, uniq } from 'lodash'
import { AutomatonTransition, AutomatonSymbol } from '../types'
import {
  mergeSetLabels,
  mergedLabelContains,
  MAXIMUM_TRAVERSE_DEPTH,
} from '../util'
import { traverse } from '../internal/simulation/traverse'
import { Automaton } from '../Automaton'

/**
 * Converts an NFA to a DFA
 * Required pre-condition: the given automata must be a NFA
 * @param config
 */
export function toDfa(automaton: Automaton): Automaton {
  const descriptor = automaton.descriptor
  const queue = [descriptor.startStates]

  const startStates: Set<string> = new Set()
  const states: Set<string> = new Set()
  const transitions: Set<AutomatonTransition> = new Set()

  let isFirstIteration = true
  let depth = 0

  while (queue.length) {
    const current = head(queue)!

    depth++
    if (depth > MAXIMUM_TRAVERSE_DEPTH) {
      throw new Error('Maximum depth exceeded')
    }

    const mergedLabel = mergeSetLabels(current)

    if (isFirstIteration) {
      startStates.add(mergedLabel)
      isFirstIteration = false
    }

    const tempTransitions = flatten(
      current.map(state => descriptor.transitions.filter(t => t.from === state))
    )

    const nextStates: string[][] = []

    for (const symbol of descriptor.symbols) {
      const eligibleStates = traverse(tempTransitions, symbol)
      let eligibleNextStates = uniq(eligibleStates).filter(
        state => state !== AutomatonSymbol.NULL_STATE_SYMBOL
      )
      const eligibleMergedLabel = mergeSetLabels(eligibleNextStates)

      if (eligibleMergedLabel.length) {
        if (
          Array.from(transitions).find(
            t =>
              t.alphabet === symbol &&
              t.from === mergedLabel &&
              t.to === eligibleMergedLabel
          )
        ) {
          eligibleNextStates = eligibleNextStates.filter(
            label => !mergedLabelContains(eligibleMergedLabel, label)
          )
        } else {
          transitions.add({
            from: mergedLabel,
            to: eligibleMergedLabel,
            alphabet: symbol,
          })
        }
      }
      if (eligibleNextStates.length) {
        states.add(eligibleMergedLabel)
        nextStates.push(eligibleNextStates)
      }
    }
    if (nextStates.length) {
      queue.push(...nextStates)
    }

    queue.shift()
  }

  return new Automaton({
    states: Array.from(states),
    transitions: Array.from(transitions),
    startStates: Array.from(startStates),
    finalStates: Array.from(states).filter(s => {
      for (const finalStateLabel of descriptor.finalStates) {
        if (s.indexOf(finalStateLabel) !== -1) {
          return true
        }
      }
      return false
    }),
    symbols: descriptor.symbols,
  })
}
