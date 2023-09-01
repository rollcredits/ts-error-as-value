import { ResultIs, Result, Success, Failure } from "./index";

export const isPromise = <T>(value: T | Promise<T>): value is Promise<T> =>
  (value as any).then != null;

/**
 * @desc Function which wraps another function and returns a new function that has the same argument types as the wrapped function.
 * This new function will return a Fail result if the wrapped function throws an error, and returns an Ok result if the wrapped function does not.
 * @param fn The wrapped function
 * @param fnContext (optional) the context to execute the wrapped function in (for e.g. if it's a class method and needs the instance's properties to function)
 *
 * @example

 const { data: bufferFromUTF, error } = withResult(Buffer.from)([], "utf-8");
 if (error) {
   return ResultIs.failure(error);
 }
 console.log(bufferFromUTF);

 */

export const withResult = <T, E extends Error, R>(
  fn: (...args: T[]) => R,
  fnContext?: any
) => (
  ...args: T[]
): R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E> => {
  try {
    const data = fnContext ? fn.apply(fnContext, args) : fn(...args);
    if (isPromise(data)) {
      return data
        .then(value => ResultIs.success(value) as Success<typeof value>)
        .catch(e => ResultIs.failure(e) as Failure<E>) as (R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E>);
    }
    return ResultIs.success(data) as any;
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Unknown error");
    return ResultIs.failure(e) as any;
  }
};



