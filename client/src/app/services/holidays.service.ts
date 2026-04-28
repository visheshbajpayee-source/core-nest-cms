import api from "../lib/api";

export interface Holiday {
  _id?: string;
  id?: string;
  name: string;
  date: string;
  description?: string;
  isOptional?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Get all holidays
 */
export const getHolidays = async (filters?: {
  year?: number;
  month?: number;
}): Promise<Holiday[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/holidays?${queryString}`
      : "/api/v1/holidays";

    const response = await api.get<ApiResponse<Holiday[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get holidays for a specific year
 */
export const getHolidaysByYear = async (year: number): Promise<Holiday[]> => {
  return getHolidays({ year });
};

/**
 * Get holidays for a specific month
 */
export const getHolidaysByMonth = async (
  month: number,
  year?: number
): Promise<Holiday[]> => {
  const y = year || new Date().getFullYear();
  return getHolidays({ month, year: y });
};

/**
 * Get a specific holiday
 */
export const getHolidayById = async (holidayId: string): Promise<Holiday> => {
  try {
    const response = await api.get<ApiResponse<Holiday>>(
      `/api/v1/holidays/${holidayId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Create a new holiday (admin only)
 */
export const createHoliday = async (
  payload: Omit<Holiday, "_id" | "id" | "createdAt" | "updatedAt">
): Promise<Holiday> => {
  try {
    const response = await api.post<ApiResponse<Holiday>>(
      "/api/v1/holidays",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update a holiday (admin only)
 */
export const updateHoliday = async (
  holidayId: string,
  payload: Partial<Holiday>
): Promise<Holiday> => {
  try {
    const response = await api.put<ApiResponse<Holiday>>(
      `/api/v1/holidays/${holidayId}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Delete a holiday (admin only)
 */
export const deleteHoliday = async (holidayId: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/holidays/${holidayId}`);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get upcoming holidays
 */
export const getUpcomingHolidays = async (limit: number = 5): Promise<Holiday[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const holidays = await getHolidaysByYear(currentYear);
    
    const today = new Date();
    const upcoming = holidays
      .filter((h) => new Date(h.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
    
    return upcoming;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get optional holidays
 */
export const getOptionalHolidays = async (year?: number): Promise<Holiday[]> => {
  try {
    const y = year || new Date().getFullYear();
    const holidays = await getHolidaysByYear(y);
    return holidays.filter((h) => h.isOptional);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
