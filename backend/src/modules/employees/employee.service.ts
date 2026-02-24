import { Employee } from "./employee.model";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from "../../dto/user.dto";
import { ApiError } from "../../common/utils/ApiError";

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
export const getAllEmployees = async (
  filters: Record<string, any> = {}
): Promise<EmployeeResponseDto[]> => {
  try {
    const queryObj: any = {};

    if (filters.department) queryObj.department = filters.department;
    if (filters.designation) queryObj.designation = filters.designation;
    if (filters.status) queryObj.status = filters.status;
    if (filters.role) queryObj.role = filters.role;

    if (filters.search) {
      const re = new RegExp(filters.search, "i");
      queryObj.$or = [
        { fullName: re },
        { email: re },
        { employeeId: re },
      ];
    }

    const employees = await Employee.find(queryObj)
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
      phoneNumber: employee.phoneNumber,
    }));
  } catch (error: any) {
    throw ApiError.internalServer("Failed to fetch employees");
  }
};

/**
 * GET BY EMPLOYEE ID (NOT Mongo _id)
 */
export const getEmployeeById = async (
  employeeId: string
): Promise<EmployeeResponseDto | null> => {
  try {
    const employee = await Employee.findOne({ employeeId })
      .populate("department", "name")
      .populate("designation", "title");

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
      phoneNumber: employee.phoneNumber,
    };
  } catch (error: any) {
    throw ApiError.internalServer("Failed to fetch employee");
  }
};

/**
 * UPDATE by employeeId
 */
export const updateEmployee = async (
  employeeId: string,
  data: UpdateEmployeeDto
): Promise<EmployeeResponseDto | null> => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId },
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
      phoneNumber: employee.phoneNumber,
    };
  } catch (error: any) {
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