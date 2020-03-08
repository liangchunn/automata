import { flatten } from 'lodash'
import { traverse } from '../internal/simulation/traverse'
import { SimulationType, AutomatonSymbol } from '../types'
import { Node } from '../util/Node'
import { Automaton } from '../Automaton'
import { invariant } from '../util/invariant'

export function simulateAll(word: string[] | string) {
  return (automaton: Automaton) => {
    const generator = simulate(word)(automaton)
    let result
    for (const value of generator) {
      result = value
    }
    return result as SimulationType
  }
}

export function simulate(word: string[] | string) {
  return function*(
    automaton: Automaton
  ): Generator<Node | SimulationType, void, unknown> {
    const { startStates, transitions, finalStates } = automaton.descriptor
    let states = startStates

    const rootNode = new Node(AutomatonSymbol.START_SYMBOL, null, [])

    rootNode.children = states.map(s => new Node(s, rootNode, []))

    let ptrs = rootNode.children

    for (const alphabet of word) {
      // maybe extract a traverse method out?
      const nextStates = states.map(state =>
        traverse(transitions, alphabet, state)
      )

      invariant(
        nextStates.length === ptrs.length,
        'Next states and execution pointer must have the same length'
      )

      for (let i = 0; i < ptrs.length; i++) {
        const ptr = ptrs[i]
        ptr.children = nextStates[i].map(i => new Node(i, ptr, []))
      }
      ptrs = flatten(ptrs.map(i => i.children))
      states = flatten(nextStates)
      yield rootNode
    }
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
}
