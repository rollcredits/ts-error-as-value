import { ErrorResult, isErrorResult } from "./error-result";

export type None = null;

export type Err<T, E extends Error = Error> = {
  data: never,
  error: E,
  get errorStack(): Error[],
  unwrap(): void, // Returns the value, but throws an error if the result is an Error
  unwrapOr<D>(defaultValue: D): D, // Returns the value or gives you a default value if it's an error
  mapErr<E2 extends Error>(fn: (err: E) => E2): Err<T, E2>, // If the result is an error, map the error to another error
  andThen<N>(fn: (data: never) => N): Err<T, E> // If the result is not an error, map the data in it
};

export type Ok<T> = {
  data: T,
  error: never,
  get errorStack(): never,
  unwrap(): T, // Returns the value, but throws an error if the result is an Error
  unwrapOr<D>(defaultValue: D): T, // Returns the value or gives you a default value if it's an error
  mapErr<E2 extends Error>(fn: (err: never) => E2): Ok<T>, // If the result is an error, map the error to another error
  andThen<N>(fn: (data: T) => N): Ok<N> // If the result is not an error, map the data in it
};

export type Result<
  T, E extends Error = ErrorResult
> = Err<T, E> | Ok<T>;

export const err = <E extends Error>(
  error: E
): Err<None, E> => {
  if (isErrorResult(error)) {
    return {
      data: null as never,
      error: ErrorResult.fromExistingResult(error),
      get errorStack() {
        return error._errorStack;
      },
      unwrap(): void {
        throw error;
      },
      mapErr<E2 extends Error>(fn: (err: E) => E2): Err<None, E2> {
        return removeLastErrorStackItem(err<E2>(ErrorResult.new(error, fn(error))));
      },
      unwrapOr<D>(defaultValue: D): D {
        return defaultValue;
      },
      andThen(): Err<None, E> {
        return this;
      }
    };
  }
  const errorResult = ErrorResult.fromError(error);
  return {
    data: null as never,
    error: errorResult,
    get errorStack() {
      if (!isErrorResult(errorResult)) {
        return [];
      }
      return errorResult._errorStack;
    },
    unwrap() {
      throw error;
    },
    mapErr<E2 extends Error>(fn: (err: E) => E2): Err<None, E2> {
      return removeLastErrorStackItem(err<E2>(ErrorResult.new(error, fn(error))));
    },
    unwrapOr<D>(defaultValue: D): D {
      return defaultValue;
    },
    andThen(): Err<None, E> {
      return this;
    }
  };
};

export const ok = <T>(
  data: T
): Ok<T> => ({
  data,
  error: null as never,
  get errorStack() {
    return [] as never;
  },
  unwrap(): T {
    return data;
  },
  mapErr(): Ok<T> {
    return this;
  },
  unwrapOr(): T {
    return data;
  },
  andThen<N>(fn: (data: T) => N): Ok<N> {
    return ok(fn(data));
  }
});

const removeLastErrorStackItem = <T, E extends Error>(result: Err<T, E>): Err<T, E> => {
  if (result.error) {
    const newErrorResult: any = { ...result.error };
    newErrorResult._errorStack = newErrorResult._errorStack.slice(0, -1);
    return { ...result, error: newErrorResult };
  }
  return result;
};
