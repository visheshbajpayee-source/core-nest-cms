
import { CreateEmployeeDto } from "../../dto/user.dto";
import { Employee } from "./employee.model";
import { IcreateEmployeeDto } from "./employee.validation";


export async function createEmployeeService(data: IcreateEmployeeDto) {
    try {
        //destruue data and create new employee 
        // find user by email if exist throw error else create new employee
        // password should be hashed before saving to database
        // 
        const employee = new Employee({
            ...data,
            // password: hashedPss, // TODO: hash password before saving
        });
        employee.save();
        return employee;
    } catch (error) {
        console.error("Error creating employee:", error);   
    }
}