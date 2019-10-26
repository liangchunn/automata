import { head, flatten, uniq } from 'lodash'
import {
  AutomatonDescriptor,
  AutomatonTransition
} from './types/AutomatonDescriptor'
import { mergeSetLabels, mergedLabelContains } from './util/mergeLabels'
import { traverse } from './Simulation'
import { AutomatonSymbol } from './types/AutomatonSymbol'

export function convertToDfa(
  automaton: AutomatonDescriptor
): AutomatonDescriptor {
  const queue = [automaton.startStates]

  const startStates: Set<string> = new Set()
  const states: Set<string> = new Set()
  const transitions: Set<AutomatonTransition> = new Set()

  let isFirstIteration = true
  let depth = 0

  while (queue.length) {
    const current = head(queue)!

    depth++
    if (depth > 10000) {
      throw new Error('Maximum depth exceeded')
    }

    const mergedLabel = mergeSetLabels(current)

    if (isFirstIteration) {
      startStates.add(mergedLabel)
      isFirstIteration = false
    }

    const tempTransitions = flatten(
      current.map(state => automaton.transitions.filter(t => t.from === state))
    )

    const nextStates: string[][] = []

    for (const symbol of automaton.symbols) {
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
            alphabet: symbol
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

  return {
    states: Array.from(states),
    transitions: Array.from(transitions),
    startStates: Array.from(startStates),
    finalStates: Array.from(states).filter(s => {
      for (const finalStateLabel of automaton.finalStates) {
        if (s.indexOf(finalStateLabel) !== -1) {
          return true
        }
      }
      return false
    }),
    symbols: automaton.symbols
  }
}
