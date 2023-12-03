// Assuming a jest-like syntax for demonstration purposes.
import { ok, err, Result } from "../src";
import { withResult } from "./with-result";



describe("withResult", () => {
  describe("for synchronous functions", () => {
    it("should return Ok for successful executions", () => {
      const func = (n: number) => n + 1;
      const wrapped = withResult(func);
      expect(JSON.stringify(wrapped(1))).toStrictEqual(JSON.stringify(ok(2)));
    });

    it("should return Fail for errors", () => {
      const errorFunc = (): Result<null, Error> => {
        throw new Error("Oops!");
      };
      const wrapped = withResult(errorFunc);
      const result = wrapped();
      expect(result.error).not.toBeNull();
    });
  });

  describe("for asynchronous functions", () => {
    it("should return Ok for successful promise resolutions", async () => {
      const asyncFunc = async (n: number) => n + 1;
      const wrapped = withResult(asyncFunc);
      const result = await wrapped(1);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(ok(2)));
    });

    it("should return Fail for rejected promises", async () => {
      const errorAsyncFunc = async () => {
        throw new Error("Oops async!");
      };
      const wrapped = withResult(errorAsyncFunc);
      const result = await wrapped();
      expect(result.error).not.toBeNull();
    });
  });
});
