# Employee Feature - Practical Implementation Examples

This document shows concrete examples of converting admin features to employee features using your existing code.

---

## Example 1: Attendance Module

### Backend: Add Employee Endpoint

**Current Status:** You have admin attendance endpoints

**What to Add:**
```typescript
// backend/src/modules/attendance/attendance.routes.ts

import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import {
  getMyAttendanceController,
  checkInController,
  checkOutController,
  getAttendanceController,        // Already exists for admin
  updateAttendanceController,     // Already exists for admin
} from "./attendance.controller";

const router = Router();

// ✅ Employee endpoints (all authenticated users)
router.get("/me", authMiddleware, getMyAttendanceController);
router.post("/checkin", authMiddleware, checkInController);
router.post("/checkout", authMiddleware, checkOutController);

// ✅ Admin endpoints (already exist)
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAttendanceController);
router.patch("/:id", authMiddleware, roleMiddleware(["admin"]), updateAttendanceController);

export default router;
```

**Update Services:**
```typescript
// backend/src/modules/attendance/attendance.service.ts

// NEW: Employee checks in
export const checkIn = async (employeeId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already checked in today
  const existingRecord = await Attendance.findOne({
    employeeId,
    date: { $gte: today },
  });

  if (existingRecord && existingRecord.checkin) {
    throw new ApiError(400, "Already checked in today");
  }

  // Create or update attendance
  const attendance = await Attendance.findOneAndUpdate(
    { employeeId, date: { $gte: today } },
    {
      employeeId,
      date: new Date(),
      checkin: new Date(),
      status: "present",
    },
    { upsert: true, new: true }
  );

  return attendance;
};

// NEW: Employee checks out
export const checkOut = async (employeeId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({
    employeeId,
    date: { $gte: today },
  });

  if (!attendance) {
    throw new ApiError(400, "Please check in first");
  }

  if (attendance.checkout) {
    throw new ApiError(400, "Already checked out today");
  }

  const checkoutTime = new Date();
  const checkinTime = new Date(attendance.checkin);
  
  // Calculate work hours
  const workHours = (checkoutTime.getTime() - checkinTime.getTime()) / (1000 * 60 * 60);

  attendance.checkout = checkoutTime;
  attendance.workHours = parseFloat(workHours.toFixed(2));
  
  await attendance.save();
  return attendance;
};

// EXISTING but filtered for employee
export const getMyAttendance = async (
  employeeId: string,
  month?: number,
  year?: number
) => {
  const query: any = { employeeId };

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: startDate, $lte: endDate };
  }

  const records = await Attendance.find(query)
    .sort({ date: -1 })
    .lean();

  return records;
};
```

**Update Controllers:**
```typescript
// backend/src/modules/attendance/attendance.controller.ts

export const checkInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const result = await checkIn(user.id);
    return ApiResponse.sendSuccess(res, 200, "Checked in successfully", result);
  } catch (error) {
    next(error);
  }
};

export const checkOutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const result = await checkOut(user.id);
    return ApiResponse.sendSuccess(res, 200, "Checked out successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getMyAttendanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { month, year } = req.query;
    
    const data = await getMyAttendance(
      user.id,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    );

    return ApiResponse.sendSuccess(res, 200, "Attendance retrieved", data);
  } catch (error) {
    next(error);
  }
};
```

### Frontend: Create Employee Attendance Page

