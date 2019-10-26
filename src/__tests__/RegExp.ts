import { automatonFixtures } from '../__fixtures__'
import { AutomatonType } from '../types/AutomatonType'
import { Automaton } from '../Automaton'

describe('convert to regexp', () => {
  const nfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.NFA
  )
  for (const fixture of nfaFixtures) {
    it(`can convert ${fixture.name} into a regular expression`, () => {
      const { config, regExp } = fixture
      expect(Automaton.convertToRegExp(config)).toEqual(regExp)
    })
  }
})
