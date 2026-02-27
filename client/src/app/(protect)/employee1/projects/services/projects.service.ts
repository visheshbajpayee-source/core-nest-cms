import api from "@/app/lib/api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  expectedEndDate: string;
  status: "not_started" | "in_progress" | "completed" | "on_hold";
  department: string;
  teamMembers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  startDate: Date;
  expectedEndDate: Date;
  department: string;
  teamMembers?: string[];
}

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Project[] }>(
      "/api/v1/projects"
    );
    return response.data.data || [];
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to fetch projects" };
  }
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await api.get<{ success: boolean; data: Project }>(
      `/api/v1/projects/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to fetch project" };
  }
};

export const updateProjectStatus = async (
  id: string,
  status: string
): Promise<Project> => {
  try {
    const response = await api.put<{ success: boolean; data: Project }>(
      `/api/v1/projects/${id}`,
      { status }
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Failed to update project" };
  }
};
