

// Using Jest for the tests
import { ErrorResult, isErrorResult } from "./error-result";

describe("ErrorResult", () => {

  // Testing the fromError$$$ method
  test("fromError$$$ should create an ErrorResult from a standard Error", () => {
    const standardError = new Error("Standard Error");
    const result = ErrorResult.fromError(standardError);
    expect(isErrorResult(result)).toBeTruthy();
    if (isErrorResult(result)) {
      expect(result._errorStack).toEqual([ standardError ]);
    }
  });

  // Testing the fromExistingResult$$$ method
  test("fromExistingResult$$$ should return the existing ErrorResult if no internal methods are in the errorStack", () => {
    const existingError = ErrorResult.new();
    const result = ErrorResult.fromExistingResult(existingError);
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ "_isErrorResult": true,"errorStack": [ {},{} ],"name": "Error" }));
  });

  // Test the getCurrentStackLocation$$$ method
  test("getCurrentStackLocation$$$ should not include internal method stack traces", () => {
    const stackLocation = ErrorResult.getCurrentStackLocation$$$();
    expect(stackLocation).not.toContain("getCurrentStackLocation$$$");
    // ... and other excluded methods
  });

  // Testing the removeInternalStackLines$$$ method
  test("removeInternalStackLines$$$ should remove the first 2 lines after the error message", () => {
    const stack = "Error: message\nat line1\nat line2\nat line3\nat line4";
    const newStack = ErrorResult.removeInternalStackLines$$$(stack);
    expect(newStack).toBe("Error: message\nat line3\nat line4");
  });

  // Testing the new$$$ method
  test("new$$$ should create a new ErrorResult with the provided errors", () => {
    const error1 = new Error("Error 1");
    const error2 = ErrorResult.new();
    expect(isErrorResult(error2)).toBeTruthy();
    const result = ErrorResult.new(error1, error2);
    expect(isErrorResult(result)).toBeTruthy();
    if (isErrorResult(result) && isErrorResult(error2)) {
      expect(result._errorStack).toEqual([ error1, ...error2._errorStack ]);
    }
  });

});

