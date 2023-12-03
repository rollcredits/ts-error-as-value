import { isPromise } from "./utils";

describe("isPromise", () => {
  it("should return true for promises", () => {
    const promise = new Promise((resolve) => setTimeout(() => resolve(true), 0));
    expect(isPromise(promise)).toBe(true);
  });

  it("should return false for non-promises", () => {
    expect(isPromise(123)).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise(() => {})).toBe(false);
  });
});