import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/ApiResponse";
import * as designationService from "./designation.service";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

/**
 * Create Designation (Admin Only)
 */
export const createDesignation = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await designationService.createDesignation(req.body);

    return ApiResponse.created(
      "Designation created successfully",
      result
    ).send(res);
  }
);

/**
 * Get All Designations
 */
export const getAllDesignations = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const includeInactive = req.user?.role === "admin";

    const result = await designationService.getAllDesignations(includeInactive);

    return ApiResponse.ok(
      "Designations fetched successfully",
      result
    ).send(res);
  }
);

/**
 * Get Designation By ID
 */
export const getDesignationById = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await designationService.getDesignationById(req.params.id);

    return ApiResponse.ok(
      "Designation fetched successfully",
      result
    ).send(res);
  }
);

/**
 * Update Designation (Admin Only)
 */
export const updateDesignation = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await designationService.updateDesignation(
      req.params.id,
      req.body
    );

    return ApiResponse.updated(
      "Designation updated successfully",
      result
    ).send(res);
  }
);

/**
 * Deactivate Designation (Soft Delete)
 */
export const deactivateDesignation = asyncHandler(
  async (req: Request, res: Response) => {

    await designationService.deactivateDesignation(req.params.id);

    return ApiResponse.ok(
      "Designation deactivated successfully"
    ).send(res);
  }
);