import { Designation } from "./designation.model";
import {
  CreateDesignationDto,
  UpdateDesignationDto,
  DesignationResponseDto,
} from "../../dto/designation.dto";
import { ApiError } from "../../common/utils/ApiError";
import { ErrorMessages } from "../../common/utils/ApiError";

/**
 * Create Designation
 */
export const createDesignation = async (
  data: CreateDesignationDto
): Promise<DesignationResponseDto> => {

  const existing = await Designation.findOne({ title: data.title });

  if (existing) {
    throw ApiError.conflict("Designation title already exists");
  }

  const designation = await Designation.create(data);

  return {
    id: designation._id.toString(),
    title: designation.title,
    description: designation.description,
    isActive: designation.isActive,
    createdAt: designation.createdAt,
    updatedAt: designation.updatedAt,
  };
};

/**
 * Get All (Only Active)
 */
export const getAllDesignations = async (
  includeInactive: boolean = false
): Promise<DesignationResponseDto[]> => {

  const filter = includeInactive ? {} : { isActive: true };

  const designations = await Designation.find(filter);

  return designations.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    description: d.description,
    isActive: d.isActive,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));
};

/**
 * Get By ID
 */
export const getDesignationById = async (
  id: string
): Promise<DesignationResponseDto> => {

  const designation = await Designation.findById(id);

  if (!designation) {
    throw ApiError.notFound("Designation not found");
  }

  return {
    id: designation._id.toString(),
    title: designation.title,
    description: designation.description,
    isActive: designation.isActive,
    createdAt: designation.createdAt,
    updatedAt: designation.updatedAt,
  };
};

/**
 * Update
 */
export const updateDesignation = async (
  id: string,
  data: UpdateDesignationDto
): Promise<DesignationResponseDto> => {

  const designation = await Designation.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );

  if (!designation) {
    throw ApiError.notFound("Designation not found");
  }

  return {
    id: designation._id.toString(),
    title: designation.title,
    description: designation.description,
    isActive: designation.isActive,
    createdAt: designation.createdAt,
    updatedAt: designation.updatedAt,
  };
};

/**
 * Soft Delete (Deactivate)
 */
export const deactivateDesignation = async (
  id: string
): Promise<void> => {

  const designation = await Designation.findById(id);

  if (!designation) {
    throw ApiError.notFound("Designation not found");
  }

  designation.isActive = false;
  await designation.save();
};