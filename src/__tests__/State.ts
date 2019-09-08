import { NullState, State } from '../State'
import { Transition } from '~/Transition'

describe('NullState', () => {
  it('can create a NullState with no transitions', () => {
    const nullState = new NullState()
    expect(nullState.label).toEqual(NullState.NULL_STATE_LABEL)
    expect(nullState.transitions).toHaveLength(0)
  })
  it('returns a itself if traverse() is called', () => {
    const nullState = new NullState()
    expect(nullState.traverse('')[0]).toBe(nullState)
  })
})

describe('State', () => {
  it('can create a State with a label', () => {
    const label = 's1'
    const state = new State(label)
    expect(state.label).toEqual(label)
  })
  it('returns the next state if there is an eligible transition', () => {
    const transitionLabel = 'a'
    const s1 = new State('s1')
    const s2 = new State('s2')
    s1.transitions.push(new Transition(s1, s2, transitionLabel))
    expect(s1.traverse(transitionLabel)[0]).toBe(s2)
  })
  it('returns a NullState if there is no eligible transition', () => {
    const transitionLabel = 'a'
    const s1 = new State('s1')
    expect(s1.traverse(transitionLabel)[0].label).toBe(
      NullState.NULL_STATE_LABEL
    )
  })
})
