import { Document, Types } from "mongoose";

export type WorkLogStatus =
  | "in_progress"
  | "completed"
  | "blocked";

export interface IWorkLog extends Document {
  employee: Types.ObjectId;
  date: Date;
  taskTitle: string;
  taskDescription: string;
  project?: Types.ObjectId;
  hoursSpent: number;
  status: WorkLogStatus;
  createdAt: Date;
  updatedAt: Date;
}