**Create File:** `client/src/app/(protect)/Employee/attendance/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AttendanceService from "./service";

interface AttendanceRecord {
  _id: string;
  date: string;
  checkin: string;
  checkout: string | null;
  workHours: number;
  status: "present" | "absent" | "leave" | "half-day";
}

export default function EmployeeAttendancePage() {
  const router = useRouter();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkedOutToday, setCheckedOutToday] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAttendance();
  }, [currentMonth, currentYear, router]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await AttendanceService.getMyAttendance(currentMonth, currentYear);
      setRecords(data);

      // Check if user checked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayRecord = data.find((r: any) => {
        const recordDate = new Date(r.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      setCheckedInToday(!!todayRecord?.checkin);
      setCheckedOutToday(!!todayRecord?.checkout);
    } catch (error) {
      console.error("Failed to fetch attendance", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await AttendanceService.checkIn();
      setCheckedInToday(true);
      alert("Checked in successfully!");
      fetchAttendance();
    } catch (error) {
      alert("Check-in failed");
      console.error(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await AttendanceService.checkOut();
      setCheckedOutToday(true);
      alert("Checked out successfully!");
      fetchAttendance();
    } catch (error) {
      alert("Check-out failed");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading attendance records...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Attendance</h1>

      {/* Quick Check-In/Out */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Status</h2>
        <div className="flex gap-4">
          <button
            onClick={handleCheckIn}
            disabled={checkedInToday}
            className={`px-6 py-2 rounded font-semibold ${
              checkedInToday
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {checkedInToday ? "✓ Checked In" : "Check In"}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!checkedInToday || checkedOutToday}
            className={`px-6 py-2 rounded font-semibold ${
              !checkedInToday || checkedOutToday
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {checkedOutToday ? "✓ Checked Out" : "Check Out"}
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {new Date(currentYear, currentMonth - 1).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (currentMonth === 1) {
                  setCurrentMonth(12);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                if (currentMonth === 12) {
                  setCurrentMonth(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Check In</th>
                <th className="border p-3 text-left">Check Out</th>
                <th className="border p-3 text-left">Work Hours</th>
                <th className="border p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border p-3 text-center text-gray-500">
                    No attendance records for this month
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="border p-3">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="border p-3">
                      {record.checkin
                        ? new Date(record.checkin).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td className="border p-3">
                      {record.checkout
                        ? new Date(record.checkout).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td className="border p-3">{record.workHours || "-"}</td>
                    <td className="border p-3">
                      <span
                        className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                          record.status === "present"
                            ? "bg-green-500"
                            : record.status === "absent"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

**Create Service:** `client/src/app/(protect)/Employee/attendance/service.ts`

```typescript
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AttendanceService = {
  getMyAttendance: async (month: number, year: number) => {
    const response = await API.get("/attendance/me", {
      params: { month, year },
    });
    return response.data.data;
  },

  checkIn: async () => {
    const response = await API.post("/attendance/checkin", {});
    return response.data.data;
  },

  checkOut: async () => {
    const response = await API.post("/attendance/checkout", {});
    return response.data.data;
  },
};

export default AttendanceService;
```

---

## Example 2: Leave Application Module

### Backend: Add Employee Leave Application

**Update Routes:**
```typescript
// backend/src/modules/leaves/leave.routes.ts

import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import {
  applyForLeaveController,         // NEW
  getMyLeavesController,           // NEW
  getLeavesController,             // EXISTING - Admin only
  approveLeavesController,         // EXISTING - Admin only
} from "./leave.controller";

const router = Router();

// ✅ Employee endpoints
router.get("/me", authMiddleware, getMyLeavesController);
router.post("/apply", authMiddleware, applyForLeaveController);

// ✅ Admin endpoints
router.get("/", authMiddleware, roleMiddleware(["admin"]), getLeavesController);
router.patch("/:id", authMiddleware, roleMiddleware(["admin"]), approveLeavesController);

export default router;
```

**Update Services:**
```typescript
// backend/src/modules/leaves/leave.service.ts

export const applyForLeave = async (employeeId: string, leaveData: any) => {
  // Validate dates
  const startDate = new Date(leaveData.startDate);
  const endDate = new Date(leaveData.endDate);

  if (startDate > endDate) {
    throw new ApiError(400, "Start date must be before end date");
  }

  // Check leave balance
  const leaveBalance = await LeaveBalance.findOne({
    employeeId,
    leaveType: leaveData.leaveType,
    year: new Date().getFullYear(),
  });

  if (!leaveBalance || leaveBalance.available <= 0) {
    throw new ApiError(400, "Insufficient leave balance");
  }

  // Calculate days
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  // Create leave application
  const leave = await Leave.create({
    employeeId,
    startDate,
    endDate,
    days,
    leaveType: leaveData.leaveType,
    reason: leaveData.reason,
    status: "pending",
    appliedOn: new Date(),
  });

  return leave;
};

export const getMyLeaves = async (employeeId: string, filters?: any) => {
  const query: any = { employeeId };

  if (filters?.status) {
    query.status = filters.status;
  }

  const leaves = await Leave.find(query)
    .sort({ appliedOn: -1 })
    .lean();

  return leaves;
};
```

**Update Controllers:**
```typescript
// backend/src/modules/leaves/leave.controller.ts

export const applyForLeaveController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { startDate, endDate, leaveType, reason } = req.body;

    // Validate required fields
    if (!startDate || !endDate || !leaveType) {
      throw new ApiError(400, "Missing required fields");
    }

    const leave = await applyForLeave(user.id, {
      startDate,
      endDate,
      leaveType,
      reason,
    });

    return ApiResponse.sendSuccess(res, 201, "Leave applied successfully", leave);
  } catch (error) {
    next(error);
  }
};

