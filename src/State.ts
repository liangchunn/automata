import { Transition } from './Transition'

interface StateInterface {
  transitions: Transition[]
  label: string
  traverse: (alphabet: string) => StateInterface[]
}

export class State implements StateInterface {
  public transitions: Transition[]

  constructor(public label: string) {
    this.transitions = []
  }

  public traverse(alphabet: string): StateInterface[] {
    const eligibleTransition = this.transitions.filter(
      t => t.alphabet === alphabet
    )
    if (eligibleTransition.length === 0) {
      return [NullStateSingleton]
    } else {
      return eligibleTransition.map(t => t.to)
    }
  }
}

export class NullState implements StateInterface {
  public label = 'NullState'
  public transitions: Transition[] = []
  public traverse(_: string): StateInterface[] {
    return [this]
  }
}

const NullStateSingleton = new NullState()
