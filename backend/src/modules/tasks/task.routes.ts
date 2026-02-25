import { Router, Request, Response, NextFunction } from "express";
import { Task } from "./task.model";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";

const router: Router = Router();

// GET all tasks (optionally filter by project)
router.get("/", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { project, status, priority } = req.query;
    const query: any = {};
    if (project) query.project = project;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Employee sees only tasks assigned to them
    if (user?.role === "employee") {
      query.assignedTo = user.mongoId || user.id;
    }

    const tasks = await Task.find(query)
      .populate("project", "name")
      .populate("assignedTo", "fullName email employeeId")
      .sort({ dueDate: 1 })
      .lean();

    return ApiResponse.sendSuccess(res, 200, "Tasks fetched", tasks);
  } catch (e) { next(e); }
});

// GET single task
router.get("/:id", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "fullName email employeeId")
      .lean();
    if (!task) throw ApiError.notFound("Task not found");
    return ApiResponse.sendSuccess(res, 200, "Task fetched", task);
  } catch (e) { next(e); }
});

// POST create task (admin + manager)
router.post("/", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;
    if (!title || !project || !dueDate) throw ApiError.badRequest("title, project and dueDate are required");

    const task = await Task.create({
      title, description,
      project,
      assignedTo: assignedTo || [],
      priority: priority || "medium",
      status: status || "todo",
      dueDate: new Date(dueDate),
    });

    return ApiResponse.sendSuccess(res, 201, "Task created", task);
  } catch (e) { next(e); }
});

// PUT update task
router.put("/:id", protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const task = await Task.findById(req.params.id);
    if (!task) throw ApiError.notFound("Task not found");

    let update: any = {};

    // Employee can only update status of their own tasks
    if (user?.role === "employee") {
      const assigned = (task.assignedTo as any[]).map((id: any) => id.toString());
      const userId = (user.mongoId || user.id).toString();
      if (!assigned.includes(userId)) throw ApiError.forbidden("Not assigned to this task");
      update = { status: req.body.status };
    } else {
      const { title, description, project, assignedTo, priority, status, dueDate } = req.body;
      update = { title, description, project, assignedTo, priority, status, dueDate: dueDate ? new Date(dueDate) : undefined };
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    return ApiResponse.sendSuccess(res, 200, "Task updated", updated);
  } catch (e) { next(e); }
});

// DELETE task (admin + manager)
router.delete("/:id", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) throw ApiError.notFound("Task not found");
    return ApiResponse.sendSuccess(res, 200, "Task deleted", null);
  } catch (e) { next(e); }
});

export default router;
