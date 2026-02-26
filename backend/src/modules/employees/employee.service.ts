import { Employee } from "./employee.model";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from "../../dto/user.dto";
import { ApiError } from "../../common/utils/ApiError";
import { Types } from "mongoose";

const normalizeEmployeeLookupId = (id: string) => {
  const raw = (id || "").trim();
  if (/^emp\d+$/i.test(raw)) return raw.toUpperCase();
  return raw;
};

/*
 Service notes:
 - Wraps Mongoose `Employee` operations and returns DTO-shaped results.
 - Uses `employeeId` (business id) for lookups in get/update/delete where appropriate.
 - `getAllEmployees` supports filtering at the controller layer; this service currently
   returns all employee documents and the controller applies filters for managers.
 - Errors are normalized into `ApiError` instances so controllers and middleware
   can handle them consistently.
*/

/**
 * CREATE
 */
export const createEmployee = async (
  data: CreateEmployeeDto
): Promise<EmployeeResponseDto> => {
  try {
    const employee = await Employee.create(data);

    return {
      id: employee._id.toString(),
      fullName: employee.fullName,
      email: employee.email,
      role: employee.role,
      department: employee.department.toString(),
      designation: employee.designation.toString(),
      dateOfJoining: employee.dateOfJoining,
      employeeId: employee.employeeId,
      status: employee.status,
      profilePicture: employee.profilePicture,
    };
  } catch (error: any) {
    throw ApiError.internalServer(error.message || "Failed to create employee");
  }
};

/**
 * GET ALL (with filters + search)
 */
export const getAllEmployees = async (filters: any): Promise<EmployeeResponseDto[]> => {
  try {
    const employees = await Employee.find()
      .populate("department", "name")
      .populate("designation", "title");

    return employees.map((employee) => ({
      id: employee._id.toString(),
      fullName: employee.fullName,
      email: employee.email,
      role: employee.role,
      department: (employee.department as any)?.name ?? (employee.department as any)?.toString() ?? "",
      departmentId: (employee.department as any)?._id?.toString() ?? "",
      designation: (employee.designation as any)?.title ?? (employee.designation as any)?.toString() ?? "",
      designationId: (employee.designation as any)?._id?.toString() ?? "",
      dateOfJoining: employee.dateOfJoining,
      employeeId: employee.employeeId,
      status: employee.status,
    }));
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw ApiError.internalServer("Failed to fetch employees");
  }
};

export const getEmployeeById = async (id: string): Promise<EmployeeResponseDto | null> => {
  try {
    const normalizedId = normalizeEmployeeLookupId(id);
    const query = Types.ObjectId.isValid(normalizedId)
      ? { $or: [{ _id: normalizedId }, { employeeId: normalizedId }] }
      : { employeeId: normalizedId };

    const employee = await Employee.findOne(query)
      .populate("department", "name")
      .populate("designation", "title");
    if (!employee) throw ApiError.notFound("Employee not found");

    return {
      id: employee._id.toString(),
      fullName: employee.fullName,
      email: employee.email,
      role: employee.role,
      department: (employee.department as any)?.name ?? (employee.department as any)?.toString() ?? "",
      departmentId: (employee.department as any)?._id?.toString() ?? "",
      designation: (employee.designation as any)?.title ?? (employee.designation as any)?.toString() ?? "",
      designationId: (employee.designation as any)?._id?.toString() ?? "",
      dateOfJoining: employee.dateOfJoining,
      employeeId: employee.employeeId,
      status: employee.status,
    };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw ApiError.internalServer("Failed to fetch employee");
  }
};

/**
 * UPDATE by employeeId
 */
export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDto
): Promise<EmployeeResponseDto | null> => {
  try {
    const normalizedId = normalizeEmployeeLookupId(id);
    const query = Types.ObjectId.isValid(normalizedId)
      ? { $or: [{ _id: normalizedId }, { employeeId: normalizedId }] }
      : { employeeId: normalizedId };

    const employee = await Employee.findOneAndUpdate(
      query,
      data,
      { new: true }
    ).populate("department", "name").populate("designation", "title");

    if (!employee) {
      throw ApiError.notFound("Employee not found");
    }

    return {
      id: employee._id.toString(),
      fullName: employee.fullName,
      email: employee.email,
      role: employee.role,
      department: (employee.department as any)?.name ?? (employee.department as any)?.toString() ?? "",
      departmentId: (employee.department as any)?._id?.toString() ?? "",
      designation: (employee.designation as any)?.title ?? (employee.designation as any)?.toString() ?? "",
      designationId: (employee.designation as any)?._id?.toString() ?? "",
      dateOfJoining: employee.dateOfJoining,
      employeeId: employee.employeeId,
      status: employee.status,
    };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw ApiError.internalServer("Failed to update employee");
  }
};

/**
 * DELETE by employeeId
 */
export const deleteEmployee = async (
  id: string
): Promise<boolean> => {
  try {
    const normalizedId = normalizeEmployeeLookupId(id);
    const query = Types.ObjectId.isValid(normalizedId)
      ? { $or: [{ _id: normalizedId }, { employeeId: normalizedId }] }
      : { employeeId: normalizedId };
    const result = await Employee.findOneAndDelete(query);

    if (!result) {
      throw ApiError.notFound("Employee not found");
    }

    return true;
  } catch (error: any) {
    throw ApiError.internalServer("Failed to delete employee");
  }
};
