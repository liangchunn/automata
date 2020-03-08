import { noop } from './noop'
import { Arity } from '../types/Arity'

export function pipe<T>(): Arity<T, T>
export function pipe<T, A>(fn1: Arity<T, A>): Arity<T, A>
export function pipe<T, A, B>(fn1: Arity<T, A>, fn2: Arity<A, B>): Arity<T, B>
export function pipe<T, A, B, C>(
  fn1: Arity<T, A>,
  fn2: Arity<A, B>,
  fn3: Arity<B, C>
): Arity<T, C>
export function pipe<T, A, B, C, D>(
  fn1: Arity<T, A>,
  fn2: Arity<A, B>,
  fn3: Arity<B, C>,
  fn4: Arity<C, D>
): Arity<T, D>
export function pipe<T, A, B, C, D, E>(
  fn1: Arity<T, A>,
  fn2: Arity<A, B>,
  fn3: Arity<B, C>,
  fn4: Arity<C, D>,
  fn5: Arity<D, E>
): Arity<T, E>
export function pipe<T, A, B, C, D, E, F>(
  fn1: Arity<T, A>,
  fn2: Arity<A, B>,
  fn3: Arity<B, C>,
  fn4: Arity<C, D>,
  fn5: Arity<D, E>,
  fn6: Arity<E, F>
): Arity<T, F>
export function pipe<T, A, B, C, D, E, F, G>(
  fn1: Arity<T, A>,
  fn2: Arity<A, B>,
  fn3: Arity<B, C>,
  fn4: Arity<C, D>,
  fn5: Arity<D, E>,
  fn6: Arity<E, F>,
  fn7: Arity<F, G>
): Arity<T, G>
export function pipe<T, A, B, C, D, E, F, G, H>(
  fn1: Arity<T, A>,
  fn2: Arity<A, B>,
  fn3: Arity<B, C>,
  fn4: Arity<C, D>,
  fn5: Arity<D, E>,
  fn6: Arity<E, F>,
  fn7: Arity<F, G>,
  fn8: Arity<G, H>
): Arity<T, H>
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  fn1: Arity<T, A>,
  fn2: Arity<A, B>,
  fn3: Arity<B, C>,
  fn4: Arity<C, D>,
  fn5: Arity<D, E>,
  fn6: Arity<E, F>,
  fn7: Arity<F, G>,
  fn8: Arity<G, H>,
  fn9: Arity<H, I>
): Arity<T, I>
export function pipe<T, A, B, C, D, E, F, G, H, I>(
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
): Arity<T, {}>
export function pipe(...fns: Arity<any, any>[]): Arity<any, any> {
  return pipeFromArray(fns)
}

export function pipeFromArray<T, R>(fns: Array<Arity<T, R>>): Arity<T, R> {
  if (!fns) {
    return noop as Arity<any, any>
  }

  if (fns.length === 1) {
    return fns[0]
  }

  return function piped(input: T): R {
    return fns.reduce((prev: any, fn: Arity<T, R>) => fn(prev), input as any)
  }
}
