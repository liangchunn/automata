import { groupBy, keys } from 'lodash'
import { AutomatonType, AutomatonDescriptor } from './types'
import { Arity } from './types/Arity'
import { pipeFromArray } from './util/pipe'

export class Automaton {
  constructor(public descriptor: AutomatonDescriptor) {}
  /**
   * @intrinsic
   * Determine if a given automaton is a DFA or an NFA
   */
  public getAutomatonType(): AutomatonType {
    if (this.descriptor.startStates.length > 1) {
      return AutomatonType.NFA
    }
    let hasTwoDistinctTransitions = false
    const groupedTransitions = groupBy(this.descriptor.transitions, 'from')
    const groupedKeys = keys(groupedTransitions)
    for (const groupKey of groupedKeys) {
      const groupedAlphabets = groupBy(groupedTransitions[groupKey], 'alphabet')
      const alphabetKeys = keys(groupedAlphabets)
      for (const alphabetKey of alphabetKeys) {
        if (groupedAlphabets[alphabetKey].length > 1) {
          hasTwoDistinctTransitions = true
          break
        }
      }
      if (hasTwoDistinctTransitions) {
        break
      }
    }
    if (hasTwoDistinctTransitions) {
      return AutomatonType.NFA
    }
    return AutomatonType.DFA
  }

  public pipe(): Automaton
  public pipe<T, A>(fn1: Arity<T, A>): A
  public pipe<T, A, B>(fn1: Arity<T, A>, fn2: Arity<A, B>): B
  public pipe<T, A, B, C>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>
  ): C
  public pipe<T, A, B, C, D>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>,
    fn4: Arity<C, D>
  ): D
  public pipe<T, A, B, C, D, E>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>,
    fn4: Arity<C, D>,
    fn5: Arity<D, E>
  ): E
  public pipe<T, A, B, C, D, E, F>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>,
    fn4: Arity<C, D>,
    fn5: Arity<D, E>,
    fn6: Arity<E, F>
  ): F
  public pipe<T, A, B, C, D, E, F, G>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>,
    fn4: Arity<C, D>,
    fn5: Arity<D, E>,
    fn6: Arity<E, F>,
    fn7: Arity<F, G>
  ): G
  public pipe<T, A, B, C, D, E, F, G, H>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>,
    fn4: Arity<C, D>,
    fn5: Arity<D, E>,
    fn6: Arity<E, F>,
    fn7: Arity<F, G>,
    fn8: Arity<G, H>
  ): H
  public pipe<T, A, B, C, D, E, F, G, H, I>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>,
    fn4: Arity<C, D>,
    fn5: Arity<D, E>,
    fn6: Arity<E, F>,
    fn7: Arity<F, G>,
    fn8: Arity<G, H>,
    fn9: Arity<H, I>
  ): I
  public pipe<T, A, B, C, D, E, F, G, H, I>(
    fn1: Arity<T, A>,
    fn2: Arity<A, B>,
    fn3: Arity<B, C>,
    fn4: Arity<C, D>,
    fn5: Arity<D, E>,
    fn6: Arity<E, F>,
    fn7: Arity<F, G>,
    fn8: Arity<G, H>,
    fn9: Arity<H, I>,
    ...fns: Arity<any, any>[]
  ): {}
  public pipe(...operators: Arity<any, any>[]): any {
    return pipeFromArray(operators)(this)
  }
}
