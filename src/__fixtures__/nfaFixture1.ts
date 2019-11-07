import { AutomatonDescriptor } from '../types/AutomatonDescriptor'

export const nfaFixture1: AutomatonDescriptor = {
  states: ['1', '2', '3', '4'],
  startStates: ['4'],
  finalStates: ['4', '3', '2'],
  transitions: [
    {
      from: '4',
      to: '3',
      alphabet: 'a',
    },
    {
      from: '4',
      to: '3',
      alphabet: 'b',
    },
    {
      from: '3',
      to: '3',
      alphabet: 'b',
    },
    {
      from: '3',
      to: '4',
      alphabet: 'a',
    },
    {
      from: '4',
      to: '2',
      alphabet: 'b',
    },
    {
      from: '2',
      to: '2',
      alphabet: 'a',
    },
    {
      from: '2',
      to: '1',
      alphabet: 'b',
    },
    {
      from: '1',
      to: '1',
      alphabet: 'a',
    },
    {
      from: '1',
      to: '1',
      alphabet: 'b',
    },
  ],
  symbols: ['a', 'b'],
}
