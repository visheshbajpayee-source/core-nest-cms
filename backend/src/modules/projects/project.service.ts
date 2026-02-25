import { Types } from "mongoose";
import { Project } from "./project.model";
import { Employee } from "../employees/employee.model";
import { Task } from "../tasks/task.model";
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
} from "../../dto/project.dto";
import { ApiError } from "../../common/utils/ApiError";

const statusTransitions: Record<string, string[]> = {
  not_started: ["in_progress"],
  in_progress: ["completed", "on_hold"],
  on_hold: ["in_progress"],
  completed: [],
};

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

/**
 * Validate team members:
 * - Remove duplicates
 * - Ensure they exist
 * - Ensure they belong to same department
 */
const validateTeamMembers = async (
  teamMembers: string[] | undefined,
  department: string
): Promise<Types.ObjectId[]> => {
  if (!teamMembers || teamMembers.length === 0) return [];

  const uniqueIds = [...new Set(teamMembers)];

  const employees = await Employee.find({
    _id: { $in: uniqueIds },
    department,
  }).select("_id");

  if (employees.length !== uniqueIds.length) {
    throw ApiError.badRequest(
      "Some team members do not exist or do not belong to the specified department"
    );
  }

  return employees.map((emp) => emp._id);
};

export const createProject = async (
  payload: CreateProjectDto
): Promise<ProjectResponseDto> => {
  try {
    const validatedTeamMembers = await validateTeamMembers(
      payload.teamMembers,
      payload.department
    );

    const project = await Project.create({
      ...payload,
      startDate: new Date(payload.startDate),
      expectedEndDate: new Date(payload.expectedEndDate),
      teamMembers: validatedTeamMembers,
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
  } catch {
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
    const existing = await Project.findById(id);
    if (!existing) {
      throw ApiError.notFound("Project not found");
    }

    const updates: any = {};

    // Date updates
    if (payload.startDate) {
      updates.startDate = new Date(payload.startDate);
    }

    if (payload.expectedEndDate) {
      updates.expectedEndDate = new Date(payload.expectedEndDate);
    }

    // Team member validation
    if (payload.teamMembers) {
      updates.teamMembers = await validateTeamMembers(
        payload.teamMembers,
        existing.department.toString()
      );
    }

    // Status transition enforcement
    if (payload.status) {
      const allowedTransitions =
        statusTransitions[existing.status] || [];

      if (!allowedTransitions.includes(payload.status)) {
        throw ApiError.badRequest(
          `Invalid status transition from '${existing.status}' to '${payload.status}'`
        );
      }

      // Prevent completion if tasks incomplete
      if (payload.status === "completed") {
        const incompleteTasks = await Task.countDocuments({
          project: existing._id,
          status: { $ne: "done" },
        });

        if (incompleteTasks > 0) {
          throw ApiError.badRequest(
            "Cannot complete project while tasks are pending"
          );
        }
      }

      updates.status = payload.status;
    }

    if (payload.name) updates.name = payload.name;
    if (payload.description !== undefined)
      updates.description = payload.description;

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

    throw ApiError.internalServer(
      error.message || "Failed to update project"
    );
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const taskCount = await Task.countDocuments({ project: id });

    if (taskCount > 0) {
      throw ApiError.badRequest(
        "Cannot delete project while tasks exist"
      );
    }

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