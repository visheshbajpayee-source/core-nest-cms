import { Announcement } from "./announcement.model";
import { CreateAnnouncementDto, AnnouncementResponseDto } from "./announcement.dto";
import { ApiError } from "../../common/utils/ApiError";
import { Types } from "mongoose";
import { Employee } from "../employees/employee.model";

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

    const docs = await Announcement.find({
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gt: now } }],
    }).sort({ publishedAt: -1 });

    const creatorIds = [...new Set(docs.map((d) => d.createdBy.toString()))];
    const creators = await Employee.find({ _id: { $in: creatorIds } }).select("_id role department");
    const creatorMap = new Map(creators.map((c: any) => [c._id.toString(), c]));

    const filtered = docs.filter((doc: any) => {
      const creator = creatorMap.get(doc.createdBy.toString());
      if (!creator) return false;

      // Admin-created announcements are visible to everyone.
      if (creator.role === "admin") return true;

      // Manager-created announcements are only visible to same-department users.
      if (creator.role === "manager") {
        if (!user?.department || !doc.department) return false;
        return doc.department.toString() === user.department.toString();
      }

      return false;
    });

    return filtered.map((doc: any) => ({
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

    const docs = await Announcement.find({
      $and: [{ expiryDate: { $exists: true } }, { expiryDate: { $lte: now } }],
    }).sort({ publishedAt: -1 });

    const creatorIds = [...new Set(docs.map((d) => d.createdBy.toString()))];
    const creators = await Employee.find({ _id: { $in: creatorIds } }).select("_id role department");
    const creatorMap = new Map(creators.map((c: any) => [c._id.toString(), c]));

    const filtered = docs.filter((doc: any) => {
      const creator = creatorMap.get(doc.createdBy.toString());
      if (!creator) return false;

      if (creator.role === "admin") return true;

      if (creator.role === "manager") {
        if (!user?.department || !doc.department) return false;
        return doc.department.toString() === user.department.toString();
      }

      return false;
    });

    return filtered.map((doc: any) => ({
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
