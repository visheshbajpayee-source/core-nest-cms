
export interface CreateDepartmentDto {
  name: string;
  description?: string;
  head?: string; // ObjectId as string
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  head?: string;
}

export interface DepartmentResponseDto {
  id: string;
  name: string;
  description?: string;
  head?: string;
  createdAt: Date;
  updatedAt: Date;
}
