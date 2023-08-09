### Typescript error as value

### Motivation
At [RollCredits](https://www.rollcredits.io/) we have all come to the conclusion that try / catch causes more headaches than it's worth, and wanted a good error as values system to use in its place.

Any error-as-values library in typescript is liable for being used *a lot* within any project which adds it, so making the API as convenient as humanly possible was our primary concern.

The alternative typescript libraries for achieving errors-as-values all seem to have verbose and cumbersome APIs, often wrapping all returns with class instances, and asking you to call method on them such as "isOk" or "isErr" to function.

Instead of this, we leverage typescript's discriminated unions to handle most of the heavy lifting for us. This greatly (in our opinion) reduces how cumbersome the API is to use.

To further decrease friction for using this in your project, We have also included the ability to import the functions and types of this package into your project's global scope.

---

### Install

```bash
yarn install ts-error-as-value
```
---

### (Optionally) Make functions and types global
```ts
import "ts-error-as-value/lib/globals";
```
This will make the functions ok, fail and withResult, as well as the types Ok, Fail and Result globally available

---

## ok and fail - Basic Usage
Creating `Ok` and `Fail` result objects
```ts
const { data, error } = ok("Hello");
if (error) {
  // do something with error
} else {
  // do something with data
}
```
or
```ts
const { data, error } = fail(new Error("Error"));
if (error) {
  // do something with error
} else {
  // do something with data
}
```
---

Wrapping the returns from functions with `fail` for errors, and `ok` for non-error so that the function calling it receives a `Result` type.

```ts
const fnWithResult = (): Result<string, Error> => {
  if ("" !== "") {
    return ok("hello");
  }
  return fail(new Error("Method failed"));
};

const { data, error } = fnWithResult();

if (error) {
  // is an error
} else {
  // data is guaranteed to be a string here, and error is guaranteed to be null
}
```

Or with promises:

```ts
const fnWithResult = async (): Promise<Result<string, Error>> => {
  if ("" !== "") {
    return ok("hello");
  }
  return fail(new Error("Method failed"));
};

const callsFnThatCallsFnWithResult = async () => {
  const { data, error, errorStack } = (await fnWithResult())
  if (error) {
    return fail(error);
  }
  return ok(data);
};

callsFnThatCallsFnWithResult();
```

--- 

### Chaining methods on a `Result`
```ts

class NewError extends Error {}

const fnWithResult = (): Result<string, Error> => {
  if ("" !== "") {
    return ok("hello");
  }
  return fail(new Error("Method failed"));
};

const callsFnThatCallsFnWithResult = async (): Promise<Result<boolean, NewError>> => {
  const { data, error } = fnWithResult()
    // Because of using mapErr below, error will be an instance of NewError if fnWithResult returns an error
    .mapErr(error => new NewError("Failed to call fnWithResult"))
    // Because of using andThen below, data will be boolean if fnWithResult returns a value.
    .andThen(data => {
      return data === "hello";
    });
  if (error) {
    return fail(error);
  }
  return ok(data);
};
```

---

## withResult
*One downside to using a system where errors are treated as values in javascript is that you have no control over whether a third party dependency will throw errors or not. As a result, we need a way to wrap functions that can throw errors and force them to return a result for us.*

withResult is a function which wraps another function and returns an `Err` result if the wrapped function throws an error,
 or an `Ok` result if the wrapped function does not.
```ts
import somePkg from "package-that-throws-errors";

const doStuff = withResult(somePkg.doStuff);

const { data, error } = await doStuff("hello");

if (error) {
  // the function doStuff in the package threw an error
}
```

---

## API

```typescript
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

```

```ts
function fail<E extends Error>(error: E): Fail<E>;
function ok<T>(data: T): Ok<T>;
```

```ts
// When the wrapped function returns a promise
function withResult<T, E extends Error, R>(
  fn: (...args: T[]) => Promise<R>
): (
  ...args: T[]
) => Promise<Result<R, E>>

// When the wrapped function does not return a promise
function withResult<T, E extends Error, R>(
  fn: (...args: T[]) => R
): (
  ...args: T[]
) => Result<R, E>
```
---




