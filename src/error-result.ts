import { Err } from ".";


type ErrOkMethodProps = {
  [K in keyof Err<any> as Err<any>[K] extends (...args: any[]) => any ? K : never]: K
};

type ErrOkMethods = ErrOkMethodProps[keyof ErrOkMethodProps];

const errMethods: ErrOkMethods[] = [
  "unwrap",
  "unwrapOr",
  "mapErr",
  "andThen"
];

export const isErrorResult = (err: Error | ErrorResult): err is ErrorResult =>
  (err as any)._isErrorResult;

export class ErrorResult extends Error {
  _isErrorResult: true = true;
  errorStack: Error[] = [];
  private constructor(...errorStacks: Array<ErrorResult | Error>) {
    super("ErrorResult");
    let newErrorStack: Error[] = [];
    for (const errorStack of errorStacks) {
      if (isErrorResult(errorStack)) {
        newErrorStack= [
          ...newErrorStack,
          ...errorStack.errorStack
        ];
      } else {
        newErrorStack.push(errorStack);
      }
    }
    // Remove errors from the errorStack that were created by internal methods (there has to be a better way to do this right?)
    this.errorStack = newErrorStack.filter(stack => !errMethods.some(method => stack.stack?.slice(0, 45).includes(method)));
    if (errorStacks.length) {
      this.stack = errorStacks[0].stack;
      this.cause = errorStacks[0].cause;
      this.name = errorStacks[0].name;
    }
  }

  static getCurrentStackLocation$$$(): string {
    const stack = new Error().stack;
    if (!stack) {
      return "No stack information found";
    }
    const lines = stack.split("\n");
    const newLines = lines.slice(1)
      .filter(line => (
        !line.includes("getCurrentStackLocation$$$")
        && !line.includes("removeInternalStackLines$$$")
        && !line.includes("fromError$$$")
        && !line.includes("fromExistingResult$$$")
        && !line.includes("new$$$")
        && !line.includes("getAnonymousError$$$")
        && !line.includes("at err (")
        && !line.includes("at ok (")
      ));
    if (!newLines.length) {
      return stack;
    }
    return [
      lines[0],
      ...newLines
    ].join("\n");
  }

  static removeInternalStackLines$$$(stack?: string) {
    if (!stack) {
      return stack;
    }
    const lines = stack.split("\n");
    const newLines = [
      lines[0],
      ...lines.slice(3)
    ];
    return newLines.join("\n");
  }

  static fromError$$$<E extends Error>(error: E): E {
    return ErrorResult.new$$$(error) as unknown as E;
  }

  static getAnonymousError$$$(): Error {
    const error = new Error("Anonymous err trace");
    error.stack = ErrorResult.getCurrentStackLocation$$$();
    return error;
  }
  static fromExistingResult$$$<E extends Error>(existingError: E): E {
    return ErrorResult.new$$$(existingError, ErrorResult.getAnonymousError$$$()) as unknown as E;
  }
  static new$$$<E extends Error>(...errors: Array<ErrorResult | Error>): E {
    return new ErrorResult(...errors.length ? errors : [ ErrorResult.getAnonymousError$$$() ]) as unknown as E;
  }

  static newFromMethod$$$(methodName: ErrOkMethods, ...errors: Array<ErrorResult | Error>): ErrorResult {
    return new ErrorResult(...errors, new Error(methodName));
  }

}
