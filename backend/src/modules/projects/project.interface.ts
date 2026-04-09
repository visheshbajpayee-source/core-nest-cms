import { Document, Types } from "mongoose";

export type ProjectStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "on_hold";

export interface IProject extends Document {
  name: string;
  description?: string;
  startDate: Date;
  expectedEndDate: Date;
  status: ProjectStatus;
  department: Types.ObjectId;
  teamMembers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
