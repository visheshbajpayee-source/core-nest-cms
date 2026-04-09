
export interface CreateWorkLogDto {
  date: string;
  taskTitle: string;
  taskDescription: string;
  project?: string;
  hoursSpent: number;
  status?: "in_progress" | "completed" | "blocked";
}

export interface UpdateWorkLogDto {
  taskTitle?: string;
  taskDescription?: string;
  project?: string;
  hoursSpent?: number;
  status?: "in_progress" | "completed" | "blocked";
}

export interface WorkLogResponseDto {
  id: string;
  employee: string;
  date: Date;
  taskTitle: string;
  taskDescription: string;
  project?: string;
  hoursSpent: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
