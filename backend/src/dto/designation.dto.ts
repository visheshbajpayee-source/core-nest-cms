export interface CreateDesignationDto {
  title: string;
  description?: string;
}

export interface UpdateDesignationDto {
  title?: string;
  description?: string;
}

export interface DesignationResponseDto {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
