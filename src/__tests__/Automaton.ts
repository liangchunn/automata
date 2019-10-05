import {
  globalSymbolFixture,
  nonExistentStateInTransitionsFixture1,
  nonExistentStateInTransitionsFixture2,
  nonExistentStartStateFixture,
  nonExistentFinalStateFixture,
  nonExistentTransitionAlphabetFixture,
  automatonFixtures
} from '../__fixtures__'
import { Automaton, AutomatonType } from '../Automaton'

describe('validation', () => {
  it('throws when the global start symbol is used', () => {
    expect(() => new Automaton(globalSymbolFixture)).toThrow()
  })
  it('throws when a non-existing state is referenced in the transitions in "to"', () => {
    expect(() => new Automaton(nonExistentStateInTransitionsFixture1)).toThrow()
  })
  // TODO: fix this
  it.skip('throws when a non-existing state is referenced in the transitions in "from"', () => {
    expect(() => new Automaton(nonExistentStateInTransitionsFixture2)).toThrow()
  })
  it('throws when a non-existent start state is referenced from states', () => {
    expect(() => new Automaton(nonExistentStartStateFixture)).toThrow()
  })
  it('throws when a non-existent final state is referenced from states', () => {
    expect(() => new Automaton(nonExistentFinalStateFixture)).toThrow()
  })
  it('throws when a transition contains a symbol not in the symbols list', () => {
    expect(() => new Automaton(nonExistentTransitionAlphabetFixture)).toThrow()
  })
})

describe('automaton simulation', () => {
  const dfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.DFA
  )
  const nfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.NFA
  )
  for (const fixture of dfaFixtures) {
    it(`can simulate words in the DFA ${fixture.name}`, () => {
      const { config, acceptedWords, rejectedWords, type } = fixture
      const dfa = new Automaton(config)
      expect(dfa.type).toBe(type)
      for (const word of acceptedWords) {
        const simulation = dfa.simulate(word.word)
        expect(simulation.accepted).toBe(true)
        expect(simulation.acceptedPaths).toHaveLength(word.pathLength)
      }
      for (const word of rejectedWords) {
        const simulation = dfa.simulate(word)
        expect(simulation.accepted).toBe(false)
        expect(simulation.acceptedPaths).toHaveLength(0)
      }
    })
  }

  for (const fixture of nfaFixtures) {
    it(`can simulate words in the NFA ${fixture.name}`, () => {
      const { config, acceptedWords, rejectedWords, type } = fixture
      const nfa = new Automaton(config)
      expect(nfa.type).toBe(type)
      for (const word of acceptedWords) {
        const simulation = nfa.simulate(word.word)
        expect(simulation.accepted).toBe(true)
        expect(simulation.acceptedPaths).toHaveLength(word.pathLength)
      }
      for (const word of rejectedWords) {
        const simulation = nfa.simulate(word)
        expect(simulation.accepted).toBe(false)
        expect(simulation.acceptedPaths).toHaveLength(0)
      }
    })
  }
})

describe('NFA to DFA conversion', () => {
  const nfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.NFA
  )
  for (const fixture of nfaFixtures) {
    it(`can convert the NFA ${fixture.name} into a DFA`, () => {
      const nfa = new Automaton(fixture.config)
      expect(() => nfa.convertToDfa()).not.toThrow()
      expect(() => nfa.convertToDfa().convertToDfa()).toThrow()
    })
    it(`accepts the same word as the converted DFA of the original NFA ${fixture.name}`, () => {
      const nfa = new Automaton(fixture.config)
      const dfa = nfa.convertToDfa()
      for (const word of fixture.acceptedWords) {
        expect(nfa.simulate(word.word).accepted).toEqual(
          dfa.simulate(word.word).accepted
        )
      }
      for (const word of fixture.rejectedWords) {
        expect(nfa.simulate(word).accepted).toEqual(dfa.simulate(word).accepted)
      }
    })
  }
})
