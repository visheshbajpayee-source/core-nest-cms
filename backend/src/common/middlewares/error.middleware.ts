import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Global Error Handler Middleware
 * Catches and formats all errors in a consistent manner
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = err;

  // Log error for debugging
  console.error("[Error Handler]", {
    message: err?.message,
    statusCode: err?.statusCode,
    stack: err?.stack,
  });

  // Handle Zod validation errors
  if (err?.name === "ZodError") {
    const validationErrors = err.errors.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    error = new ApiError(400, "Validation failed", validationErrors);
  }

  // Handle MongoDB/Mongoose errors
  if (err?.name === "MongoError" || err?.name === "MongoServerError") {
    error = new ApiError(400, "Database error", [err.message]);
  }

  // Handle Mongoose validation errors
  if (err?.name === "ValidationError") {
    const validationErrors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));

    error = new ApiError(400, "Validation failed", validationErrors);
  }

  // Handle duplicate key errors (MongoDB)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new ApiError(409, `${field} already exists`, [
      {
        field,
        message: `This ${field} is already registered`,
      },
    ]);
  }

  // Handle JWT errors
  if (err?.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token");
  }

  if (err?.name === "TokenExpiredError") {
    error = new ApiError(401, "Token has expired");
  }

  // Handle Cast errors (MongoDB invalid ObjectId)
  if (err?.name === "CastError") {
    error = new ApiError(400, "Invalid ID format");
  }

  // If not already an ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Internal server error";

    error = new ApiError(statusCode, message);
  }

  // Send error response
  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

/**
 * Not Found Route Handler
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new ApiError(404, "Route not found");
  next(error);
};
