import { Holiday } from "./holiday.model";
import {
  CreateHolidayDto,
  UpdateHolidayDto,
  HolidayResponseDto,
} from "../../dto/holiday.dto";
import { ApiError } from "../../common/utils/ApiError";

/**
 * Create Holiday
 */
export const createHoliday = async (
  data: CreateHolidayDto
): Promise<HolidayResponseDto> => {

  const holidayDate = new Date(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (holidayDate < today) {
    throw ApiError.badRequest("Cannot create holiday in the past");
  }

  const holiday = await Holiday.create({ 
    ...data,
    date: holidayDate,
  });

  return mapToResponse(holiday);
};

/**
 * Get All Holidays
 */
export const getAllHolidays = async (
  includeInactive: boolean = false
): Promise<HolidayResponseDto[]> => {

  const filter = includeInactive ? {} : { isActive: true };

  const holidays = await Holiday.find(filter).sort({ date: 1 });

  return holidays.map(mapToResponse);
};

/**
 * Get Holiday By ID
 */
export const getHolidayById = async (
  id: string
): Promise<HolidayResponseDto> => {

  const holiday = await Holiday.findById(id);

  if (!holiday) {
    throw ApiError.notFound("Holiday not found");
  }

  return mapToResponse(holiday);
};

/**
 * Update Holiday
 */
export const updateHoliday = async (
  id: string,
  data: UpdateHolidayDto
): Promise<HolidayResponseDto> => {

  const holiday = await Holiday.findById(id);

  if (!holiday) {
    throw ApiError.notFound("Holiday not found");
  }

  if (!holiday.isActive) {
    throw ApiError.badRequest("Cannot update inactive holiday");
  }

  if (data.date) {
    const newDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) {
      throw ApiError.badRequest("Cannot set holiday date in the past");
    }

    holiday.date = newDate;
  }

  if (data.holidayName !== undefined) {
    holiday.holidayName = data.holidayName;
  }

  if (data.description !== undefined) {
    holiday.description = data.description;
  }

  if (data.type !== undefined) {
    holiday.type = data.type;
  }

  await holiday.save();

  return mapToResponse(holiday);
};

/**
 * Soft Delete
 */
export const deactivateHoliday = async (id: string): Promise<void> => {

  const holiday = await Holiday.findById(id);

  if (!holiday) {
    throw ApiError.notFound("Holiday not found");
  }

  // Idempotent
  holiday.isActive = false;
  await holiday.save();
};

/**
 * Mapper
 */
const mapToResponse = (holiday: any): HolidayResponseDto => ({
  id: holiday._id.toString(),
  holidayName: holiday.holidayName,
  date: holiday.date,
  description: holiday.description,
  type: holiday.type,
  isActive: holiday.isActive,
  createdAt: holiday.createdAt,
  updatedAt: holiday.updatedAt,
});