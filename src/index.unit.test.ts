import { ok, err, Failure, Result, Success } from "../src";


describe("Result", () => {

  describe("Fail type", () => {
    let errorInstance: Result<string, Error>;
    const testError = new Error("Test error");

    beforeEach(() => {
      errorInstance = err(testError);
    });

    it("should throw error on unwrap for Err type", () => {
      expect(() => errorInstance.successOrThrow()).toThrow(testError);
    });

    it("should return default value on unwrapOr for Err type", () => {
      expect(errorInstance.successOrDefault("default")).toBe("default");
    });

    it("should map error using mapErr for Err type", () => {
      const newError = new Error("New error");
      const { error } = errorInstance.transformOnFailure(() => newError);
      if (error) {
        expect(error.message).toBe(newError.message);
      }
    });

    it("should return itself on andThen for Err type", () => {
      const result = errorInstance.transformOnSuccess(() => "new value");
      expect(JSON.stringify(result)).toEqual(JSON.stringify(errorInstance));
    });
  });

  describe("Ok type", () => {
    let okInstance: Success<string>;
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
      expect(okInstance.successOrThrow()).toBe(testData);
    });

    it("should return data on unwrapOr for Ok type", () => {
      expect(okInstance.successOrDefault("default")).toBe(testData);
    });

    it("should return itself on mapErr for Ok type", () => {
      const result = okInstance.transformOnFailure(() => new Error("New error"));
      expect(JSON.stringify(result)).toEqual(JSON.stringify(okInstance));
    });

    it("should execute andThen and return new Ok type", () => {
      const newValue = "new value";
      const result = okInstance.transformOnSuccess(() => newValue);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(ok(newValue)));
      expect(result.data).toBe(newValue);
    });
  });
});
