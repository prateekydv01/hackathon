import mongoose from "mongoose";
import { ApiError } from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Fix instanceof check
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "Something went wrong!";

    error = new ApiError(
      statusCode,
      message,
      error?.errors || [],
      err.stack
    );
  }

  const errorResponse = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(errorResponse);
};

export { errorHandler };
