import { Document, Types } from "mongoose";

export type AnnouncementPriority =
  | "normal"
  | "important"
  | "urgent";

export type AnnouncementTarget =
  | "all"
  | "department";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  target: AnnouncementTarget;
  department?: Types.ObjectId;
  priority: AnnouncementPriority;
  publishedAt: Date;
  expiryDate?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
