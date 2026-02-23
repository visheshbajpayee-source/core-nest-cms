import { Request, Response } from "express";
import { createEmployeeSchema } from "./employee.validation";
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "./employee.service";
import { Employee } from "./employee.model";

export async function createEmployeeController(req: Request, res: Response) {
    try {
        const body = createEmployeeSchema.parse(req.body);
        const data = await createEmployee(body);
        res.status(201).json({ message: "Employee created successfully", data });
    } catch (error) {
        console.log("Error creating employee:", error);
        res.status(500).json({ message: "Error creating employee", error });
    }
}

export async function getEmployeesController(req: Request, res: Response, next: any) {
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
        res.status(200).json({ data: items });
    } catch (error) {
        next(error);
    }
}

export async function getEmployeeController(req: Request, res: Response, next: any) {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        // Employee can only view their own profile
        if (user?.role === "employee" && user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const emp = await getEmployeeById(id);
        if (!emp) return res.status(404).json({ message: "Employee not found" });
        // Manager should only view employees in their department
        if (user?.role === "manager") {
            // compare department ids as strings
            const employeeDoc = (await Employee.findById(id)) as any;
            if (!employeeDoc) return res.status(404).json({ message: "Employee not found" });
            if (employeeDoc.department.toString() !== user.department.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        res.status(200).json({ data: emp });
    } catch (error) {
        next(error);
    }
}

export async function updateEmployeeController(req: Request, res: Response, next: any) {
    try {
        const user = (req as any).user;
        const { id } = req.params;
        const payload = req.body;

        // Employee can only edit own limited fields
        if (user?.role === "employee") {
            if (user.id !== id) return res.status(403).json({ message: "Access denied" });
            // allow only phoneNumber and profilePicture
            const allowed: any = {};
            if (payload.phoneNumber) allowed.phoneNumber = payload.phoneNumber;
            if (payload.profilePicture) allowed.profilePicture = payload.profilePicture;
            const updated = await updateEmployee(id, allowed);
            if (!updated) return res.status(404).json({ message: "Employee not found" });
            return res.status(200).json({ data: updated });
        }

        // Only admin can perform general updates
        if (user?.role !== "admin") return res.status(403).json({ message: "Access denied" });

        const updated = await updateEmployee(id, payload);
        if (!updated) return res.status(404).json({ message: "Employee not found" });
        res.status(200).json({ data: updated });
    } catch (error) {
        next(error);
    }
}

export async function deleteEmployeeController(req: Request, res: Response, next: any) {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        if (user?.role !== "admin") return res.status(403).json({ message: "Access denied" });

        const deleted = await deleteEmployee(id);
        if (!deleted) return res.status(404).json({ message: "Employee not found" });
        res.status(200).json({ message: "Employee deleted" });
    } catch (error) {
        next(error);
    }
}