import { AutomatonContructorArgs } from '../Automaton'

export const nonExistentTransitionAlphabetFixture: AutomatonContructorArgs = {
  states: ['s1', 's2'],
  finalStates: ['s2'],
  startStates: ['s1'],
  symbols: ['a', 'b'],
  transitions: [
    {
      from: 's1',
      to: 's2',
      alphabet: 'c'
    }
  ]
}
