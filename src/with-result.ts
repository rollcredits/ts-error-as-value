import { fail, ok, Result, Ok, Fail } from "./index";

export const isPromise = <T>(value: T | Promise<T>): value is Promise<T> =>
  (value as any).then != null;

/** Function which wraps another function and returns a Fail result if the wrapped function throws an error,
 *  and returns an Ok result if the wrapped function does not. */
export const withResult = <T, E extends Error, R>(
  fn: (...args: T[]) => R
) => (
  ...args: T[]
): R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E> => {
  try {
    const data = fn(...args);
    if (isPromise(data)) {
      return data
        .then(value => ok(value) as Ok<typeof value>)
        .catch(e => fail(e) as Fail<E>) as (R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E>);
    }
    return ok(data) as any;
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Unknown error");
    return fail(e) as any;
  }
};



