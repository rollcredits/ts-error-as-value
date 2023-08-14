

export type Failure<E extends Error = Error> = {
  data: null,
  error: E,
  successOrThrow(): void, // Returns the value, but throws an error if the result is an Error
  successOrDefault<D>(defaultValue: D): D, // Returns the value or gives you a default value if it's an error
  transformOnFailure<E2 extends Error>(fn: (fail: E) => E2): Failure<E2>, // If the result is an error, map the error to another error
  transformOnSuccess<N>(fn: (data: never) => N): Failure<E> // If the result is not an error, map the data in it
};

export type Success<T> = {
  data: T,
  error: null,
  successOrThrow(): T, // Returns the value, but throws an error if the result is an Error
  successOrDefault<D>(defaultValue: D): T, // Returns the value or gives you a default value if it's an error
  transformOnFailure<E2 extends Error>(fn: (fail: never) => E2): Success<T>, // If the result is an error, map the error to another error
  transformOnSuccess<N>(fn: (data: T) => N): Success<N> // If the result is not an error, map the data in it
};

export type Result<
  T, E extends Error = Error
> = Failure<E> | Success<T>;

const failure = <E extends Error>(
  error: E
): Failure<E> => ({
  data: null,
  error: error,
  successOrThrow() {
    throw error;
  },
  successOrDefault<D>(defaultValue: D): D {
    return defaultValue;
  },
  transformOnFailure<E2 extends Error>(fn: (err: E) => E2): Failure<E2> {
    return failure<E2>(fn(error));
  },
  transformOnSuccess(): Failure<E> {
    return this;
  }
});
const success = <T>(
  data: T
): Success<T> => ({
  data,
  error: null,
  successOrThrow(): T {
    return data;
  },
  successOrDefault(): T {
    return data;
  },
  transformOnFailure(): Success<T> {
    return this;
  },
  transformOnSuccess<N>(fn: (data: T) => N): Success<N> {
    return success(fn(data));
  }
});

export type ResultIs = {
  success<T>(data: T): Success<T>,
  failure<E extends Error>(failure: E): Failure<E>
};

export const ResultIs: ResultIs = {
  success,
  failure
};

