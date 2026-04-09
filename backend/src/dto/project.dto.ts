export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate: string;
  expectedEndDate: string;
  status?: "not_started" | "in_progress" | "completed" | "on_hold";
  department: string;
  teamMembers?: string[];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: string;
  expectedEndDate?: string;
  status?: "not_started" | "in_progress" | "completed" | "on_hold";
  teamMembers?: string[];
}

export interface ProjectResponseDto {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  expectedEndDate: Date;
  status: string;
  department: string;
  teamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
}
