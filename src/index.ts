import { ErrorResult, isErrorResult } from "./error-result";

export type None = null;


export type Err<T, E extends Error = Error> = {
  data: never,
  error: E,
  get errorStack(): Error[],
  unwrap(): void,
  unwrapOr<D>(defaultValue: D): D,
  mapErr<E2 extends Error>(fn: (err: E) => E2): Err<T, E2>,
  andThen<N>(fn: (data: never) => N): Err<T, E>
};

export type Ok<T> = {
  data: T,
  error: never,
  get errorStack(): never,
  unwrap(): T,
  unwrapOr<D>(defaultValue: D): T,
  mapErr<E2 extends Error>(fn: (err: never) => E2): Ok<T>,
  andThen<N>(fn: (data: T) => N): Ok<N>
};

export type Result<
  T, E extends Error = ErrorResult
> = Err<T, E> | Ok<T>;

export const err = <E extends Error>(
  error: E
): Err<None> => {
  if (isErrorResult(error)) {
    return {
      data: null as never,
      error: ErrorResult.fromExistingResult$$$(error),
      get errorStack() {
        return error.errorStack;
      },
      unwrap(): void {
        throw error;
      },
      mapErr<E2 extends Error>(fn: (err: E) => E2): Err<null, E2> {
        return err(ErrorResult.new$$$(error, fn(error))) as Err<null, E2>;
      },
      unwrapOr<D>(defaultValue: D): D {
        return defaultValue;
      },
      andThen(): Err<None> {
        return err(error);
      }
    };
  }
  const errorResult = ErrorResult.fromError$$$(error);
  return {
    data: null as never,
    error: errorResult,
    get errorStack() {
      return errorResult.errorStack;
    },
    unwrap() {
      throw error;
    },
    mapErr<E2 extends Error>(fn: (err: E) => E2): Err<null, E2> {
      return err(ErrorResult.new$$$(error, fn(error))) as Err<null, E2>;
    },
    unwrapOr<D>(defaultValue: D): D {
      return defaultValue;
    },
    andThen(): Err<None> {
      return err(error);
    }
  };
};

export const ok = <T>(
  data: T
): Ok<T> => ({
  data,
  error: null as never,
  get errorStack() {
    return null as never;
  },
  unwrap(): T {
    return data;
  },
  mapErr(): Ok<T> {
    return ok(data);
  },
  unwrapOr(): T {
    return data;
  },
  andThen<N>(fn: (data: T) => N): Ok<N> {
    return ok(fn(data));
  }
});

