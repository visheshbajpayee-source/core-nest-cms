export interface CreateDesignationDto {
  title: string;
  description?: string;
}

export interface UpdateDesignationDto {
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface DesignationResponseDto {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}