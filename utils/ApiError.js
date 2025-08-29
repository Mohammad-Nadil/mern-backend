class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", code = "") {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.message = message; 
    this.code = code || statusCode; 

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };