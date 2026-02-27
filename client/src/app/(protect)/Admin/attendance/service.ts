import type { AttendanceCorrectionPayload, AttendanceRecord } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getAttendanceRecords(params: {
  month: string;
  year: string;
  status?: string;
}): Promise<AttendanceRecord[]> {
  const query = new URLSearchParams({ month: params.month, year: params.year });
  if (params.status) query.set("status", params.status);

  const res = await fetch(`${API}/attendance?${query.toString()}`, { headers: getAuthHeaders() });
  const json = (await res.json()) as ApiResponse<AttendanceRecord[]>;

  if (!res.ok) throw new Error(json?.message || "Failed");
  return Array.isArray(json?.data) ? json.data : [];
}

export async function createAttendanceCorrection(payload: AttendanceCorrectionPayload): Promise<void> {
  const res = await fetch(`${API}/attendance`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as ApiResponse<unknown>;
  if (!res.ok) throw new Error(json?.message || "Failed");
}
