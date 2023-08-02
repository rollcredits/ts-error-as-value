import { err, ok, Result, Ok, Err } from "./index";

export const isPromise = <T>(value: T | Promise<T>): value is Promise<T> =>
  (value as any).then != null;

/** Function which wraps another function and returns an Err result if the wrapped function throws an error,
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
        .catch(e => err(e) as Err<E>) as (R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E>);
    }
    return ok(data) as any;
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Unknown error");
    return err(e) as any;
  }
};



