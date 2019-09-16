import {
  globalSymbol,
  nonExistentStateInTransitions1,
  nonExistentStateInTransitions2
} from '../__fixtures__'
import { Automaton } from '../Automaton'

describe('validation', () => {
  it('throws when the global start symbol is used', () => {
    expect(() => new Automaton(globalSymbol)).toThrow()
  })
  it('throws when a non-existing state is referenced in the transitions in "to"', () => {
    expect(() => new Automaton(nonExistentStateInTransitions1)).toThrow()
  })
  it('throws when a non-existing state is referenced in the transitions in "from"', () => {
    expect(() => new Automaton(nonExistentStateInTransitions2)).toThrow()
  })
})
