import { Employee } from "./employee.model";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from "../../dto/user.dto";
import { ApiError } from "../../common/utils/ApiError";
import { Types } from "mongoose";

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
    const query = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { employeeId: id }] }
      : { employeeId: id };

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
    const query = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { employeeId: id }] }
      : { employeeId: id };

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
  employeeId: string
): Promise<boolean> => {
  try {
    const result = await Employee.findOneAndDelete({ employeeId });

    if (!result) {
      throw ApiError.notFound("Employee not found");
    }

    return true;
  } catch (error: any) {
    throw ApiError.internalServer("Failed to delete employee");
  }
};
