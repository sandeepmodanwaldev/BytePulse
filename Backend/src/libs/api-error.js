class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wongs",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
    (this.errors = errors), (this.message = message), (this.success = false);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
