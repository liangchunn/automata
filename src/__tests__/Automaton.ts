import {
  automatonFixtures,
  globalSymbolFixture,
  nonExistentStateInTransitionsFixture1,
  nonExistentStateInTransitionsFixture2,
  nonExistentStartStateFixture,
  nonExistentFinalStateFixture,
  nonExistentTransitionAlphabetFixture
} from '../__fixtures__'
import { Automaton } from '../Automaton'
import { AutomatonType } from '../types/AutomatonType'
import { validateAutomaton } from '../Validation'

describe('validation', () => {
  it('throws when the global start symbol is used', () => {
    expect(() => validateAutomaton(globalSymbolFixture)).toThrow()
  })
  it('throws when a non-existing state is referenced in the transitions in "to"', () => {
    expect(() =>
      validateAutomaton(nonExistentStateInTransitionsFixture1)
    ).toThrow()
  })
  it('throws when a non-existing state is referenced in the transitions in "from"', () => {
    expect(() =>
      validateAutomaton(nonExistentStateInTransitionsFixture2)
    ).toThrow()
  })
  it('throws when a non-existent start state is referenced from states', () => {
    expect(() => validateAutomaton(nonExistentStartStateFixture)).toThrow()
  })
  it('throws when a non-existent final state is referenced from states', () => {
    expect(() => validateAutomaton(nonExistentFinalStateFixture)).toThrow()
  })
  it('throws when a transition contains a symbol not in the symbols list', () => {
    expect(() =>
      validateAutomaton(nonExistentTransitionAlphabetFixture)
    ).toThrow()
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
      const { config, acceptedWords, rejectedWords } = fixture
      for (const word of acceptedWords) {
        const simulation = Automaton.simulateAll(config, word.word)
        expect(simulation.accepted).toBe(true)
        expect(simulation.acceptedPaths).toHaveLength(word.pathLength)
      }
      for (const word of rejectedWords) {
        const simulation = Automaton.simulateAll(config, word)
        expect(simulation.accepted).toBe(false)
        expect(simulation.acceptedPaths).toHaveLength(0)
      }
    })
  }

  for (const fixture of nfaFixtures) {
    it(`can simulate words in the NFA ${fixture.name}`, () => {
      const { config, acceptedWords, rejectedWords } = fixture
      for (const word of acceptedWords) {
        const simulation = Automaton.simulateAll(config, word.word)
        expect(simulation.accepted).toBe(true)
        expect(simulation.acceptedPaths).toHaveLength(word.pathLength)
      }
      for (const word of rejectedWords) {
        const simulation = Automaton.simulateAll(config, word)
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
    it(`accepts thee same word as the converted DFA of the original NFA ${fixture.name}`, () => {
      const dfaConfig = Automaton.convertToDfa(fixture.config)
      for (const word of fixture.acceptedWords) {
        expect(
          Automaton.simulateAll(fixture.config, word.word).accepted
        ).toEqual(Automaton.simulateAll(dfaConfig, word.word).accepted)
      }
      for (const word of fixture.rejectedWords) {
        expect(Automaton.simulateAll(fixture.config, word).accepted).toEqual(
          Automaton.simulateAll(dfaConfig, word).accepted
        )
      }
    })
  }
})
