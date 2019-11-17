import { groupBy, keys } from 'lodash'
import {
  AutomatonType,
  AutomatonDescriptor,
  Word,
  ApplyType,
  SimulationType,
} from './types'
import {
  getRegExp,
  convertToRegExpSteps,
  convertToRegExpWithHistory,
} from './RegExp'
import { convertToDfa } from './Converter'
import { simulateAll, simulate } from './Simulation'

export class Automaton {
  /**
   * Determine if a given automaton is a DFA or an NFA
   * @param automaton
   */
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

  /**
   * Creates a generator that simulates a word on a given automaton
   * @param automaton
   * @param alphabet
   */
  public static simulate(automaton: AutomatonDescriptor, word: Word) {
    return simulate(automaton, word)
  }

  /**
   * Simulates a word on a given automaton
   * @param automaton
   * @param word
   */
  public static simulateAll(
    automaton: AutomatonDescriptor,
    word: Word
  ): SimulationType {
    return simulateAll(automaton, word)
  }

  /**
   * Converts an NFA to a DFA
   * @param automaton
   */
  public static convertToDfa(
    automaton: AutomatonDescriptor
  ): AutomatonDescriptor {
    if (Automaton.getAutomatonType(automaton) === AutomatonType.DFA) {
      throw new Error('Automaton is already a DFA')
    }
    return convertToDfa(automaton)
  }

  /**
   * Gets the regular experssion string of a given automaton
   * @param automaton
   */
  public static getRegExp(automaton: AutomatonDescriptor): string {
    return getRegExp(automaton)
  }

  /**
   * Creates a generator that converts a given automaton into a regular expression automaton
   * @param automaton
   */
  public static convertToRegExpSteps(automaton: AutomatonDescriptor) {
    return convertToRegExpSteps(automaton)
  }

  /**
   * Converts an automaton into a RegExp automaton with the transformation history
   * @param automaton
   */
  public static convertToRegExpWithHistory(
    automaton: AutomatonDescriptor
  ): ApplyType[] {
    return convertToRegExpWithHistory(automaton)
  }
}
