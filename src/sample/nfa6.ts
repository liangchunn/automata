export default {
  states: ['4', '3', '2,3', '2,4', '1,3', '1,2,3', '1,4', '1,2,4'],
  transitions: [
    { from: '4', to: '3', alphabet: 'a' },
    { from: '4', to: '2,3', alphabet: 'a' },
    { from: '4', to: '2,3', alphabet: 'b' },
    { from: '3', to: '4', alphabet: 'a' },
    { from: '3', to: '3', alphabet: 'b' },
    { from: '2,3', to: '2,4', alphabet: 'a' },
    { from: '2,3', to: '1,3', alphabet: 'b' },
    { from: '2,4', to: '2,3', alphabet: 'a' },
    { from: '2,4', to: '1,2,3', alphabet: 'b' },
    { from: '1,3', to: '1,4', alphabet: 'a' },
    { from: '1,3', to: '1,3', alphabet: 'b' },
    { from: '1,2,3', to: '1,2,4', alphabet: 'a' },
    { from: '1,2,3', to: '1,3', alphabet: 'b' },
    { from: '1,4', to: '1,3', alphabet: 'a' },
    { from: '1,4', to: '1,2,3', alphabet: 'b' },
    { from: '1,2,4', to: '1,2,3', alphabet: 'a' },
    { from: '1,2,4', to: '1,2,3', alphabet: 'b' }
  ],
  startStates: ['4'],
  finalStates: ['4', '3', '2,3', '2,4', '1,3', '1,2,3', '1,4', '1,2,4'],
  symbols: ['a', 'b']
}
