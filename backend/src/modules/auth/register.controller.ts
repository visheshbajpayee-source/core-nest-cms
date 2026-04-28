import { Request, Response } from "express";
import { Employee } from "../employees/employee.model";

const registerController = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      department,
      designation,
      dateOfJoining,
    } = req.body;

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    await Employee.create({
      fullName,
      email,
      password,
      department,
      designation,
      dateOfJoining,
      role: "employee",
    });

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};

export default registerController;