

export type Fail<E extends Error = Error> = {
  data: null,
  error: E,
  unwrap(): void, // Returns the value, but throws an error if the result is an Error
  unwrapOr<D>(defaultValue: D): D, // Returns the value or gives you a default value if it's an error
  mapFail<E2 extends Error>(fn: (fail: E) => E2): Fail<E2>, // If the result is an error, map the error to another error
  andThen<N>(fn: (data: never) => N): Fail<E> // If the result is not an error, map the data in it
};

export type Ok<T> = {
  data: T,
  error: null,
  unwrap(): T, // Returns the value, but throws an error if the result is an Error
  unwrapOr<D>(defaultValue: D): T, // Returns the value or gives you a default value if it's an error
  mapFail<E2 extends Error>(fn: (fail: never) => E2): Ok<T>, // If the result is an error, map the error to another error
  andThen<N>(fn: (data: T) => N): Ok<N> // If the result is not an error, map the data in it
};

export type Result<
  T, E extends Error = Error
> = Fail<E> | Ok<T>;

export const fail = <E extends Error>(
  error: E
): Fail<E> => {
  return {
    data: null,
    error: error,
    unwrap() {
      throw error;
    },
    mapFail<E2 extends Error>(fn: (err: E) => E2): Fail<E2> {
      return fail<E2>(fn(error));
    },
    unwrapOr<D>(defaultValue: D): D {
      return defaultValue;
    },
    andThen(): Fail<E> {
      return this;
    }
  };
};

export const ok = <T>(
  data: T
): Ok<T> => ({
  data,
  error: null,
  unwrap(): T {
    return data;
  },
  mapFail(): Ok<T> {
    return this;
  },
  unwrapOr(): T {
    return data;
  },
  andThen<N>(fn: (data: T) => N): Ok<N> {
    return ok(fn(data));
  }
});

