import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Employee } from "../employees/employee.model";

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("REQ BODY:", req.body);

console.log("=== LOGIN DEBUG START ===");
console.log("EMAIL:", email);
console.log("PASSWORD:", password);

const employee = await Employee.findOne({
  email: email.toLowerCase().trim(),
}).select("+password");

console.log("EMPLOYEE FOUND:", !!employee);
console.log("DB EMAIL:", employee?.email);
console.log("DB PASSWORD:", employee?.password);

    if (!employee) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid email or password",
        errors: [],
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
  password,
  employee.password
);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid email or password",
        errors: [],
      });
    }

    const accessToken = jwt.sign(
      {
        id: employee._id,
        role: employee.role,
      },
       process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          id: employee._id,
          fullName: employee.fullName,
          email: employee.email,
          role: employee.role,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default loginController;