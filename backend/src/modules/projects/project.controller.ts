import { Request, Response, NextFunction } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsForEmployee,
} from "./project.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { CreateProjectDto, UpdateProjectDto } from "../../dto/project.dto";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { ApiError } from "../../common/utils/ApiError";
import { Employee } from "../employees/employee.model";

const resolveManagerDepartment = async (userId?: string) => {
  if (!userId) {
    throw ApiError.forbidden("User context missing");
  }

  const manager = await Employee.findById(userId).select("department role");
  if (!manager) {
    throw ApiError.forbidden("User not found or unauthorized");
  }

  return manager.department?.toString();
};

export const createProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const payload = req.body as CreateProjectDto;

    if (user?.role === "manager") {
      const managerDept = await resolveManagerDepartment(user.id);
      if (payload.department !== managerDept) {
        throw ApiError.forbidden(
          "Managers can only create projects for their department"
        );
      }
    }

    const project = await createProject(payload);
    return ApiResponse.created("Project created", project).send(res);
  } catch (error) {
    next(error);
  }
};

export const getProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const filters = {
      department: req.query.department as string | undefined,
      status: req.query.status as string | undefined,
    };

    if (user?.role === "manager") {
      filters.department = await resolveManagerDepartment(user.id);
    }

    const projects = await getProjects(filters);
    return ApiResponse.sendSuccess(res, 200, "Projects fetched", projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const project = await getProjectById(req.params.id);
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    if (user?.role === "manager") {
      const managerDept = await resolveManagerDepartment(user.id);
      if (project.department !== managerDept) {
        throw ApiError.forbidden(
          "Managers can only access projects in their department"
        );
      }
    }

    return ApiResponse.sendSuccess(res, 200, "Project fetched", project);
  } catch (error) {
    next(error);
  }
};

export const getMyProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (!user) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const projects = await getProjectsForEmployee(user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched successfully", projects));
  } catch (error) {
    next(error);
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (user?.role === "manager") {
      const managerDept = await resolveManagerDepartment(user.id);
      const existing = await getProjectById(req.params.id);
      if (!existing) {
        throw ApiError.notFound("Project not found");
      }
      if (existing.department !== managerDept) {
        throw ApiError.forbidden(
          "Managers can only update projects in their department"
        );
      }
    }

    const payload = req.body as UpdateProjectDto;
    const project = await updateProject(req.params.id, payload);
    return ApiResponse.sendSuccess(res, 200, "Project updated", project);
  } catch (error) {
    next(error);
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;

    if (user?.role === "manager") {
      const managerDept = await resolveManagerDepartment(user.id);
      const existing = await getProjectById(req.params.id);
      if (!existing) {
        throw ApiError.notFound("Project not found");
      }
      if (existing.department !== managerDept) {
        throw ApiError.forbidden(
          "Managers can only delete projects in their department"
        );
      }
    }

    await deleteProject(req.params.id);
    return ApiResponse.sendSuccess(res, 200, "Project deleted", null);
  } catch (error) {
    next(error);
  }
};
