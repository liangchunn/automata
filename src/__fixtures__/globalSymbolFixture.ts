import { AutomatonDescriptor } from '../types/AutomatonDescriptor'
import { AutomatonSymbol } from '../types/AutomatonSymbol'

export const globalSymbolFixture: AutomatonDescriptor = {
  states: [AutomatonSymbol.START_SYMBOL],
  finalStates: [],
  startStates: [],
  symbols: [],
  transitions: [],
}
