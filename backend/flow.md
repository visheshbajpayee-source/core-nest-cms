📂 1️⃣ DTO Creation

DTOs define the shape of data moving between layers.

📂 src/dto/user.dto.ts

// Request DTO
export interface LoginUserDto {
  email: string;
  password: string;
}

// Response DTO
export interface LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

🧠 What Just Happened?

LoginUserDto → what service expects

LoginResponseDto → what client receives

These exist ONLY at compile-time

They do NOT validate runtime data

**********************************************************************


📂 2️⃣ Model Interface + Schema

Now we define database structure.

📂 src/modules/employees/employee.model.ts

import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "employee";
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);

🧠 What Is This Interface?

IUser:

Represents full DB document

Includes password

Includes timestamps

Used by Mongoose

Exists only at compile-time

Schema:

Exists at runtime

Controls DB structure

**********************************************************************


📂 3️⃣ Validation Layer (Zod)

📂 src/modules/auth/auth.validation.ts

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


This:

Runs at runtime

Rejects invalid input

First security layer

**********************************************************************


📂 4️⃣ Auth Service

📂 src/modules/auth/auth.service.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../employees/employee.model";
import { LoginUserDto, LoginResponseDto } from "../../dto/user.dto";
import { ApiError } from "../../common/utils/ApiError";

export const loginUser = async (
  data: LoginUserDto
): Promise<LoginResponseDto> => {

  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  return {
    accessToken: token,
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

🧠 Where Did We Use DTO?

Here:

data: LoginUserDto


and

Promise<LoginResponseDto>


DTO ensures:

Service input is correct shape

Service output is controlled

Password never included in response

DTO protects developer mistakes.

**********************************************************************


📂 5️⃣ Controller

📂 src/modules/auth/auth.controller.ts

import { Request, Response } from "express";
import * as authService from "./auth.service";
import { ApiResponse } from "../../common/utils/ApiResponse";

export const login = async (req: Request, res: Response) => {

  const result = await authService.loginUser(req.body);

  return res.status(200).json(
    new ApiResponse(true, result, "Login successful")
  );
};

Controller:

Calls service

Sends formatted response

Does not touch database

**********************************************************************
📂 6️⃣ Route

📂 src/modules/auth/auth.routes.ts

import { Router } from "express";
import { login } from "./auth.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import { loginSchema } from "./auth.validation";

const router = Router();

router.post("/login", validate(loginSchema), login);

export default router;

**********************************************************************

📂 src/common/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: ZodSchema) =>
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
