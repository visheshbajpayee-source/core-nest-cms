import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { ApiError } from "../utils/ApiError";

/**
 * Role-based authorization middleware
 * @param allowedRoles - list of roles allowed to access route
 */
export const authorize = (...allowedRoles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    // Check if user exists (should already be attached by auth.middleware)
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }

    next();
  };
};
