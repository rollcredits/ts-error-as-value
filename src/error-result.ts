
export const isErrorResult = (err: Error | ErrorResult): err is ErrorResult =>
  (err as any)._isErrorResult;

export class ErrorResult extends Error {
  _isErrorResult: true = true;
  _errorStack: Error[] = [];
  private constructor(...errorStacks: Array<ErrorResult | Error>) {
    super("ErrorResult");
    let newErrorStack: Error[] = [];
    for (const errorStack of errorStacks) {
      if (isErrorResult(errorStack)) {
        newErrorStack= [
          ...newErrorStack,
          ...errorStack._errorStack
        ];
      } else {
        newErrorStack.push(errorStack);
      }
    }
    this._errorStack = newErrorStack;
    if (errorStacks.length) {
      this.stack = errorStacks[0].stack;
      this.cause = errorStacks[0].cause;
      this.name = errorStacks[0].name;
    }
  }
  static fromError<E extends Error>(error: E): E {
    return ErrorResult.new(error) as unknown as E;
  }

  static getAnonymousError(): Error {
    return new Error("Anonymous err() return");
  }

  static fromExistingResult<E extends Error>(existingError: E): E {
    return ErrorResult.new(existingError, ErrorResult.getAnonymousError()) as unknown as E;
  }
  static new<E extends Error>(...errors: Array<ErrorResult | Error>): E {
    return new ErrorResult(...errors.length ? errors : [ ErrorResult.getAnonymousError() ]) as unknown as E;
  }

  static newWithoutTrace<E extends Error>(...errors: Array<ErrorResult | Error>): E {
    return new ErrorResult(...errors.length ? errors : [ ErrorResult.getAnonymousError() ]) as unknown as E;
  }

}
