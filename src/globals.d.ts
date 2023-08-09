
type Ok<T> = import(".").Ok<T>;
type Fail<E extends Error> = import(".").Fail<E>;
type Result<T, E extends Error> = import(".").Result<T, E>;

declare function ok<T>(data: T): Ok<T>;
declare function fail<E extends Error>(error: E): Fail<E>
declare function withResult<T, E extends Error, R>(
  fn: (...args: T[]) => R
): (
  ...args: T[]
) => R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E>
