import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/ApiResponse";
import * as departmentService from "./department.service";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

/**
 * Create Department (Admin Only)
 */
export const createDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await departmentService.createDepartment(req.body);

    return ApiResponse.created(
      "Department created successfully",
      result
    ).send(res);
  }
);

/**
 * Get All Departments
 */
export const getAllDepartments = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const includeInactive = req.user?.role === "admin";

    const result = await departmentService.getAllDepartments(includeInactive);

    return ApiResponse.ok(
      "Departments fetched successfully",
      result
    ).send(res);
  }
);

/**
 * Get Department By ID
 */
export const getDepartmentById = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await departmentService.getDepartmentById(req.params.id);

    return ApiResponse.ok(
      "Department fetched successfully",
      result
    ).send(res);
  }
);

/**
 * Update Department (Admin Only)
 */
export const updateDepartment = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await departmentService.updateDepartment(
      req.params.id,
      req.body
    );

    return ApiResponse.updated(
      "Department updated successfully",
      result
    ).send(res);
  }
);

/**
 * Soft Delete (Deactivate)
 */
export const deactivateDepartment = asyncHandler(
  async (req: Request, res: Response) => {

    await departmentService.deactivateDepartment(req.params.id);

    return ApiResponse.ok(
      "Department deactivated successfully"
    ).send(res);
  }
);