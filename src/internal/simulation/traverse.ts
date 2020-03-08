import { AutomatonDescriptor, AutomatonSymbol } from '../../types'

export function traverse(
  transitions: AutomatonDescriptor['transitions'],
  symbol: string,
  fromState?: string
) {
  if (fromState === AutomatonSymbol.NULL_STATE_SYMBOL) {
    return [AutomatonSymbol.NULL_STATE_SYMBOL]
  }

  const elibigleTranstions = transitions.filter(
    transition =>
      (fromState ? transition.from === fromState : true) &&
      transition.alphabet === symbol
  )
  if (elibigleTranstions.length === 0) {
    return [AutomatonSymbol.NULL_STATE_SYMBOL]
  } else {
    return elibigleTranstions.map(transition => transition.to)
  }
}
