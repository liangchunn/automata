import { AutomatonDescriptor } from '../types/AutomatonDescriptor'

export const nonExistentTransitionAlphabetFixture: AutomatonDescriptor = {
  states: ['s1', 's2'],
  finalStates: ['s2'],
  startStates: ['s1'],
  symbols: ['a', 'b'],
  transitions: [
    {
      from: 's1',
      to: 's2',
      alphabet: 'c',
    },
  ],
}
