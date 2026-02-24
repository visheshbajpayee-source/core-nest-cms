export interface CreateDepartmentDto {
  name: string;
  description?: string;
  departmentHead?: string; // ObjectId as string
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  departmentHead?: string;
  isActive?: boolean;
}

export interface DepartmentResponseDto {
  id: string;
  name: string;
  description?: string;
  departmentHead?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}