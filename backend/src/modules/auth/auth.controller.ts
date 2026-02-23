import { Request, Response } from "express";
import { login } from "./auth.service";

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};