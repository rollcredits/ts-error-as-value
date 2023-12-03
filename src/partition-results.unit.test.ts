import { err, ok, Result } from "./index";
import { PartitionedResults, partitionResults } from "./partition-results";

describe("partitionResults", () => {
  it("should partition array of Result objects correctly", () => {
    const results: Result<number, Error>[] = [
      ok(1),
      err(new Error("Error 1")),
      ok(2)
    ];
    const expected: PartitionedResults<number, Error> = {
      data: [ 1, 2 ],
      errors: new Error("Error 1")
    };
    expect(partitionResults(results)).toEqual(expected);
  });

  it("should handle promise resolving to Result array correctly", async () => {
    const resultsPromise = Promise.resolve<Result<number, Error>[]>([
      ok(3),
      err(new Error("Error 2"))
    ]);
    const expected: PartitionedResults<number, Error> = {
      data: [ 3 ],
      errors: new Error("Error 2")
    };
    const result = await partitionResults(resultsPromise);
    expect(result).toEqual(expected);
  });

  it("should handle array of promises resolving to Result objects correctly", async () => {
    const results: Promise<Result<number, Error>>[] = [
      Promise.resolve(ok(4)),
      Promise.resolve(err(new Error("Error 3")))
    ];
    const expected: PartitionedResults<number, Error> = {
      data: [ 4 ],
      errors: new Error("Error 3")
    };
    const result = await partitionResults(results);
    expect(result).toEqual(expected);
  });
});