### Typescript error as value

### Motivation
At [RollCredits](https://www.rollcredits.io/) we have all come to the conclusion that try / catch *really* sucks and wanted a good error as values system to use in its place.

The current libraries for doing so all seem to have verbose and cumbersome APIs that do stuff like wrapping all returns with class instances which have methods such as "isOk" or "isErr.

Instead of this, leveraging typescript's type engine to do more of the heavy lifting here by using discriminated unions between the Error and Non-Error states in a Result instead, greatly (in our opinion) reducing how cumbersome the API is to use.

On top of that, having the ability to optionally import this package into your project's global scope was also important for us, as the types and functions in this library is one you'll probably be using in almost every file.

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
This will make the functions ok and err, as well as the types Ok, Err and Result globally available

---

### Result type

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

---

### Functions
```ts
function err<E extends Error>(error: E): Err<E>;
function ok<T>(data: T): Ok<T>;
```

---

### Basic Usage
*Wrap the returns from functions with err for errors, and ok for non-error so that the function calling it receives a Result type.*

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
  // guaranteed to not be an error, and typescript knows this
}
```

---

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

### Methods on Result
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
```