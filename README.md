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
This will make the functions ok, err and withResult, as well as the types Ok, Err and Result globally available

---

## ok and err - Basic Usage
Creating `Ok` and `Err` result objects
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
const { data, error } = err(new Error("Error"));
if (error) {
  // do something with error
} else {
  // do something with data
}
```
---

Wrapping the returns from functions with `err` for errors, and `ok` for non-error so that the function calling it receives a `Result` type.

```ts
const fnWithResult = (): Result<string, Error> => {
  if ("" !== "") {
    return ok("hello");
  }
  return err(new Error("Method failed"));
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
  return err(new Error("Method failed"));
};

const callsFnThatCallsFnWithResult = async () => {
  const { data, error, errorStack } = (await fnWithResult())
  if (error) {
    return err(error);
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
  return err(new Error("Method failed"));
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
    return err(error);
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

## Error stack
One advantage of using errors as values is that we know exactly where an error was created and by whom. Taking advantage of this is still a WiP, however currently we keep track of information about all errors which we encountered in the current chain of Err results.

```ts

const fn1 = () => err(new Error("Hello"));

const fn2 = () => fn1().mapErr(() => new Error("World"));

const { errorStack } = fn2();
```
would produce
```json
 [
   { "message": "Hello", "stack": "..." },
   { "message": "World", "stack": "..." }
 ]
```

---

## API

```typescript
type None = null;

type Err<T, E extends Error = Error> = {
  data: never,
  error: E,
  get errorStack(): Error[],
  unwrap(): void, // Returns the value, but throws an error if the result is an Error
  unwrapOr<D>(defaultValue: D): D, // Returns the value or gives you a default value if it's an error
  mapErr<E2 extends Error>(fn: (err: E) => E2): Err<T, E2>, // If the result is an error, map the error to another error
  andThen<N>(fn: (data: never) => N): Err<T, E> // If the result is not an error, map the data in it
};

type Ok<T> = {
  data: T,
  error: never,
  get errorStack(): never,
  unwrap(): T, // Returns the value, but throws an error if the result is an Error
  unwrapOr<D>(defaultValue: D): T, // Returns the value or gives you a default value if it's an error
  mapErr<E2 extends Error>(fn: (err: never) => E2): Ok<T>, // If the result is an error, map the error to another error
  andThen<N>(fn: (data: T) => N): Ok<N> // If the result is not an error, map the data in it
};

type Result<T, E extends Error = ErrorResult> = 
  | Err<T, E>
  | Ok<T>;

```

```ts
function err<E extends Error>(error: E): Err<E>;
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




