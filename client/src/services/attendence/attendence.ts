import axios from "axios";

// Types for Attendance
export interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Work From Home';
}

export interface AttendanceHistoryResponse {
  success: boolean;
  data: AttendanceRecord[];
}

export interface AttendanceFilters {
  month?: string; // e.g. '11'
  year?: string; // e.g. '2024'
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


const attendanceAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens
attendanceAPI.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetch attendance history for an employee
 */
export const getAttendanceHistory = async (
  employeeId: string,
  filters?: AttendanceFilters
): Promise<AttendanceHistoryResponse> => {
  try {
    const now = new Date();

    const month = filters?.month || String(now.getMonth() + 1).padStart(2, '0');
    const year = filters?.year || String(now.getFullYear());

    const query = new URLSearchParams({
      month,
      year,
    }).toString();

    const response = await attendanceAPI.get(
      `/attendance/${employeeId}/history?${query}`
    );

    return response.data;

  } catch (error) {
    console.warn("API call failed, returning dummy data:", error);
    return getDummyAttendanceHistory(employeeId, filters);
  }
};

/**
 * Mark attendance (check-in/check-out)
 */
export const markAttendance = async (
  employeeId: string,
  type: 'checkin' | 'checkout',
  location?: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await attendanceAPI.post(`/attendance/${employeeId}/${type}`, {
      timestamp: new Date().toISOString(),
      location,
    });
    
    return response.data;
  } catch (error) {
    console.error('Mark attendance failed:', error);
    throw new Error('Failed to mark attendance');
  }
};

/**
 * Get today's attendance status
 */
export const getTodayAttendance = async (
  employeeId: string
): Promise<AttendanceRecord | null> => {
  try {
    const response = await attendanceAPI.get(`/attendance/${employeeId}/today`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, returning dummy today attendance:', error);
    return getDummyTodayAttendance(employeeId);
  }
};

/**
 * Dummy data generator for development/testing
 */
const getDummyAttendanceHistory = (
  employeeId: string, 
  filters?: AttendanceFilters
): AttendanceHistoryResponse => {
  const generateDummyData = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const statuses: AttendanceRecord['status'][] = ['Present', 'Present', 'Present', 'Late', 'Absent', 'Work From Home'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const checkIn = status !== 'Absent' ? 
        `${8 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : 
        null;
      const checkOut = status !== 'Absent' && checkIn ? 
        `${17 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : 
        null;
      
      records.push({
        id: `att_${i + 1}`,
        employeeId,
        date: date.toISOString().split('T')[0],
        checkIn,
        checkOut,
        status,
        workingHours: status === 'Present' ? 8 + Math.random() * 2 : 
                     status === 'Half Day' ? 4 : 
                     status === 'Absent' ? 0 : 8.5,
        breakTime: status !== 'Absent' ? 0.5 + Math.random() * 0.5 : 0,
        overtime: Math.random() > 0.8 ? Math.random() * 2 : 0,
        location: status === 'Work From Home' ? 'Home' : 'Office',
        notes: status === 'Late' ? 'Traffic delay' : 
               status === 'Absent' ? 'Sick leave' : undefined,
      });
    }
    
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const data = generateDummyData();
  const totalRecords = data.length;
  const limit = filters?.limit || 10;
  const page = filters?.page || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = data.slice(startIndex, startIndex + limit);

  const presentDays = data.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const absentDays = data.filter(r => r.status === 'Absent').length;
  const totalWorkingHours = data.reduce((sum, r) => sum + r.workingHours, 0);
  const totalOvertimeHours = data.reduce((sum, r) => sum + r.overtime, 0);

  return {
    success: true,
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit,
    },
    summary: {
      totalPresentDays: presentDays,
      totalAbsentDays: absentDays,
      averageWorkingHours: totalWorkingHours / data.length,
      totalOvertimeHours,
    },
  };
};

/**
 * Get dummy today's attendance
 */
const getDummyTodayAttendance = (employeeId: string): AttendanceRecord => {
  const today = new Date().toISOString().split('T')[0];
  const isCheckedIn = Math.random() > 0.3; // 70% chance of being checked in
  
  return {
    id: `att_today`,
    employeeId,
    date: today,
    checkIn: isCheckedIn ? '09:15' : null,
    checkOut: null,
    status: isCheckedIn ? 'Present' : 'Absent',
    workingHours: 0,
    breakTime: 0,
    overtime: 0,
    location: 'Office',
  };
};

/**
 * Export all functions
 */
export const attendanceService = {
  getAttendanceHistory,
 
};

