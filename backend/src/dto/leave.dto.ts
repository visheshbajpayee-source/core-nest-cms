export interface CreateLeaveDto {
  leaveType: "sick" | "casual" | "earned" | "other";
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveStatusDto {
  status: "approved" | "rejected";
}

export interface LeaveResponseDto {
  id: string;
  employee: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  status: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
