
export const isPromise = <T>(value: T | Promise<T>): value is Promise<T> =>
  (value as any).then != null;