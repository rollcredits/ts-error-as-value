
type Ok<T> = import(".").Ok<T>;
type Err<E extends Error> = import(".").Err<E>;
type None = import(".").None;
type Result<T, E extends Error> = import(".").Result<T, E>;

declare function ok<T>(data: T): import(".").Ok<T>;
declare function err<E extends Error>(error: E): import(".").Err<T>;
