import { Request, Response, NextFunction } from "express";
import { createEmployeeSchema } from "./employee.validation";
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "./employee.service";
import { Employee } from "./employee.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError, ErrorMessages } from "../../common/utils/ApiError";

export async function createEmployeeController(req: Request, res: Response, next: NextFunction) {
    try {
        const body = createEmployeeSchema.parse(req.body);
        // createEmployee expects `dateOfJoining` as a Date
        const payload: any = { ...body };
        if (typeof payload.dateOfJoining === "string") {
            payload.dateOfJoining = new Date(payload.dateOfJoining);
        }
        const data = await createEmployee(payload as any);
        return ApiResponse.created("Employee created successfully", data).send(res);
    } catch (error) {
        next(error);
    }
}

export async function getEmployeesController(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        const { department, designation, status, role, search } = req.query;

        const filters: any = {};
        if (department) filters.department = department;
        if (designation) filters.designation = designation;
        if (status) filters.status = status;
        if (role) filters.role = role;
        if (search) filters.search = search;

        // Manager can only view within their department
        if (user?.role === "manager") {
            filters.department = user.department;
        }

        const items = await getAllEmployees(filters);
        return ApiResponse.sendSuccess(res, 200, "Employees fetched", items);
    } catch (error) {
        next(error);
    }
}

export async function getEmployeeController(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        // Employee can only view their own profile
        if (user?.role === "employee" && user.id !== id) {
            throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
        }

        const emp = await getEmployeeById(id);
        if (!emp) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);

        // Manager should only view employees in their department
        if (user?.role === "manager") {
            const employeeDoc = (await Employee.findById(id)) as any;
            if (!employeeDoc) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
            if (employeeDoc.department.toString() !== user.department.toString()) {
                throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
            }
        }

        return ApiResponse.sendSuccess(res, 200, "Employee fetched", emp);
    } catch (error) {
        next(error);
    }
}

export async function updateEmployeeController(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        const { id } = req.params;
        const payload = req.body;

        // Employee can only edit own limited fields
        if (user?.role === "employee") {
            if (user.id !== id) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);
            // allow only phoneNumber and profilePicture
            const allowed: any = {};
            if (payload.phoneNumber) allowed.phoneNumber = payload.phoneNumber;
            if (payload.profilePicture) allowed.profilePicture = payload.profilePicture;
            const updated = await updateEmployee(id, allowed);
            if (!updated) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
            return ApiResponse.sendSuccess(res, 200, "Profile updated", updated);
        }

        // Only admin can perform general updates
        if (user?.role !== "admin") throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);

        const updated = await updateEmployee(id, payload);
        if (!updated) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
        return ApiResponse.sendSuccess(res, 200, "Employee updated", updated);
    } catch (error) {
        next(error);
    }
}

export async function deleteEmployeeController(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        if (user?.role !== "admin") throw ApiError.forbidden(ErrorMessages.ADMIN_ONLY);

        const deleted = await deleteEmployee(id);
        if (!deleted) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
        return ApiResponse.sendSuccess(res, 200, "Employee deleted", null);
    } catch (error) {
        next(error);
    }
}