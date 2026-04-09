import { Document, Types } from "mongoose";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "in_review"
  | "done";

export interface ITask extends Document {
  title: string;
  description?: string;
  project: Types.ObjectId;
  assignedTo: Types.ObjectId[];
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
