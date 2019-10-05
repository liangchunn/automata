import { AutomatonContructorArgs } from '../Automaton'

/**
 * Language RegExp: aba
 */
export const dfaFixture1: AutomatonContructorArgs = {
  states: ['s1', 's2', 's3', 's4'],
  finalStates: ['s4'],
  startStates: ['s1'],
  symbols: ['a', 'b'],
  transitions: [
    {
      from: 's1',
      to: 's2',
      alphabet: 'a'
    },
    {
      from: 's2',
      to: 's3',
      alphabet: 'b'
    },
    {
      from: 's3',
      to: 's4',
      alphabet: 'a'
    }
  ]
}
