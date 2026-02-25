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
  departmentId?: string;
  designation: string;
  designationId?: string;
  dateOfJoining: Date;
  employeeId: string;
  status: string;
  phoneNumber?: string;
  profilePicture?: string;
}

// Login DTO
export interface LoginUserDto {
  email: string;
  password: string;
}

// Login DTO
export interface LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}