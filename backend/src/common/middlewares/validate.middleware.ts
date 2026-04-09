import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: z.ZodType<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse and validate request body
      const validatedData = schema.parse(req.body);

      // Replace req.body with validated & sanitized data
      req.body = validatedData;

      next();
    } catch (error: any) {
      throw new ApiError(400, error.errors?.[0]?.message || "Invalid request data");
    }
  };