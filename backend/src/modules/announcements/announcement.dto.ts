export interface CreateAnnouncementDto {
  title: string;
  content: string;
  target: "all" | "department";
  department?: string;
  priority?: "normal" | "important" | "urgent";
  expiryDate?: string;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  target?: "all" | "department";
  department?: string;
  priority?: "normal" | "important" | "urgent";
  expiryDate?: string;
}

export interface AnnouncementResponseDto {
  id: string;
  title: string;
  content: string;
  target: string;
  department?: string;
  priority: string;
  publishedAt: Date;
  expiryDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
