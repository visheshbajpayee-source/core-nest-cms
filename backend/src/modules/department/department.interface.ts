import { Document, Types } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description?: string;
  head?: Types.ObjectId; // Manager reference
  createdAt: Date;
  updatedAt: Date;
}
