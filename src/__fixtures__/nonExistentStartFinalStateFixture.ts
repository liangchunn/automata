import { AutomatonContructorArgs } from '../Automaton'

export const nonExistentStartStateFixture: AutomatonContructorArgs = {
  states: ['s1'],
  finalStates: [],
  startStates: ['s2'],
  symbols: [],
  transitions: []
}

export const nonExistentFinalStateFixture: AutomatonContructorArgs = {
  states: ['s1'],
  finalStates: ['s2'],
  startStates: [],
  symbols: [],
  transitions: []
}
