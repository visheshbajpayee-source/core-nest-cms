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
import { Types } from "mongoose";

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

// Controller notes:
// - `createEmployeeController` validates input and creates an employee record.
// - `getEmployeesController` enforces role-based visibility:
//    * Admin: full view with optional filters
//    * Manager: limited to their own department (enforced via `req.user.role === 'manager'`)
//    * Employee: not supported here (use getEmployeeController for self)
// - `getEmployeeController` allows employees to view only their own profile and managers to view
//   employees within their department.
// - `updateEmployeeController` restricts updates: employees can only change limited fields on their own
//   profile; admins can perform full updates.
// - `deleteEmployeeController` is admin-only.

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

        // Manager can only view employee-role users from their own department
        if (user?.role === "manager") {
            const managerDoc = await Employee.findById(user.id).select("department");
            if (!managerDoc) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
            filters.department = managerDoc.department;
            filters.role = "employee";
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

        // Manager can view self profile; otherwise only employee-role users in manager's department
        if (user?.role === "manager") {
            const managerDoc = await Employee.findById(user.id).select("_id employeeId department");
            if (!managerDoc) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);

            const isSelf = id === managerDoc._id.toString() || id === managerDoc.employeeId;
            if (isSelf) {
                return ApiResponse.sendSuccess(res, 200, "Employee fetched", emp);
            }

            const targetQuery = Types.ObjectId.isValid(id)
                ? { $or: [{ _id: id }, { employeeId: id }] }
                : { employeeId: id };
            const employeeDoc = await Employee.findOne(targetQuery).select("department role");
            if (!employeeDoc) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
            if (
                employeeDoc.role !== "employee" ||
                employeeDoc.department.toString() !== managerDoc.department.toString()
            ) {
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

        // Employee and manager can only edit own limited fields
        if (user?.role === "employee" || user?.role === "manager") {
            const actor = await Employee.findById(user.id).select("_id employeeId");
            if (!actor) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
            const isSelf = id === actor._id.toString() || id === actor.employeeId;
            if (!isSelf) throw ApiError.forbidden(ErrorMessages.ACCESS_DENIED);

            const allowedSelfFields = ["phoneNumber", "profilePicture"];
            const payloadKeys = Object.keys(payload || {});
            const restrictedFields = payloadKeys.filter((key) => !allowedSelfFields.includes(key));

            const allowed: any = {};
            if (payload.phoneNumber !== undefined) allowed.phoneNumber = payload.phoneNumber;
            if (payload.profilePicture !== undefined) allowed.profilePicture = payload.profilePicture;
            if (Object.keys(allowed).length === 0) {
                throw ApiError.badRequest("No editable fields provided. Allowed fields: phoneNumber, profilePicture");
            }
            const updated = await updateEmployee(id, allowed);
            if (!updated) throw ApiError.notFound(ErrorMessages.EMPLOYEE_NOT_FOUND);
            if (restrictedFields.length > 0) {
                return ApiResponse.sendSuccess(
                    res,
                    200,
                    `Profile updated. Ignored restricted fields: ${restrictedFields.join(", ")}`,
                    updated
                );
            }
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