export const getMyLeavesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { status } = req.query;

    const leaves = await getMyLeaves(user.id, { status });

    return ApiResponse.sendSuccess(res, 200, "Leaves retrieved", leaves);
  } catch (error) {
    next(error);
  }
};
```

### Frontend: Create Employee Leave Page

**Create File:** `client/src/app/(protect)/Employee/leave/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeaveService from "./service";

interface Leave {
  _id: string;
  startDate: string;
  endDate: string;
  days: number;
  leaveType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
}

export default function EmployeeLeavePage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "casual",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchLeaves();
    fetchLeaveBalance();
  }, [router]);

  const fetchLeaves = async () => {
    try {
      const data = await LeaveService.getMyLeaves();
      setLeaves(data);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const data = await LeaveService.getMyLeaveBalance();
      setLeaveBalance(data);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await LeaveService.applyForLeave(formData);
      alert("Leave application submitted successfully!");
      setFormData({ startDate: "", endDate: "", leaveType: "casual", reason: "" });
      setShowForm(false);
      fetchLeaves();
      fetchLeaveBalance();
    } catch (error) {
      alert("Failed to apply for leave");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading leave records...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Leave</h1>

      {/* Leave Balance Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Casual Leaves</p>
            <p className="text-2xl font-bold text-blue-600">{leaveBalance.casual || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Sick Leaves</p>
            <p className="text-2xl font-bold text-green-600">{leaveBalance.sick || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Earned Leaves</p>
            <p className="text-2xl font-bold text-yellow-600">{leaveBalance.earned || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Total Available</p>
            <p className="text-2xl font-bold text-purple-600">{leaveBalance.total || 0}</p>
          </div>
        </div>
      </div>

      {/* Apply Leave Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold mb-8"
      >
        {showForm ? "Cancel" : "Apply for Leave"}
      </button>

      {/* Leave Application Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">New Leave Application</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Leave Type</label>
              <select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="earned">Earned Leave</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Reason</label>
              <textarea
                rows={4}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Enter reason for leave (optional)"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold disabled:bg-gray-400"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      )}

      {/* Leave History Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Leave Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Applied On</th>
                <th className="border p-3 text-left">Start Date</th>
                <th className="border p-3 text-left">End Date</th>
                <th className="border p-3 text-left">Days</th>
                <th className="border p-3 text-left">Type</th>
                <th className="border p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border p-3 text-center text-gray-500">
                    No leave applications
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="border p-3">
                      {new Date(leave.appliedOn).toLocaleDateString()}
                    </td>
                    <td className="border p-3">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="border p-3">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="border p-3">{leave.days}</td>
                    <td className="border p-3">{leave.leaveType}</td>
                    <td className="border p-3">
                      <span
                        className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                          leave.status === "approved"
                            ? "bg-green-500"
                            : leave.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {leave.status.charAt(0).toUpperCase() +
                          leave.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

**Create Service:** `client/src/app/(protect)/Employee/leave/service.ts`

```typescript
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const LeaveService = {
  getMyLeaves: async () => {
    const response = await API.get("/leaves/me");
    return response.data.data;
  },

  applyForLeave: async (leaveData: any) => {
    const response = await API.post("/leaves/apply", leaveData);
    return response.data.data;
  },

  getMyLeaveBalance: async () => {
    const response = await API.get("/leave-balances/me");
    return response.data.data;
  },
};

export default LeaveService;
```

---

## Example 3: Dashboard Summary

### Backend: Create Dashboard Endpoint

```typescript
// backend/src/modules/employees/employee.controller.ts

export const getDashboardSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    
    // Fetch today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAttendance = await Attendance.findOne({
      employeeId: user.id,
      date: { $gte: today },
    });

    // Fetch pending leaves
    const pendingLeaves = await Leave.countDocuments({
      employeeId: user.id,
      status: "pending",
    });

    // Fetch assigned tasks
    const assignedTasks = await Task.find({
      assignedTo: user.id,
      status: { $ne: "completed" },
    }).select("_id title");

    // Fetch announcements
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title content createdAt");

    // Fetch leave balance
    const leaveBalance = await LeaveBalance.findOne({
      employeeId: user.id,
      year: new Date().getFullYear(),
    });

    const summary = {
      attendance: {
        checkedIn: !!todayAttendance?.checkin,
        checkedOut: !!todayAttendance?.checkout,
        time: todayAttendance?.checkin,
      },
      pendingLeaves,
      assignedTasks: assignedTasks.length,
      leaveBalance: leaveBalance?.available || 0,
      announcements,
    };

    return ApiResponse.sendSuccess(res, 200, "Dashboard summary retrieved", summary);
  } catch (error) {
    next(error);
  }
};
```

### Frontend: Employee Dashboard Component

```typescript
// client/src/EmployeeComponents/EmployeeDashboard.tsx

"use client";

import { useState, useEffect } from "react";

interface DashboardData {
  attendance: {
    checkedIn: boolean;
    checkedOut: boolean;
    time: string;
  };
  pendingLeaves: number;
  assignedTasks: number;
  leaveBalance: number;
  announcements: any[];
}

interface Props {
  data: DashboardData;
}

export default function EmployeeDashboard({ data }: Props) {
  return (
    <div className="space-y-8">
      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <p className="text-gray-600 text-sm mb-2">Today's Status</p>
          <p className="text-2xl font-bold text-blue-600">
            {data.attendance.checkedIn ? "✓ Checked In" : "Not Checked In"}
          </p>
          {data.attendance.checkedIn && (
            <p className="text-xs text-gray-500 mt-2">
              at {new Date(data.attendance.time).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
          <p className="text-gray-600 text-sm mb-2">Pending Leaves</p>
          <p className="text-2xl font-bold text-yellow-600">{data.pendingLeaves}</p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
          <p className="text-gray-600 text-sm mb-2">Assigned Tasks</p>
          <p className="text-2xl font-bold text-green-600">{data.assignedTasks}</p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
          <p className="text-gray-600 text-sm mb-2">Leave Balance</p>
          <p className="text-2xl font-bold text-purple-600">{data.leaveBalance} days</p>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
        <div className="space-y-4">
          {data.announcements.map((announcement, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Summary of Changes

### Backend Changes Required:
1. Add `/me` endpoints to all modules
2. Add role middleware checks
3. Filter data by `userId` in services
4. Update controllers to handle employee operations

### Frontend Changes Required:
1. Create `/Employee/` route folder
2. Create protected layout component
3. Create feature pages (attendance, leave, tasks, etc.)
4. Create service files for API calls
5. Update sidebar navigation

This pattern repeats for every feature you want employees to access!
