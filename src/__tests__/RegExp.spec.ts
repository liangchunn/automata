import { automatonFixtures } from '../__fixtures__'
import { AutomatonType } from '../types'
import { Automaton } from '../Automaton'
import { toRegExp } from '../operators'

describe('convert to regexp', () => {
  const nfaFixtures = automatonFixtures.filter(
    automaton => automaton.type === AutomatonType.NFA
  )
  for (const fixture of nfaFixtures) {
    it(`can convert ${fixture.name} into a regular expression`, () => {
      const { config, regExp } = fixture
      const automaton = new Automaton(config)
      expect(automaton.pipe(toRegExp)).toEqual(regExp)
    })
  }
})
