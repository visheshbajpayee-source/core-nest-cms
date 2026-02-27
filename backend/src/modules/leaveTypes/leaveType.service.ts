import { LeaveType } from "./leaveType.model";
import { ApiError } from "../../common/utils/ApiError";

/**
 * Create new leave type (Admin only)
 */
export const createLeaveType = async (data: {
  name: string;
  code: string;
  maxDaysPerYear: number;
}) => {
  const existing = await LeaveType.findOne({ code: data.code });

  if (existing) {
    throw ApiError.conflict("Leave type code already exists");
  }

  return await LeaveType.create(data);
};

/**
 * Get all active leave types
 */
export const getLeaveTypes = async () => {
  return await LeaveType.find({ isActive: true }).sort({ name: 1 });
};

/**
 * Update leave type
 */
export const updateLeaveType = async (
  id: string,
  data: Partial<{
    name: string;
    maxDaysPerYear: number;
    isActive: boolean;
  }>
) => {
  const updated = await LeaveType.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updated) {
    throw ApiError.notFound("Leave type not found");
  }

  return updated;
};

/**
 * Disable leave type (Soft delete)
 */
export const disableLeaveType = async (id: string) => {
  const updated = await LeaveType.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!updated) {
    throw ApiError.notFound("Leave type not found");
  }

  return updated;
};