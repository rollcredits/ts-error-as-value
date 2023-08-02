
type Ok<T> = import(".").Ok<T>;
type Err<E extends Error> = import(".").Err<E>;
type None = import(".").None;
type Result<T, E extends Error> = import(".").Result<T, E>;

declare function ok<T>(data: T): Ok<T>;
declare function err<E extends Error>(error: E): Err<E>
declare function withResult<T, E extends Error, R>(
  fn: (...args: T[]) => R
): (
  ...args: T[]
) => R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E>
