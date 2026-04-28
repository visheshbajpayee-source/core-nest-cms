import api from "../lib/api";

// ============================================
// Types
// ============================================

export interface EmployeeProfile {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: "employee" | "manager" | "admin";
  department: string;
  departmentId?: string;
  designation: string;
  designationId?: string;
  dateOfJoining: string;
  employeeId: string;
  status: string;
  profilePicture?: string;
}

export interface UpdateEmployeePayload {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  [key: string]: any;
}

export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  phoneNumber?: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  role?: string;
  status?: string;
  [key: string]: any;
}

export interface EmployeeListFilters {
  department?: string;
  designation?: string;
  status?: string;
  role?: string;
  search?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ============================================
// Employee API Service
// ============================================

/**
 * Get authenticated user's own profile
 */
export const getOwnProfile = async (): Promise<EmployeeProfile> => {
  try {
    const response = await api.get<ApiResponse<EmployeeProfile>>(
      "/api/v1/employees/me"
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get all employees with optional filters
 * @param filters - Filter options (department, designation, status, role, search)
 */
export const getAllEmployees = async (
  filters?: EmployeeListFilters
): Promise<EmployeeProfile[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/employees?${queryString}`
      : "/api/v1/employees";

    const response = await api.get<ApiResponse<EmployeeProfile[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get employee by ID
 * @param id - Employee ID (MongoDB ObjectId or employeeId)
 */
export const getEmployeeById = async (id: string): Promise<EmployeeProfile> => {
  try {
    const response = await api.get<ApiResponse<EmployeeProfile>>(
      `/api/v1/employees/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Create a new employee (admin only)
 * @param payload - Employee creation data
 */
export const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<EmployeeProfile> => {
  try {
    const response = await api.post<ApiResponse<EmployeeProfile>>(
      "/api/v1/employees",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update own profile
 * @param payload - Partial employee data to update
 */
export const updateOwnProfile = async (
  payload: UpdateEmployeePayload
): Promise<EmployeeProfile> => {
  try {
    const response = await api.put<ApiResponse<EmployeeProfile>>(
      "/api/v1/employees/me",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update an employee (admin/manager for specific fields)
 * @param id - Employee ID
 * @param payload - Partial employee data to update
 */
export const updateEmployee = async (
  id: string,
  payload: UpdateEmployeePayload
): Promise<EmployeeProfile> => {
  try {
    const response = await api.put<ApiResponse<EmployeeProfile>>(
      `/api/v1/employees/${id}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Delete an employee (admin only)
 * @param id - Employee ID
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/employees/${id}`);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Archive inactive employees (admin only)
 * @param inactivityDays - Number of days of inactivity (default: 90)
 */
export const archiveInactiveEmployees = async (
  inactivityDays?: number
): Promise<any> => {
  try {
    const payload = inactivityDays ? { inactivityDays } : {};
    const response = await api.post(
      "/api/v1/employees/archive-inactive",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Search employees
 * @param searchTerm - Search term (searches in name, email, employeeId)
 * @param filters - Additional filters
 */
export const searchEmployees = async (
  searchTerm: string,
  filters?: Omit<EmployeeListFilters, "search">
): Promise<EmployeeProfile[]> => {
  return getAllEmployees({
    ...filters,
    search: searchTerm,
  });
};

/**
 * Get employees by department
 * @param departmentId - Department ID
 */
export const getEmployeesByDepartment = async (
  departmentId: string
): Promise<EmployeeProfile[]> => {
  return getAllEmployees({
    department: departmentId,
  });
};

/**
 * Get employees by designation
 * @param designationId - Designation ID
 */
export const getEmployeesByDesignation = async (
  designationId: string
): Promise<EmployeeProfile[]> => {
  return getAllEmployees({
    designation: designationId,
  });
};

/**
 * Get active employees
 */
export const getActiveEmployees = async (): Promise<EmployeeProfile[]> => {
  return getAllEmployees({
    status: "active",
  });
};

/**
 * Get inactive employees
 */
export const getInactiveEmployees = async (): Promise<EmployeeProfile[]> => {
  return getAllEmployees({
    status: "inactive",
  });
};
