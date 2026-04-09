export type Role = "admin" | "manager" | "employee";
export type Status = "active" | "inactive";

export interface Employee {
	id: string;
	employeeId: string;
	fullName: string;
	email: string;
	role: Role;
	department: string;
	departmentId?: string;
	designation: string;
	designationId?: string;
	dateOfJoining: string;
	status: Status;
	phoneNumber?: string;
	profilePicture?: string;
}

export interface EmployeeFormState {
	fullName: string;
	email: string;
	password: string;
	phoneNumber: string;
	department: string;
	designation: string;
	dateOfJoining: string;
	role: Role;
	status: Status;
}
