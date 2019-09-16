import { AutomatonContructorArgs } from '../Automaton'

export const nonExistentStateInTransitions1: AutomatonContructorArgs = {
  states: ['s1', 's2'],
  finalStates: ['s2'],
  startStates: ['s1'],
  symbols: ['a', 'b'],
  transitions: [
    {
      from: 's1',
      to: 's3',
      alphabet: 'a'
    }
  ]
}

export const nonExistentStateInTransitions2: AutomatonContructorArgs = {
  states: ['s1', 's2'],
  finalStates: ['s2'],
  startStates: ['s1'],
  symbols: ['a', 'b'],
  transitions: [
    {
      from: 's3',
      to: 's1',
      alphabet: 'a'
    }
  ]
}
