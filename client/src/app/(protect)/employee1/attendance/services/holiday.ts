import api from '@/app/lib/api';

export interface Holiday {
  _id: string;
  name: string;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HolidayResponse {
  success: boolean;
  data: Holiday[];
  message?: string;
}

export interface HolidayFilters {
  year?: string;
  month?: string;
}

export const getHolidays = async (filters?: HolidayFilters): Promise<HolidayResponse> => {
  try {
    const params: Record<string, string> = {};
    if (filters?.year) params.year = filters.year;
    if (filters?.month) params.month = filters.month;

    const response = await api.get(`/api/v1/holidays`, { params });

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Error fetching holidays:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch holidays',
    };
  }
};

export const getHolidayById = async (id: string): Promise<{ success: boolean; data: Holiday | null; message?: string }> => {
  try {
    const response = await api.get(`/api/v1/holidays/${id}`);

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Error fetching holiday:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to fetch holiday',
    };
  }
};

// Helper function to format holiday date to YYYY-MM-DD
export const formatHolidayDate = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to check if a date is a holiday
export const isHoliday = (date: Date, holidays: Holiday[]): Holiday | null => {
  const dateKey = formatHolidayDate(date.toISOString());
  return holidays.find(holiday => formatHolidayDate(holiday.date) === dateKey) || null;
};
