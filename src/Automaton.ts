import { groupBy, keys } from 'lodash'
import { AutomatonDescriptor } from './types/AutomatonDescriptor'
import { convertToRegExp, convertToRegExpSteps } from './RegExp'
import { AutomatonType } from './types/AutomatonType'
import { convertToDfa } from './Converter'
import { Word, Alphabet } from './types/Word'
import { simulateAll, simulate } from './Simulation'

export class Automaton {
  public static getAutomatonType(
    automaton: AutomatonDescriptor
  ): AutomatonType {
    if (automaton.startStates.length > 1) {
      return AutomatonType.NFA
    }
    let hasTwoDistinctTransitions = false
    const groupedTransitions = groupBy(automaton.transitions, 'from')
    const groupedKeys = keys(groupedTransitions)
    for (const groupKey of groupedKeys) {
      const groupedAlphabets = groupBy(groupedTransitions[groupKey], 'alphabet')
      const alphabetKeys = keys(groupedAlphabets)
      for (const alphabetKey of alphabetKeys) {
        if (groupedAlphabets[alphabetKey].length > 1) {
          hasTwoDistinctTransitions = true
          break
        }
      }
      if (hasTwoDistinctTransitions) {
        break
      }
    }
    if (hasTwoDistinctTransitions) {
      return AutomatonType.NFA
    }
    return AutomatonType.DFA
  }

  public static simulate(automaton: AutomatonDescriptor, alphabet: Alphabet) {
    return simulate(automaton, alphabet)
  }

  public static simulateAll(automaton: AutomatonDescriptor, word: Word) {
    return simulateAll(automaton, word)
  }

  public static convertToDfa(
    automaton: AutomatonDescriptor
  ): AutomatonDescriptor {
    if (Automaton.getAutomatonType(automaton) === AutomatonType.DFA) {
      throw new Error('Automaton is already a DFA')
    }
    return convertToDfa(automaton)
  }
  public static convertToRegExp(automaton: AutomatonDescriptor): string {
    return convertToRegExp(automaton)
  }
  public static convertToRegExpSteps(automaton: AutomatonDescriptor) {
    return convertToRegExpSteps(automaton)
  }
}
