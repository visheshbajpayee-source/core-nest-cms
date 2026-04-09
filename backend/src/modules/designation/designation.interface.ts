import { Document } from "mongoose";

export interface IDesignation extends Document {
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}