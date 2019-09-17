import {
  globalSymbolFixture,
  nonExistentStateInTransitionsFixture1,
  nonExistentStateInTransitionsFixture2,
  nonExistentStartStateFixture,
  nonExistentFinalStateFixture
} from '../__fixtures__'
import { Automaton } from '../Automaton'
import { nonExistentTransitionAlphabetFixture } from '../__fixtures__/nonExistentTransitionAlphabetFixture'

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
