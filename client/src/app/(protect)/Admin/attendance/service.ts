import type { AttendanceCorrectionPayload, AttendanceRecord } from "./types";
import api from "../../../lib/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function getAttendanceRecords(params: {
  month: string;
  year: string;
  status?: string;
}): Promise<AttendanceRecord[]> {
  const query: Record<string, string> = { month: params.month, year: params.year };
  if (params.status) query.status = params.status;

  try {
    const res = await api.get<ApiResponse<AttendanceRecord[]>>("/api/v1/attendance", { params: query });
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Failed");
  }
}

export async function createAttendanceCorrection(payload: AttendanceCorrectionPayload): Promise<void> {
  try {
    await api.post<ApiResponse<unknown>>("/api/v1/attendance", payload);
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Failed");
  }
}
