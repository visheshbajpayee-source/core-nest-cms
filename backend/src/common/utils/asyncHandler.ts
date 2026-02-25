import { Request, Response, NextFunction } from "express";

/**
 * Wraps async controller functions
 * Automatically forwards errors to global error handler
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };