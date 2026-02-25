import { Department } from "./department.model";
import { Employee } from "../employees/employee.model";
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentResponseDto,
} from "../../dto/department.dto";
import { ApiError } from "../../common/utils/ApiError";

/**
 * Create Department
 */
export const createDepartment = async (
  data: CreateDepartmentDto
): Promise<DepartmentResponseDto> => {

  // Check duplicate manually (clean error message)
  const existing = await Department.findOne({ name: data.name.toLowerCase() });

  if (existing) {
    throw ApiError.conflict("Department already exists");
  }

  // Validate departmentHead if provided
  if (data.departmentHead) {
    const manager = await Employee.findById(data.departmentHead);

    if (!manager) {
      throw ApiError.notFound("Department head not found");
    }

    if (manager.role !== "manager") {
      throw ApiError.badRequest("Department head must be a manager");
    }
  }

  const department = await Department.create({
    ...data,
    name: data.name.toLowerCase(),
  });

  return mapToResponse(department);
};

/**
 * Get All Departments
 */
export const getAllDepartments = async (
  includeInactive: boolean = false
): Promise<DepartmentResponseDto[]> => {

  const filter = includeInactive ? {} : { isActive: true };

  const departments = await Department.find(filter).populate(
    "departmentHead",
    "fullName email"
  );

  return departments.map(mapToResponse);
};

/**
 * Get Department By ID
 */
export const getDepartmentById = async (
  id: string
): Promise<DepartmentResponseDto> => {

  const department = await Department.findById(id).populate(
    "departmentHead",
    "fullName email"
  );

  if (!department) {
    throw ApiError.notFound("Department not found");
  }

  return mapToResponse(department);
};

/**
 * Update Department
 */
export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentDto
): Promise<DepartmentResponseDto> => {

  const department = await Department.findById(id);

  if (!department) {
    throw ApiError.notFound("Department not found");
  }

  if (!department.isActive) {
    throw ApiError.badRequest("Cannot update inactive department");
  }

  // Validate departmentHead if provided
  if (data.departmentHead) {
    const manager = await Employee.findById(data.departmentHead);

    if (!manager) {
      throw ApiError.notFound("Department head not found");
    }

    if (manager.role !== "manager") {
      throw ApiError.badRequest("Department head must be a manager");
    }
  }

  if (data.name) {
    department.name = data.name.toLowerCase();
  }

  if (data.description !== undefined) {
    department.description = data.description;
  }

  if (data.departmentHead !== undefined) {
    department.departmentHead = data.departmentHead as any;
  }

  await department.save();

  return mapToResponse(department);
};

/**
 * Soft Delete
 */
export const deactivateDepartment = async (id: string): Promise<void> => {

  const department = await Department.findById(id);

  if (!department) {
    throw ApiError.notFound("Department not found");
  }

  department.isActive = false;
  await department.save();
};

/**
 * Mapper Function
 */
const mapToResponse = (department: any): DepartmentResponseDto => ({
  id: department._id.toString(),
  name: department.name,
  description: department.description,
  departmentHead: department.departmentHead?._id?.toString(),
  isActive: department.isActive,
  createdAt: department.createdAt,
  updatedAt: department.updatedAt,
});