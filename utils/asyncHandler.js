import { ApiError } from "./ApiError.js";

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) =>
      next(new ApiError(400, err.message, err.stack))
    );
  };
};

export { asyncHandler };
