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
  teamMembers: project.teamMembers.map((member: any) => ({
    id: member._id.toString(),
    fullName: member.fullName,
    employeeId: member.employeeId,
    email: member.email,
    designation: member.designation,
  })),
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

/* ---------------- TEAM MEMBER VALIDATION ---------------- */

const validateTeamMembers = async (
  teamMembers: string[] | undefined,
  department: string
): Promise<Types.ObjectId[]> => {
  if (!teamMembers || teamMembers.length === 0) return [];

  const uniqueIds = [...new Set(teamMembers)];

  const employees = await Employee.find({
    _id: { $in: uniqueIds },
    department: new Types.ObjectId(department), // ✅ FIX
  }).select("_id");

  if (employees.length !== uniqueIds.length) {
    throw ApiError.badRequest(
      "Some team members do not exist or do not belong to the specified department"
    );
  }

  return employees.map((emp) => emp._id);
};

/* ---------------- CREATE ---------------- */

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
      department: new Types.ObjectId(payload.department), // ✅ FIX
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

/* ---------------- GET ALL (ADMIN / MANAGER) ---------------- */

export const getProjects = async (
  filters: Record<string, string | undefined> = {}
): Promise<ProjectResponseDto[]> => {
  try {
    const query: any = {};

    if (filters.department) {
      query.department = new Types.ObjectId(filters.department); // ✅ FIX
    }

    if (filters.status) {
      query.status = filters.status;
    }
    console.log("Filters:", filters);
console.log("Query:", query);

    const projects = await Project.find();
   console.log("Projects found:", projects);
    return projects.map(toResponse);
  } catch {
    throw ApiError.internalServer("Failed to fetch projects");
  }
};

/* ---------------- GET BY ID ---------------- */

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

/* ---------------- GET EMPLOYEE PROJECTS ---------------- */

export const getProjectsForEmployee = async (
  employeeId: string
): Promise<ProjectResponseDto[]> => {
  try {
    console.log("Employee ID:", employeeId);

    const projects = await Project.find({
      teamMembers: { $in: [new Types.ObjectId(employeeId)] },
    })
      .populate("teamMembers", "fullName employeeId email designation")
      .sort({ createdAt: -1 });

    console.log("Employee projects:", projects);

    return projects.map(toResponse);
  } catch {
    throw ApiError.internalServer("Failed to fetch employee projects");
  }
};

/* ---------------- UPDATE ---------------- */

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

    if (payload.startDate) {
      updates.startDate = new Date(payload.startDate);
    }

    if (payload.expectedEndDate) {
      updates.expectedEndDate = new Date(payload.expectedEndDate);
    }

    if (payload.teamMembers) {
      updates.teamMembers = await validateTeamMembers(
        payload.teamMembers,
        existing.department.toString()
      );
    }

    if (payload.status) {
      const allowedTransitions =
        statusTransitions[existing.status] || [];

      if (!allowedTransitions.includes(payload.status)) {
        throw ApiError.badRequest(
          `Invalid status transition from '${existing.status}' to '${payload.status}'`
        );
      }

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

/* ---------------- DELETE ---------------- */

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