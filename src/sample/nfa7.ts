import { AutomatonDescriptor } from '../types/AutomatonDescriptor'

const nfa7: AutomatonDescriptor = {
  states: ['s0', 's1'],
  transitions: [
    { from: 's0', to: 's1', alphabet: 'a' },
    { from: 's0', to: 's1', alphabet: 'a' },
  ],
  startStates: ['s0'],
  finalStates: ['s1'],
  symbols: ['a'],
}

export default nfa7
