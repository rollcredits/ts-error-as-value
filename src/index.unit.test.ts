import { err, Err, Ok, ok } from "../src";
import { isErrorResult } from "./error-result";


describe("Result", () => {

  describe("Err type", () => {
    let errorInstance: Err<null>;
    const testError = new Error("Test error");

    beforeEach(() => {
      errorInstance = err(testError);
    });

    it("should return error for Err type", () => {
      expect(isErrorResult(errorInstance.error)).toBeTruthy();
    });

    it("should return error stack for Err type", () => {
      expect(errorInstance.errorStack).toEqual(expect.arrayContaining([ testError ]));
    });

    it("should throw error on unwrap for Err type", () => {
      expect(() => errorInstance.unwrap()).toThrow(testError);
    });

    it("should return default value on unwrapOr for Err type", () => {
      expect(errorInstance.unwrapOr("default")).toBe("default");
    });

    it("should map error using mapErr for Err type", () => {
      const newError = new Error("New error");
      const { error } = errorInstance.mapErr(() => newError);
      expect(isErrorResult(error)).toBeTruthy();
      if (isErrorResult(error)) {
        expect(error._errorStack[error._errorStack.length - 1].message).toBe(newError.message);
      }
    });

    it("should return itself on andThen for Err type", () => {
      const result = errorInstance.andThen(() => "new value");
      expect(JSON.stringify(result)).toEqual(JSON.stringify(errorInstance));
    });
  });

  describe("Ok type", () => {
    let okInstance: Ok<string>;
    const testData = "test data";

    beforeEach(() => {
      okInstance = ok(testData);
    });

    it("should return data for Ok type", () => {
      expect(okInstance.data).toBe(testData);
    });

    it("should return null error for Ok type", () => {
      expect(okInstance.error).toBeNull();
    });

    it("should return data on unwrap for Ok type", () => {
      expect(okInstance.unwrap()).toBe(testData);
    });

    it("should return data on unwrapOr for Ok type", () => {
      expect(okInstance.unwrapOr("default")).toBe(testData);
    });

    it("should return itself on mapErr for Ok type", () => {
      const result = okInstance.mapErr(() => new Error("New error"));
      expect(JSON.stringify(result)).toEqual(JSON.stringify(okInstance));
    });

    it("should execute andThen and return new Ok type", () => {
      const newValue = "new value";
      const result = okInstance.andThen(() => newValue);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(ok(newValue)));
      expect(result.data).toBe(newValue);
    });
  });
});
