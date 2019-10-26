import { AutomatonType } from '../types/AutomatonType'
import { AutomatonDescriptor } from '../types/AutomatonDescriptor'

type AutomatonFixture = {
  name: string
  type: AutomatonType
  config: AutomatonDescriptor
  regExp: string
  acceptedWords: {
    word: string | string[]
    pathLength: number
  }[]
  rejectedWords: string[] | string[][]
}

export const automatonFixtures: AutomatonFixture[] = [
  {
    name: 'simpleDfa',
    type: AutomatonType.DFA,
    config: {
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
    },
    regExp: 'aba',
    acceptedWords: [{ word: 'aba', pathLength: 1 }],
    rejectedWords: ['aaa', 'abb', 'baa', 'bab', 'bba', 'bbb']
  },
  {
    name: 'simpleNfa',
    type: AutomatonType.NFA,
    config: {
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
          from: 's1',
          to: 's3',
          alphabet: 'a'
        },
        {
          from: 's2',
          to: 's4',
          alphabet: 'a'
        },
        {
          from: 's3',
          to: 's4',
          alphabet: 'b'
        }
      ]
    },
    regExp: '#(aa|ab)#',
    acceptedWords: [
      {
        word: 'ab',
        pathLength: 1
      },
      {
        word: 'aa',
        pathLength: 1
      }
    ],
    rejectedWords: ['bb', 'ba']
  },
  {
    name: 'simpleNfaTwoPaths',
    type: AutomatonType.NFA,
    config: {
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
          from: 's1',
          to: 's3',
          alphabet: 'a'
        },
        {
          from: 's2',
          to: 's4',
          alphabet: 'b'
        },
        {
          from: 's3',
          to: 's4',
          alphabet: 'b'
        }
      ]
    },
    regExp: '#(ab|ab)#',
    acceptedWords: [
      {
        word: 'ab',
        pathLength: 2
      }
    ],
    rejectedWords: ['aa', 'bb', 'ba']
  },
  {
    name: 'simpleNfaWithThreeAlphabets',
    type: AutomatonType.NFA,
    config: {
      states: ['q0', 'q1', 'q2'],
      startStates: ['q0'],
      finalStates: ['q2'],
      transitions: [
        {
          from: 'q0',
          to: 'q0',
          alphabet: 'a'
        },
        {
          from: 'q0',
          to: 'q0',
          alphabet: 'b'
        },
        {
          from: 'q0',
          to: 'q2',
          alphabet: 'c'
        },
        {
          from: 'q0',
          to: 'q1',
          alphabet: 'a'
        },
        {
          from: 'q1',
          to: 'q2',
          alphabet: 'b'
        }
      ],
      symbols: ['a', 'b', 'c']
    },
    regExp: '#((a|b))*(c|ab)#',
    acceptedWords: [
      {
        word: 'aaaab',
        pathLength: 1
      },
      {
        word: 'babab',
        pathLength: 1
      },
      {
        word: 'bbbbc',
        pathLength: 1
      },
      {
        word: 'aaaac',
        pathLength: 1
      }
    ],
    rejectedWords: ['bbbbb', 'aaaaa', 'bbbba']
  },
  {
    name: 'nfaWithMultipleStartStates',
    type: AutomatonType.NFA,
    config: {
      states: ['s1', 's2', 's3', 's4'],
      startStates: ['s1', 's3'],
      finalStates: ['s4'],
      transitions: [
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
      ],
      symbols: ['a', 'b']
    },
    regExp: '(#a|#((b|a)|aba))b*#',
    acceptedWords: [
      {
        word: 'a',
        pathLength: 2
      },
      {
        word: 'bbb',
        pathLength: 1
      },
      {
        word: 'aba',
        pathLength: 1
      }
    ],
    rejectedWords: ['ba', 'baaaa', 'aa', 'aaa']
  },
  {
    name: 'complexNfaWithTrapState',
    type: AutomatonType.NFA,
    config: {
      states: ['1', '2', '3', '4'],
      startStates: ['4'],
      finalStates: ['4', '3', '2'],
      transitions: [
        {
          from: '4',
          to: '3',
          alphabet: 'a'
        },
        {
          from: '4',
          to: '3',
          alphabet: 'b'
        },
        {
          from: '3',
          to: '3',
          alphabet: 'b'
        },
        {
          from: '3',
          to: '4',
          alphabet: 'a'
        },
        {
          from: '4',
          to: '2',
          alphabet: 'b'
        },
        {
          from: '2',
          to: '2',
          alphabet: 'a'
        },
        {
          from: '2',
          to: '1',
          alphabet: 'b'
        },
        {
          from: '1',
          to: '1',
          alphabet: 'a'
        },
        {
          from: '1',
          to: '1',
          alphabet: 'b'
        }
      ],
      symbols: ['a', 'b']
    },
    regExp: '#((a|b)b*a)*((#|ba*#)|(a|b)b*#)',
    acceptedWords: [
      {
        word: '',
        pathLength: 1
      },
      {
        word: 'a',
        pathLength: 1
      },
      {
        word: 'b',
        pathLength: 2
      },
      {
        word: 'bbb',
        pathLength: 1
      },
      {
        word: 'baaaaaaa',
        pathLength: 2
      }
    ],
    rejectedWords: []
  }
]
