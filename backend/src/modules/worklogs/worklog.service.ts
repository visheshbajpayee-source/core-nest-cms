import { WorkLog } from "./worklog.model";
import { IWorkLog } from "./worklog.interface";
import { ApiError } from "../../common/utils/ApiError";

/*
 Service notes (Worklogs):
 - Lightweight wrapper around the WorkLog Mongoose model.
 - `createWorkLog`, `updateWorkLog`, `deleteWorkLog` perform basic CRUD and normalize errors.
 - `getWorkLogs` accepts filters { employee, project, date } and normalizes date to a day's range.
 - `getDailySummary` aggregates logs for a single employee and returns total hours.
 - For performance, most queries keep `employee` as an ObjectId rather than populating the entire document.
*/

export const createWorkLog = async (data: Partial<IWorkLog>) => {
  try {
    const wl = await WorkLog.create(data);
    return wl;
  } catch (error: any) {
    throw ApiError.internalServer(error.message || "Failed to create worklog");
  }
};

export const updateWorkLog = async (id: string, data: Partial<IWorkLog>) => {
  try {
    const wl = await WorkLog.findByIdAndUpdate(id, data, { new: true });
    return wl;
  } catch (error: any) {
    throw ApiError.internalServer("Failed to update worklog");
  }
};

export const deleteWorkLog = async (id: string) => {
  try {
    const wl = await WorkLog.findByIdAndDelete(id);
    return !!wl;
  } catch (error: any) {
    throw ApiError.internalServer("Failed to delete worklog");
  }
};

export const getWorkLogs = async (filters: Record<string, any> = {}) => {
  try {
    const query: any = {};
    if (filters.employee) query.employee = filters.employee;
    if (filters.project) query.project = filters.project;
    if (filters.date) {
      const d = new Date(filters.date);
      if (Number.isNaN(d.getTime())) throw ApiError.badRequest("Invalid date");
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }

    // return worklogs without populating employee (keep as ObjectId)
    const items = await WorkLog.find(query);
    return items;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw ApiError.internalServer("Failed to fetch worklogs");
  }
};

export const getWorkLogById = async (id: string) => {
  try {
    // keep employee as ObjectId for lighter payload
    const wl = await WorkLog.findById(id);
    return wl;
  } catch (error: any) {
    throw ApiError.internalServer("Failed to fetch worklog");
  }
};

export const getDailySummary = async (employeeId: string, date: string) => {
  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) throw ApiError.badRequest("Invalid date");
    const start = new Date(d.setHours(0, 0, 0, 0));
    const end = new Date(d.setHours(23, 59, 59, 999));

    const logs = await WorkLog.find({
      employee: employeeId,
      date: { $gte: start, $lte: end },
    });

    const totalHours = logs.reduce((s, l) => s + (l.hoursSpent || 0), 0);

    return { logs, totalHours };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw ApiError.internalServer("Failed to compute daily summary");
  }
};
