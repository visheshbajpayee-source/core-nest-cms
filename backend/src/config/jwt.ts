import jwt from "jsonwebtoken";
import { env } from "./env";

export const generateToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1d" });
};