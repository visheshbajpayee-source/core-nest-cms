import api from "../lib/api";

export interface Announcement {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  priority: "normal" | "important" | "urgent";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  expiryDate?: string;
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Get all announcements
 */
export const getAnnouncements = async (filters?: {
  priority?: string;
  status?: string;
}): Promise<Announcement[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/announcements?${queryString}`
      : "/api/v1/announcements";

    const response = await api.get<ApiResponse<Announcement[]>>(url);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get a specific announcement
 */
export const getAnnouncementById = async (announcementId: string): Promise<Announcement> => {
  try {
    const response = await api.get<ApiResponse<Announcement>>(
      `/api/v1/announcements/${announcementId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Create a new announcement (admin only)
 */
export const createAnnouncement = async (
  payload: Omit<Announcement, "_id" | "id" | "createdAt" | "updatedAt">
): Promise<Announcement> => {
  try {
    const response = await api.post<ApiResponse<Announcement>>(
      "/api/v1/announcements",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Update an announcement (admin only)
 */
export const updateAnnouncement = async (
  announcementId: string,
  payload: Partial<Announcement>
): Promise<Announcement> => {
  try {
    const response = await api.put<ApiResponse<Announcement>>(
      `/api/v1/announcements/${announcementId}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Delete an announcement (admin only)
 */
export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/announcements/${announcementId}`);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/**
 * Get urgent announcements
 */
export const getUrgentAnnouncements = async (): Promise<Announcement[]> => {
  return getAnnouncements({ priority: "urgent" });
};

/**
 * Get important announcements
 */
export const getImportantAnnouncements = async (): Promise<Announcement[]> => {
  return getAnnouncements({ priority: "important" });
};

/**
 * Get latest announcements
 */
export const getLatestAnnouncements = async (limit: number = 5): Promise<Announcement[]> => {
  try {
    const announcements = await getAnnouncements();
    return announcements.slice(0, limit);
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
