import { Document, Types } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description?: string;
  departmentHead?: Types.ObjectId; // Ref to Employee
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}