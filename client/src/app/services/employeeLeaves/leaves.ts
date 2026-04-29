// Types for Leave Management
export interface LeaveRecord {
  id: string;
  leaveType: "sick" | "casual" | "earned" | "other";
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  appliedDate: string;
}

export interface LeaveHistoryResponse {
  success: boolean;
  data: LeaveRecord[];
}

export interface LeaveFilters {
  month?: string;
  year?: string;
  status?: string;
  leaveType?: string;
}

const dummyLeaveData: LeaveRecord[] = [
  {
    id: "1",
    leaveType: "sick",
    startDate: "2026-02-03",
    endDate: "2026-02-05",
    numberOfDays: 3,
    reason: "Medical checkup and recovery",
    status: "approved",
    createdAt: "2026-01-28T10:00:00Z",
    appliedDate: "2026-01-28",
  },
  {
    id: "2",
    leaveType: "casual",
    startDate: "2026-02-15",
    endDate: "2026-02-15",
    numberOfDays: 1,
    reason: "Personal work",
    status: "pending",
    createdAt: "2026-02-10T14:30:00Z",
    appliedDate: "2026-02-10",
  },
  {
    id: "3",
    leaveType: "earned",
    startDate: "2026-01-10",
    endDate: "2026-01-14",
    numberOfDays: 5,
    reason: "Family vacation",
    status: "rejected",
    createdAt: "2025-12-28T09:15:00Z",
    appliedDate: "2025-12-28",
  },
  {
    id: "4",
    leaveType: "other",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    numberOfDays: 3,
    reason: "Wedding ceremony",
    status: "approved",
    createdAt: "2026-03-01T11:45:00Z",
    appliedDate: "2026-03-01",
  },
];

/**
 * Fetch leave history for an employee.
 * Currently returns dummy data; the live API is wired in
 * src/app/(protect)/employee1/leave/services/EmployeeLeaves/leaves.ts.
 */
export const getLeaveHistory = async (
  _employeeId: string,
  _filters?: LeaveFilters
): Promise<LeaveHistoryResponse> => {
  return {
    success: true,
    data: dummyLeaveData,
  };
};

export const leaveService = {
  getLeaveHistory,
};
