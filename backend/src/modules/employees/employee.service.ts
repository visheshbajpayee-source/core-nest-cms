import { Employee } from "./employee.model";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from "../../dto/user.dto";

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
    throw new Error(error.message || "Failed to create employee");
  }
};

/**
 * GET ALL
 */
export const getAllEmployees = async (): Promise<EmployeeResponseDto[]> => {
  try {
    const employees = await Employee.find();

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
    throw new Error("Failed to fetch employees");
  }
};

/**
 * GET BY ID
 */
export const getEmployeeById = async (
  id: string
): Promise<EmployeeResponseDto | null> => {
  try {
    const employee = await Employee.findById(id);

    if (!employee) return null;

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
    throw new Error("Failed to fetch employee");
  }
};

/**
 * UPDATE
 */
export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDto
): Promise<EmployeeResponseDto | null> => {
  try {
    const employee = await Employee.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!employee) return null;

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
    throw new Error("Failed to update employee");
  }
};

/**
 * DELETE
 */
export const deleteEmployee = async (
  id: string
): Promise<boolean> => {
  try {
    const result = await Employee.findByIdAndDelete(id);
    return !!result;
  } catch (error: any) {
    throw new Error("Failed to delete employee");
  }
};