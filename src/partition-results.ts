import { Result } from "./index";
import { isPromise } from "./utils";

export interface PartitionedResults<T, E extends Error> {
  data: T[],
  errors: AggregateError | E | null
}

const isResultArray = <T, E extends Error>(array: any[]): array is Result<T, E>[] =>
  array.every(item => (item && "data" in item && "error" in item));

const isPromiseResultArray = <T, E extends Error>(array: any[]): array is Promise<Result<T, E>>[] =>
  array.every(isPromise);

export function partitionResults<T, E extends Error>(
  results: Result<T, E>[]
): PartitionedResults<T, E>;

export function partitionResults<T, E extends Error>(
  results: Promise<Result<T, E>[]>
): Promise<PartitionedResults<T, E>>;

export function partitionResults<T, E extends Error>(
  results: Promise<Result<T, E>>[]
): Promise<PartitionedResults<T, E>>;

/**
 * @desc Takes in an array of Results, an array of promises of results, or a promise of an
 * array of results, and returns an object with a data property containing an array of all
 * the data from the results, and an errors property containing an AggregateError if there
 * were multiple errors, a single error if there was only one, or null if there were no
 * errors.
 */
export function partitionResults<T, E extends Error>(
  results: Result<T, E>[] | Promise<Result<T, E>[]> | Promise<Result<T, E>>[]
): PartitionedResults<T, E> | Promise<PartitionedResults<T, E>> {
  const processResults = (results: Result<T, E>[]): PartitionedResults<T, E> => {
    const data: T[] = [];
    const errors: E[] = [];

    for (const result of results) {
      if (result.error) {
        errors.push(result.error);
      } else {
        data.push(result.data as T);
      }
    }

    let partitionedErrors: null | AggregateError | E = null;
    if (errors.length > 1) {
      partitionedErrors = new AggregateError(errors);
    } else if (errors.length > 0) {
      partitionedErrors = errors[0];
    }

    return {
      data,
      errors: partitionedErrors
    };
  };

  // Check if results is a Promise
  if (isPromise(results)) {
    return results.then(resolvedResults => {
      // Handle Promise<Result<T, E>[]>
      if (Array.isArray(resolvedResults)) {
        return processResults(resolvedResults);
      } else {
        return Promise.all(resolvedResults).then(processResults);
      }
    });
  } else if (Array.isArray(results)) { // Check if results is a Promise[]
    if (isResultArray(results)) {
      // Handle Result<T, E>[]
      return processResults(results);
    } else if (isPromiseResultArray(results)) {
      // Handle Promise<Result<T, E>>[]
      return Promise.all(results).then(processResults);
    }
  }

  // Handle Result<T, E>[]
  return processResults(results);
}



