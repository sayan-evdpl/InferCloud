class ApiError extends Error {
  constructor(
    statusCode,
    message = "Error",
    data = null,
    success = false,
    stack = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
