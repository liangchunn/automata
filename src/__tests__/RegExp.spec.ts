import { automatonFixtures } from '../__fixtures__'
import { AutomatonType } from '../types'
import { Automaton } from '../Automaton'

describe('convert to regexp', () => {
  const nfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.NFA
  )
  for (const fixture of nfaFixtures) {
    it(`can convert ${fixture.name} into a regular expression`, () => {
      const { config, regExp } = fixture
      expect(Automaton.getRegExp(config)).toEqual(regExp)
    })
  }
})
