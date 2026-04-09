export interface CreateAttendanceDto {
  employee: string;   // ObjectId as string
  date: string;       // ISO string
  checkInTime?: string;
  status: "present" | "absent" | "on_leave" | "holiday";
}

export interface AttendanceResponseDto {
  id: string;
  employee: string;
  date: Date;
  checkInTime?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

