import { Request, Response, NextFunction } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.service";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { CreateTaskDto, UpdateTaskDto } from "../../dto/task.dto";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { ApiError } from "../../common/utils/ApiError";

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    if (!user) {
      throw ApiError.unauthorized("User context missing");
    }

    const payload = req.body as CreateTaskDto;
    const task = await createTask(payload, user);
    return ApiResponse.created("Task created", task).send(res);
  } catch (error) {
    next(error);
  }
};

export const getTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    if (!user) {
      throw ApiError.unauthorized("User context missing");
    }

    const filters = {
      project: req.query.project as string | undefined,
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
    };

    const tasks = await getTasks(user, filters);
    return ApiResponse.sendSuccess(res, 200, "Tasks fetched", tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await getTaskById(req.params.id);
    return ApiResponse.sendSuccess(res, 200, "Task fetched", task);
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    if (!user) {
      throw ApiError.unauthorized("User context missing");
    }

    const payload = req.body as UpdateTaskDto;
    const task = await updateTask(req.params.id, payload, user);
    return ApiResponse.sendSuccess(res, 200, "Task updated", task);
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    if (!user) {
      throw ApiError.unauthorized("User context missing");
    }

    await deleteTask(req.params.id, user);
    return ApiResponse.sendSuccess(res, 200, "Task deleted", null);
  } catch (error) {
    next(error);
  }
};