

export interface CreateEmployeeDto {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: "admin" | "manager" | "employee";
  department: string;
  designation: string;
  dateOfJoining: Date;
}

export interface UpdateEmployeeDto {
  fullName?: string;
  phoneNumber?: string;
  designation?: string;
  status?: "active" | "inactive";
}


export interface EmployeeResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  designation: string;
  dateOfJoining: Date;
  employeeId: string;
  status: string;
  profilePicture?: string;
}
