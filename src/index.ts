import * as util from 'util'
import { StateInit, TransitionInit, Automaton } from './Automaton'

//       +--+      +--+      +--+
//  +--->+s1+--a-->+s2+--b-->+s3+<---+
//       ++-+      +--+      +-++
//        |                    |
//        |                    |
//       a,b                   |
//        |                    a
//        v                    |
//      +----+                 |
//      |----|                 |
// +-----|s4|-<----------------+
// |    |----|
// |    +----+
// b      ^
// |      |
// +------+
//
const states: StateInit[] = ['s1', 's2', 's3', 's4']
const transitions: TransitionInit[] = [
  {
    from: 's1',
    to: 's2',
    alphabet: 'a'
  },
  {
    from: 's1',
    to: 's4',
    alphabet: 'b'
  },
  {
    from: 's1',
    to: 's4',
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
  },
  {
    from: 's4',
    to: 's4',
    alphabet: 'b'
  }
]
const startStates: StateInit[] = ['s1', 's3']
const finalStates: StateInit[] = ['s4']

const automaton = new Automaton(states, transitions, startStates, finalStates)

const simulation = automaton.simulate('abab')

console.log(
  util.inspect(simulation, {
    showHidden: false,
    depth: null
  })
)
