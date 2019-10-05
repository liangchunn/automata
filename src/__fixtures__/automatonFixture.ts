import { AutomatonType, AutomatonContructorArgs } from '../Automaton'

type AutomatonFixture = {
  name: string
  type: AutomatonType
  config: AutomatonContructorArgs
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
    regExp: 'TODO', // TODO: add regexp
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
    regExp: 'TODO', // TODO: add regexp
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
    regExp: 'TODO', // TODO: add regexp
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
    regExp: 'TODO', // TODO: add regexp
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
  }
]
