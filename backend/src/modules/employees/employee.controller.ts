import { Request, Response } from "express";
import * as employeeService from "./employee.service";

/**
 * CREATE
 */
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const result = await employeeService.createEmployee(req.body);

    return res.status(201).json({
      success: true,
      data: result,
      message: "Employee created successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error creating employee",
    });
  }
};

/**
 * GET ALL
 */
export const getAllEmployees = async (_req: Request, res: Response) => {
  try {
    const result = await employeeService.getAllEmployees();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching employees",
    });
  }
};

/**
 * GET BY ID
 */
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const result = await employeeService.getEmployeeById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching employee",
    });
  }
};

/**
 * UPDATE
 */
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const result = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Employee updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating employee",
    });
  }
};

/**
 * DELETE
 */
export const deleteEmployee = async (req: Request, res: Response) => {
  try { 
    const deleted = await employeeService.deleteEmployee(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error deleting employee",
    });
  }
};