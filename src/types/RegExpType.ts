import { AutomatonDescriptor, AutomatonTransition } from './'

export type ApplySType =
  | {
      automaton: AutomatonDescriptor
      kind: RegExpStep.S
      transitions: AutomatonTransition[]
    }
  | {
      automaton: AutomatonDescriptor
      kind: RegExpStep.NO_OP
    }

export type ApplyVType =
  | {
      automaton: AutomatonDescriptor
      kind: RegExpStep.V
      transitions: AutomatonTransition[][]
    }
  | {
      automaton: AutomatonDescriptor
      kind: RegExpStep.NO_OP
    }

export type ApplyEType =
  | {
      automaton: AutomatonDescriptor
      kind: RegExpStep.E
      state: string
    }
  | {
      automaton: AutomatonDescriptor
      kind: RegExpStep.NO_OP
    }

export type ApplyInitType = {
  automaton: AutomatonDescriptor
  kind: RegExpStep.INIT
}

export type ApplyDefaultType = {
  automaton: AutomatonDescriptor
  kind: RegExpStep.DEFAULT
}

export type ApplyType =
  | ApplySType
  | ApplyVType
  | ApplyEType
  | ApplyInitType
  | ApplyDefaultType

export enum RegExpStep {
  DEFAULT = 'DEFAULT',
  INIT = 'INIT',
  S = 'S',
  V = 'V',
  E = 'E',
  NO_OP = 'NO_OP',
}

export type RegExpOpType =
  | {
      kind: RegExpStep.DEFAULT
    }
  | {
      kind: RegExpStep.INIT
    }
  | {
      kind: RegExpStep.S
    }
  | {
      kind: RegExpStep.V
    }
  | {
      kind: RegExpStep.E
    }
