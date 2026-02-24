import { Types } from "mongoose";
import { Project } from "./project.model";
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
} from "../../dto/project.dto";
import { ApiError } from "../../common/utils/ApiError";

const toResponse = (project: any): ProjectResponseDto => ({
  id: project._id.toString(),
  name: project.name,
  description: project.description,
  startDate: project.startDate,
  expectedEndDate: project.expectedEndDate,
  status: project.status,
  department: project.department.toString(),
  teamMembers: project.teamMembers.map((member: Types.ObjectId) =>
    member.toString()
  ),
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export const createProject = async (
  payload: CreateProjectDto
): Promise<ProjectResponseDto> => {
  try {
    const project = await Project.create({
      ...payload,
      startDate: new Date(payload.startDate),
      expectedEndDate: new Date(payload.expectedEndDate),
    });

    return toResponse(project);
  } catch (error: any) {
    if (error.code === 11000) {
      throw ApiError.badRequest("Project name must be unique");
    }

    throw ApiError.internalServer(
      error.message || "Failed to create project"
    );
  }
};

export const getProjects = async (
  filters: Record<string, string | undefined> = {}
): Promise<ProjectResponseDto[]> => {
  try {
    const query: any = {};
    if (filters.department) query.department = filters.department;
    if (filters.status) query.status = filters.status;

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return projects.map(toResponse);
  } catch (error: any) {
    throw ApiError.internalServer("Failed to fetch projects");
  }
};

export const getProjectById = async (
  id: string
): Promise<ProjectResponseDto | null> => {
  try {
    const project = await Project.findById(id);
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    return toResponse(project);
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      throw ApiError.notFound("Project not found");
    }

    throw ApiError.internalServer("Failed to fetch project");
  }
};

export const updateProject = async (
  id: string,
  payload: UpdateProjectDto
): Promise<ProjectResponseDto> => {
  try {
    const updates: any = { ...payload };
    if (payload.startDate) updates.startDate = new Date(payload.startDate);
    if (payload.expectedEndDate)
      updates.expectedEndDate = new Date(payload.expectedEndDate);

    const updated = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw ApiError.notFound("Project not found");
    }

    return toResponse(updated);
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      throw ApiError.notFound("Project not found");
    }

    if (error.code === 11000) {
      throw ApiError.badRequest("Project name must be unique");
    }

    throw ApiError.internalServer(error.message || "Failed to update project");
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      throw ApiError.notFound("Project not found");
    }

    return true;
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      throw ApiError.notFound("Project not found");
    }

    throw ApiError.internalServer("Failed to delete project");
  }
};
