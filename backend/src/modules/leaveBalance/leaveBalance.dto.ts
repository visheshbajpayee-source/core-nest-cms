export interface CreateLeaveBalanceDto {
  employee: string;
  year: number;
  leaveType: "sick" | "casual" | "earned" | "other";
  allocated: number;
}

export interface UpdateLeaveBalanceDto {
  allocated?: number;
  used?: number;
}

export interface LeaveBalanceResponseDto {
  id: string;
  employee: string;
  year: number;
  leaveType: string;
  allocated: number;
  used: number;
  remaining: number; // calculated in service layer
  createdAt: Date;
  updatedAt: Date;
}
