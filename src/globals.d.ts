
type Success<T> = import(".").Success<T>;
type Failure<E extends Error> = import(".").Failure<any extends infer u ? u : never, E>;
type Result<T = void, E extends Error = Error> = import(".").Result<T, E>;

declare function ok<T = void>(data?: T): Success<T>;
declare function err<E extends Error>(error: E): Failure<E>;
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
declare function withResult<
  E extends Error,
  F extends ((...args: any[]) => any)
>(
  fn: F,
  fnContext?: ThisParameterType<F>
): (
  ...args: Parameters<F>
) => ReturnType<F> extends Promise<infer u> ? Promise<Result<u, E>> : Result<ReturnType<F>, E>;
