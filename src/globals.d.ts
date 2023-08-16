
type Success<T> = import(".").Success<T>;
type Failure<E extends Error> = import(".").Failure<E>;
type Result<T = void, E extends Error = Error> = import(".").Result<T, E>;
declare class ResultIs {
  // If no argument is given to success, assume the success result type is void
  static success: () => Success<void>;
  static success: <T>(data: T) => Success<T>;
  static failure: <E extends Error>(failure: E) => Failure<E>;
}

declare function withResult<T, E extends Error, R>(
  fn: (...args: T[]) => R
): (
  ...args: T[]
) => R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E>;
