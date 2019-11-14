import { Alphabet } from './'

export type State = string

export type AutomatonTransition = {
  from: State
  to: State
  alphabet: Alphabet
}

export type AutomatonDescriptor = {
  states: State[]
  startStates: State[]
  finalStates: State[]
  symbols: State[]
  transitions: AutomatonTransition[]
}
