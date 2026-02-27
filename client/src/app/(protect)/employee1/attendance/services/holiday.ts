import axios from "axios";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Holiday Types
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

// Create axios instance
const holidayApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
holidayApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Holiday Service Functions
export const getHolidays = async (filters?: HolidayFilters): Promise<HolidayResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.year) {
      params.append('year', filters.year);
    }
    if (filters?.month) {
      params.append('month', filters.month);
    }

    const response = await holidayApi.get(`/holidays?${params.toString()}`);
    
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
    const response = await holidayApi.get(`/holidays/${id}`);
    
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
