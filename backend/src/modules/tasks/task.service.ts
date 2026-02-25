import { Types } from "mongoose";
import { Task } from "./task.model";
import { Project } from "../projects/project.model";
import { Employee } from "../employees/employee.model";
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
} from "../../dto/task.dto";
import { ApiError } from "../../common/utils/ApiError";

interface AuthUser {
  id: string;
  role: string;
}

const toResponse = (task: any): TaskResponseDto => ({
  id: task._id.toString(),
  title: task.title,
  description: task.description,
  project: task.project.toString(),
  assignedTo: task.assignedTo.map((user: Types.ObjectId) => user.toString()),
  priority: task.priority,
  status: task.status,
  dueDate: task.dueDate,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const validateProjectAccess = async (
  projectId: string,
  user: AuthUser
): Promise<any> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  if (user.role === "manager") {
    const manager = await Employee.findById(user.id);
    if (!manager) {
      throw ApiError.forbidden("Manager not found");
    }
    if (project.department.toString() !== manager.department.toString()) {
      throw ApiError.forbidden(
        "Managers can only create tasks for projects in their department"
      );
    }
  }

  return project;
};

const validateAssignedUsers = async (
  assignedTo: string[] | undefined,
  projectDepartment: string
): Promise<Types.ObjectId[]> => {
  if (!assignedTo || assignedTo.length === 0) return [];

  const uniqueIds = [...new Set(assignedTo)];
  const employees = await Employee.find({
    _id: { $in: uniqueIds },
    department: projectDepartment,
    status: "active",
  }).select("_id");

  if (employees.length !== uniqueIds.length) {
    throw ApiError.badRequest(
      "Some assigned users do not exist or are not in the project department"
    );
  }

  return employees.map((emp) => emp._id);
};

export const createTask = async (
  payload: CreateTaskDto,
  user: AuthUser
): Promise<TaskResponseDto> => {
  try {
    if (user.role === "employee") {
      throw ApiError.forbidden("Employees cannot create tasks");
    }

    const project = await validateProjectAccess(payload.project, user);

    const validatedAssignees = await validateAssignedUsers(
      payload.assignedTo,
      project.department.toString()
    );

    const task = await Task.create({
      ...payload,
      dueDate: new Date(payload.dueDate),
      assignedTo: validatedAssignees,
    });

    return toResponse(task);
  } catch (error: any) {
    throw ApiError.internalServer(error.message || "Failed to create task");
  }
};

export const getTasks = async (
  user: AuthUser,
  filters: Record<string, string | undefined> = {}
): Promise<TaskResponseDto[]> => {
  try {
    let query: any = {};

    if (user.role === "admin") {
      // Admin can see all tasks and apply filters
      if (filters.project) query.project = filters.project;
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
    } else if (user.role === "manager") {
      // Manager can see tasks from their department's projects
      const manager = await Employee.findById(user.id);
      if (!manager) {
        throw ApiError.forbidden("Manager not found");
      }

      const departmentProjects = await Project.find({
        department: manager.department,
      }).select("_id");

      query.project = {
        $in: departmentProjects.map((project) => project._id),
      };

      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
    } else if (user.role === "employee") {
      // Employee can only see tasks assigned to them
      query.assignedTo = user.id;
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
    }

    const tasks = await Task.find(query)
      .populate("project", "name department")
      .sort({ createdAt: -1 });

    return tasks.map(toResponse);
  } catch (error: any) {
    throw ApiError.internalServer("Failed to fetch tasks");
  }
};

export const getTaskById = async (id: string): Promise<TaskResponseDto> => {
  try {
    const task = await Task.findById(id).populate("project", "name department");
    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    return toResponse(task);
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      throw ApiError.notFound("Task not found");
    }
    throw ApiError.internalServer("Failed to fetch task");
  }
};

export const updateTask = async (
  id: string,
  payload: UpdateTaskDto,
  user: AuthUser
): Promise<TaskResponseDto> => {
  try {
    const existingTask = await Task.findById(id).populate("project");
    if (!existingTask) {
      throw ApiError.notFound("Task not found");
    }

    // Check permissions based on role
    if (user.role === "employee") {
      // Employees can only update status of tasks assigned to them
      const isAssigned = existingTask.assignedTo.some(
        (assignee: any) => assignee.toString() === user.id
      );
      if (!isAssigned) {
        throw ApiError.forbidden("You can only update tasks assigned to you");
      }
      // Employees can only update status
      if (Object.keys(payload).some((key) => key !== "status")) {
        throw ApiError.forbidden("Employees can only update task status");
      }
    } else if (user.role === "manager") {
      // Validate manager can access this project
      await validateProjectAccess(
        (existingTask.project as any)._id.toString(),
        user
      );
    }

    const updates: any = { ...payload };
    if (payload.dueDate) updates.dueDate = new Date(payload.dueDate);

    if (payload.assignedTo && user.role !== "employee") {
      const project = existingTask.project as any;
      updates.assignedTo = await validateAssignedUsers(
        payload.assignedTo,
        project.department.toString()
      );
    }

    const updated = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw ApiError.notFound("Task not found");
    }

    return toResponse(updated);
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      throw ApiError.notFound("Task not found");
    }
    throw ApiError.internalServer(error.message || "Failed to update task");
  }
};

export const deleteTask = async (id: string, user: AuthUser): Promise<boolean> => {
  try {
    if (user.role === "employee") {
      throw ApiError.forbidden("Employees cannot delete tasks");
    }

    const task = await Task.findById(id).populate("project");
    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    if (user.role === "manager") {
      // Validate manager can access this project
      await validateProjectAccess((task.project as any)._id.toString(), user);
    }

    await Task.findByIdAndDelete(id);
    return true;
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      throw ApiError.notFound("Task not found");
    }
    throw ApiError.internalServer("Failed to delete task");
  }
};