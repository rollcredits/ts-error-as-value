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
      error: ErrorResult.fromExistingResult$$$(error),
      get errorStack() {
        return error.errorStack;
      },
      unwrap(): void {
        throw error;
      },
      mapErr<E2 extends Error>(fn: (err: E) => E2): Err<None, E2> {
        return err<E2>(ErrorResult.new$$$(error, fn(error))) as Err<None, E2>;
      },
      unwrapOr<D>(defaultValue: D): D {
        return defaultValue;
      },
      andThen(): Err<None, E> {
        return err(error);
      }
    };
  }
  const errorResult = ErrorResult.fromError$$$(error);
  return {
    data: null as never,
    error: errorResult,
    get errorStack() {
      if (!isErrorResult(errorResult)) {
        return [];
      }
      return errorResult.errorStack;
    },
    unwrap() {
      throw error;
    },
    mapErr<E2 extends Error>(fn: (err: E) => E2): Err<None, E2> {
      return err(ErrorResult.new$$$(error, fn(error))) as Err<None, E2>;
    },
    unwrapOr<D>(defaultValue: D): D {
      return defaultValue;
    },
    andThen(): Err<None, E> {
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
    return [] as never;
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

class NewError extends Error {}

const fnWithResult = (): Result<string, Error> => {
  if ("" !== "") {
    return ok("hello");
  }
  return err(new Error("Method failed"));
};

const callsFnThatCallsFnWithResult = async (): Promise<Result<boolean, NewError>> => {
  const { data, error } = fnWithResult()
    // Error will be an instance of NewError if fnWithResult returns an error
    .mapErr(error => new NewError("Failed to call fnWithResult"))
    // Data will be boolean if fnWithResult returns a value.
    .andThen(data => {
      return data === "hello";
    });
  if (error) {
    return err(error);
  }
  return ok(data);
};
