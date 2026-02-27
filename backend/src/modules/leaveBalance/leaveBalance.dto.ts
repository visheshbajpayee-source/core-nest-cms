export interface CreateLeaveBalanceDto {
  employee: string;
  year: number;
  leaveType: string; // ObjectId of LeaveType
  allocated: number;
}

export interface UpdateLeaveBalanceDto {
  allocated?: number;
  used?: number;
}

export interface LeaveBalanceSummaryDto {
  leaveType: {
    id: string;
    name: string;
    code: string;
  };
  allocated: number;
  used: number;
  remaining: number;
}

export interface LeaveBalanceResponseDto {
  year: number;
  totalAllocated: number;
  totalUsed: number;
  totalRemaining: number;
  balances: LeaveBalanceSummaryDto[];
}