import { Request, Response } from "express";
import { createEmployeeSchema } from "./employee.validation";
import { createEmployeeService } from "./employee.service";

export async function createEmployee(req: Request, res: Response) {
    try {
        const body = createEmployeeSchema.parse(req.body);
        const data = await createEmployeeService(body);
        res.status(201).json({ message: "Employee created successfully", data });
    } catch (error) {
        console.log("Error creating employee:", error);
    }
}
