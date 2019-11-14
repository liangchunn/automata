import { AutomatonDescriptor } from '../types'

export const nonExistentStartStateFixture: AutomatonDescriptor = {
  states: ['s1'],
  finalStates: [],
  startStates: ['s2'],
  symbols: [],
  transitions: [],
}

export const nonExistentFinalStateFixture: AutomatonDescriptor = {
  states: ['s1'],
  finalStates: ['s2'],
  startStates: [],
  symbols: [],
  transitions: [],
}
