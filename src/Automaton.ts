import { AutomatonDescriptor } from './types/AutomatonDescriptor'
import { convertToRegExp } from './RegExp'
import { AutomatonType } from './types/AutomatonType'
import { convertToDfa } from './Converter'
import { Word, Alphabet } from './types/Word'
import { simulateAll, simulate } from './Simulation'

export class Automaton {
  // TODO: properly implement this
  public static getAutomatonType(
    automaton: AutomatonDescriptor
  ): AutomatonType {
    if (automaton.startStates.length > 1) {
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
    return convertToDfa(automaton)
  }
  public static convertToRegExp(automaton: AutomatonDescriptor): string {
    return convertToRegExp(automaton)
  }
}
