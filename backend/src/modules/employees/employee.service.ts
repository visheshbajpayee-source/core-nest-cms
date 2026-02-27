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
    let employee: InstanceType<typeof Employee> | null = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        employee = await new Employee(data).save();
        break;
      } catch (error: any) {
        const isDuplicateEmployeeId =
          error?.code === 11000 &&
          (error?.keyPattern?.employeeId || error?.keyValue?.employeeId);

        if (isDuplicateEmployeeId && attempt < 3) {
          continue;
        }

        throw error;
      }
    }

    if (!employee) {
      throw ApiError.internalServer("Failed to create employee");
    }

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
    const queryObj: any = {};

    if (filters?.department) queryObj.department = filters.department;
    if (filters?.designation) queryObj.designation = filters.designation;
    if (filters?.status) queryObj.status = filters.status;
    if (filters?.role) queryObj.role = filters.role;

    if (filters?.search) {
      const re = new RegExp(filters.search, "i");
      queryObj.$or = [{ fullName: re }, { email: re }, { employeeId: re }];
    }

    const employees = await Employee.find(queryObj);

    return employees.map((employee) => ({
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
    }));
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw ApiError.internalServer("Failed to fetch employees");
  }
};

/**
 * GET BY EMPLOYEE ID (NOT Mongo _id)
 */
// export const getEmployeeById = async (
//   employeeId: string
// ): Promise<EmployeeResponseDto | null> => {
//   try {
//     const employee = await Employee.findOne({ employeeId });

//     if (!employee) {
//       throw ApiError.notFound("Employee not found");
//     }

//     return {
//       id: employee._id.toString(),
//       fullName: employee.fullName,
//       email: employee.email,
//       role: employee.role,
//       department: employee.department.toString(),
//       designation: employee.designation.toString(),
//       dateOfJoining: employee.dateOfJoining,
//       employeeId: employee.employeeId,
//       status: employee.status,
//     };
//   } catch (error: any) {
//     throw ApiError.internalServer("Failed to fetch employee");
//   }
// };
// employee.service.ts



export const getEmployeeById = async (id: string): Promise<EmployeeResponseDto | null> => {
  try {
    const normalizedId = normalizeEmployeeLookupId(id);
    const query = Types.ObjectId.isValid(normalizedId)
      ? { $or: [{ _id: normalizedId }, { employeeId: normalizedId }] }
      : { employeeId: normalizedId };

    const employee = await Employee.findOne(query);
    if (!employee) throw ApiError.notFound("Employee not found");

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
      phoneNumber: employee.phoneNumber,
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
    );

    if (!employee) {
      throw ApiError.notFound("Employee not found");
    }

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
      phoneNumber: employee.phoneNumber,
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