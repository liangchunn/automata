import { AutomatonDescriptor } from '../types/AutomatonDescriptor'

export const nonExistentStateInTransitionsFixture1: AutomatonDescriptor = {
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

export const nonExistentStateInTransitionsFixture2: AutomatonDescriptor = {
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
