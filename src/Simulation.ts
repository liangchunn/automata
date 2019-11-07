import { flatten } from 'lodash'
import { AutomatonDescriptor } from './types/AutomatonDescriptor'
import { AutomatonSymbol } from './types/AutomatonSymbol'
import { Node } from './Node'

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

export function simulateAll(
  automaton: AutomatonDescriptor,
  word: string[] | string
) {
  const generator = simulate(automaton, word)
  let result
  for (const value of generator) {
    result = value
  }
  return result as {
    accepted: boolean
    acceptedPaths: string[][]
  }
}

export function* simulate(
  automaton: AutomatonDescriptor,
  word: string[] | string
) {
  let states = automaton.startStates

  const rootNode = new Node(AutomatonSymbol.START_SYMBOL, null, [])

  rootNode.children = states.map(s => new Node(s, rootNode, []))

  let ptrs = rootNode.children

  for (const alphabet of word) {
    // maybe extract a traverse method out?
    const nextStates = states.map(state =>
      traverse(automaton.transitions, alphabet, state)
    )
    if (nextStates.length !== ptrs.length) {
      const error = new Error(
        'Invariant violation: next states and execution pointer must have the same length'
      )
      error.name = 'InvariantError'
      throw error
    }

    for (let i = 0; i < ptrs.length; i++) {
      const ptr = ptrs[i]
      ptr.children = nextStates[i].map(i => new Node(i, ptr, []))
    }
    ptrs = flatten(ptrs.map(i => i.children))
    states = flatten(nextStates)
    yield rootNode
  }
  const finalStates = automaton.finalStates
  const acceptedPointers = ptrs.filter(ptr => finalStates.includes(ptr.label))
  const acceptedPaths: string[][] = []

  for (const ptr of acceptedPointers) {
    const path: string[] = []
    let node: Node | null = ptr
    while (node !== null) {
      path.push(node.label)
      node = node.parent
    }
    acceptedPaths.push(path.reverse())
  }
  yield {
    accepted: acceptedPaths.length > 0,
    acceptedPaths,
  }
}
