import { Document } from "mongoose";

export interface IDesignation extends Document {
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
