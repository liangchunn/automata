import { AutomatonContructorArgs } from '../Automaton'

const nfa7: AutomatonContructorArgs = {
  states: ['s0', 's1'],
  transitions: [
    { from: 's0', to: 's1', alphabet: 'a' },
    { from: 's0', to: 's1', alphabet: 'a' }
  ],
  startStates: ['s0'],
  finalStates: ['s1'],
  symbols: ['a']
}

export default nfa7
