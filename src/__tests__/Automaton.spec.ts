import {
  automatonFixtures,
  globalSymbolFixture,
  nonExistentStateInTransitionsFixture1,
  nonExistentStateInTransitionsFixture2,
  nonExistentStartStateFixture,
  nonExistentFinalStateFixture,
  nonExistentTransitionAlphabetFixture,
} from '../__fixtures__'
import { Automaton } from '../Automaton'
import { AutomatonType } from '../types'
import { validateAutomaton } from '../Validation'
import { simulateAll } from '../operators/simulate'
import { toDfa } from '../operators'

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

describe('automaton type', () => {
  const dfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.DFA
  )
  const nfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.NFA
  )
  for (const fixture of dfaFixtures) {
    it(`verifies that ${fixture.name} is a DFA`, () => {
      const { config } = fixture
      expect(new Automaton(config).getAutomatonType()).toBe(AutomatonType.DFA)
    })
  }
  for (const fixture of nfaFixtures) {
    it(`verifies that ${fixture.name} is a NFA`, () => {
      const { config } = fixture
      expect(new Automaton(config).getAutomatonType()).toBe(AutomatonType.NFA)
    })
  }
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
      const automaton = new Automaton(config)
      for (const word of acceptedWords) {
        const simulation = automaton.pipe(simulateAll(word.word))
        expect(simulation.accepted).toBe(true)
        expect(simulation.acceptedPaths).toHaveLength(word.pathLength)
      }
      for (const word of rejectedWords) {
        const simulation = automaton.pipe(simulateAll(word))
        expect(simulation.accepted).toBe(false)
        expect(simulation.acceptedPaths).toHaveLength(0)
      }
    })
  }

  for (const fixture of nfaFixtures) {
    it(`can simulate words in the NFA ${fixture.name}`, () => {
      const { config, acceptedWords, rejectedWords } = fixture
      const automaton = new Automaton(config)
      for (const word of acceptedWords) {
        const simulation = automaton.pipe(simulateAll(word.word))
        expect(simulation.accepted).toBe(true)
        expect(simulation.acceptedPaths).toHaveLength(word.pathLength)
      }
      for (const word of rejectedWords) {
        const simulation = automaton.pipe(simulateAll(word))
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
      const dfa = new Automaton(fixture.config).pipe(toDfa)
      for (const word of fixture.acceptedWords) {
        expect(dfa.pipe(simulateAll(word.word)).accepted).toEqual(
          dfa.pipe(simulateAll(word.word)).accepted
        )
      }
      for (const word of fixture.rejectedWords) {
        expect(dfa.pipe(simulateAll(word)).accepted).toEqual(
          dfa.pipe(simulateAll(word)).accepted
        )
      }
    })
  }
})
