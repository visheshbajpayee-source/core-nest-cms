import { Announcement } from "./announcement.model";
import { CreateAnnouncementDto, AnnouncementResponseDto } from "./announcement.dto";
import { ApiError } from "../../common/utils/ApiError";
import { Types } from "mongoose";

export const createAnnouncement = async (
  data: CreateAnnouncementDto,
  creatorId: string
): Promise<AnnouncementResponseDto> => {
  try {
    const payload: any = { ...data };
    if (payload.department) payload.department = new Types.ObjectId(payload.department);
    payload.createdBy = new Types.ObjectId(creatorId);
    if (payload.expiryDate) payload.expiryDate = new Date(payload.expiryDate);

    const doc = await Announcement.create(payload);

    return {
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      target: doc.target,
      department: doc.department ? doc.department.toString() : undefined,
      priority: doc.priority,
      publishedAt: doc.publishedAt,
      expiryDate: doc.expiryDate,
      createdBy: doc.createdBy.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  } catch (error: any) {
    throw ApiError.internalServer(error.message || "Failed to create announcement");
  }
};

export const getActiveAnnouncementsForUser = async (
  user: { id: string; role: string; department?: string }
): Promise<AnnouncementResponseDto[]> => {
  try {
    const now = new Date();

    const query: any = {
      $or: [
        { target: "all" },
      ],
      $and: [
        { $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gt: now } }] },
      ],
    };

    if (user?.department) {
      query.$or.push({ $and: [{ target: "department" }, { department: user.department }] });
    }

    // Sort by publishedAt desc
    const docs = await Announcement.find(query).sort({ publishedAt: -1 });

    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      target: doc.target,
      department: doc.department ? doc.department.toString() : undefined,
      priority: doc.priority,
      publishedAt: doc.publishedAt,
      expiryDate: doc.expiryDate,
      createdBy: doc.createdBy.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  } catch (error: any) {
    throw ApiError.internalServer("Failed to fetch announcements");
  }
};

export const getArchivedAnnouncementsForUser = async (
  user: { id: string; role: string; department?: string }
): Promise<AnnouncementResponseDto[]> => {
  try {
    const now = new Date();

    const query: any = {
      $and: [
        { expiryDate: { $exists: true } },
        { expiryDate: { $lte: now } },
      ],
    };

    // users can see archived announcements that were targeted at all or their department
    query.$or = [{ target: "all" }];
    if (user?.department) {
      query.$or.push({ $and: [{ target: "department" }, { department: user.department }] });
    }

    const docs = await Announcement.find(query).sort({ publishedAt: -1 });

    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      target: doc.target,
      department: doc.department ? doc.department.toString() : undefined,
      priority: doc.priority,
      publishedAt: doc.publishedAt,
      expiryDate: doc.expiryDate,
      createdBy: doc.createdBy.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  } catch (error: any) {
    throw ApiError.internalServer("Failed to fetch archived announcements");
  }
};
