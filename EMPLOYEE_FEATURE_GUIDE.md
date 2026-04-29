# Employee Feature Implementation Guide

## Overview

This guide explains how to implement frontend and backend features for employees in your Core Nest CMS project. The project follows a modular architecture with clear separation of concerns.

---

## Architecture Pattern

### Backend Pattern (Express.js)
Each feature module follows this structure:
```
backend/src/modules/[feature]/
├── [feature].controller.ts    # Request handlers
├── [feature].service.ts       # Business logic
├── [feature].model.ts         # Mongoose schema & interface
├── [feature].routes.ts        # API endpoints
├── [feature].validation.ts    # Input validation (Zod)
├── [feature].dto.ts           # Data Transfer Objects
├── [feature].interface.ts     # TypeScript interfaces
└── [feature].utils.ts         # Helper functions (optional)
```

### Frontend Pattern (Next.js + React)
```
client/src/app/(protect)/
├── (auth)/layout.tsx          # Protected layout with auth check
├── Admin/                      # Admin-only features
│   ├── [feature]/page.tsx
│   └── [feature]/components/
└── Employee/                   # Employee-only features
    ├── [feature]/page.tsx
    ├── [feature]/components/
    └── [feature]/services/
```

---

## Step-by-Step Implementation

### Phase 1: Backend Setup

#### 1.1 Create Employee-Specific Routes & Controllers

**Key Principle:** Use middleware to check user role and restrict access

**Example: Employee Profile Routes**

```typescript
// backend/src/modules/employees/employee.routes.ts

import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import {
  getMyProfile,
  updateMyProfile,
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./employee.controller";

const router = Router();

// ✅ Employee endpoints (accessible by all authenticated users)
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

// ✅ Admin-only endpoints
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllEmployees);
router.post("/", authMiddleware, roleMiddleware(["admin"]), createEmployee);
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), getEmployeeById);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateEmployee);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteEmployee);

export default router;
```

#### 1.2 Create Service Methods with Role Checking

```typescript
// backend/src/modules/employees/employee.service.ts

import User from "./employee.model";
import { ApiError } from "../../common/utils/ApiError";

export const getMyProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const updateMyProfile = async (userId: string, updateData: any) => {
  // Employees can only update their own profile
  // Don't allow role or department changes
  const allowedFields = ["fullName", "phone", "address", "profilePhoto"];
  const updates = Object.keys(updateData)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateData[key];
      return obj;
    }, {});

  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const getAllEmployees = async (filters: any) => {
  // Admin-only: retrieve all employees
  const query = {};
  if (filters.departmentId) {
    query.departmentId = filters.departmentId;
  }
  if (filters.role) {
    query.role = filters.role;
  }
  const employees = await User.find(query)
    .populate("departmentId")
    .populate("designationId")
    .select("-password");
  return employees;
};
```

#### 1.3 Update API Route Registration

```typescript
// backend/src/routes.ts

import employeeRoutes from "./modules/employees/employee.routes";

const router = Router();

// Employee routes handle both personal (/me) and admin operations (/all, etc.)
router.use("/employees", employeeRoutes);

export default router;
```

---

### Phase 2: Frontend Setup

#### 2.1 Create Employee Protected Routes Layout

```typescript
// client/src/app/(protect)/Employee/layout.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/layout/Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      router.push("/login");
    }

    // Redirect admin users
    if (user.role === "admin") {
      router.push("/Admin/dashboard");
    }
  }, [router]);

  return (
    <div className="flex">
      <Sidebar role="employee" />
      <main className="flex-1 ml-64 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
```

#### 2.2 Create Employee Dashboard Page

```typescript
// client/src/app/(protect)/Employee/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import EmployeeDashboard from "../../../../EmployeeComponents/EmployeeDashboard";
import { getEmployeeDashboard } from "./service";

export default function EmployeeDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployeeDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <EmployeeDashboard data={dashboardData} />;
}
```

#### 2.3 Create Service Layer for API Calls

```typescript
// client/src/app/(protect)/Employee/dashboard/service.ts

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getEmployeeDashboard = async () => {
  const response = await API.get("/employees/me/dashboard");
  return response.data.data;
};

export const getMyAttendance = async (month: number, year: number) => {
  const response = await API.get("/attendance/me", {
    params: { month, year },
  });
  return response.data.data;
};

export const getMyLeaves = async () => {
  const response = await API.get("/leaves/me");
  return response.data.data;
};

export const applyForLeave = async (leaveData: any) => {
  const response = await API.post("/leaves/apply", leaveData);
  return response.data.data;
};
```

---

## Complete Folder Structure for Employee Features

### Backend Structure

```
backend/src/modules/
├── employees/
│   ├── employee.controller.ts
│   ├── employee.service.ts
│   ├── employee.model.ts
│   ├── employee.routes.ts
│   ├── employee.validation.ts
│   ├── employee.dto.ts
│   └── employee.interface.ts
│
├── attendance/
│   ├── attendance.controller.ts      ← Add endpoints for /attendance/me (employee)
│   ├── attendance.service.ts
│   ├── attendance.model.ts
│   ├── attendance.routes.ts
│   ├── attendance.validation.ts
│   └── attendance.interface.ts
│
├── leaves/
│   ├── leave.controller.ts           ← Add endpoints for /leaves/apply, /leaves/me
│   ├── leave.service.ts
│   ├── leave.model.ts
│   ├── leave.routes.ts
│   ├── leave.validation.ts
│   └── leave.interface.ts
│
├── projects/
│   ├── project.controller.ts         ← Add endpoints for /projects/assigned-to-me
│   ├── project.service.ts
│   ├── project.model.ts
│   ├── project.routes.ts
│   └── project.interface.ts
│
├── tasks/
│   ├── task.controller.ts            ← Add endpoints for /tasks/assigned-to-me
│   ├── task.service.ts
│   ├── task.model.ts
│   ├── task.routes.ts
│   └── task.interface.ts
│
├── worklogs/
│   ├── worklog.controller.ts         ← Add endpoints for /worklogs/me
│   ├── worklog.service.ts
│   ├── worklog.model.ts
│   ├── worklog.routes.ts
│   └── worklog.interface.ts
│
├── announcements/
│   ├── announcement.controller.ts    ← Add endpoint for /announcements (view only)
│   ├── announcement.service.ts
│   └── announcement.model.ts
│
└── holiday/
    └── [similar structure]
```

### Frontend Structure

```
client/src/app/(protect)/Employee/
├── layout.tsx                         ← Protected layout with role check
├── dashboard/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       ├── DashboardStats.tsx
│       ├── RecentActivity.tsx
│       └── QuickActions.tsx
│
├── profile/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       ├── ProfileForm.tsx
│       └── ProfileHeader.tsx
│
├── attendance/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       ├── AttendanceTable.tsx
│       ├── CheckInOut.tsx
│       └── AttendanceSummary.tsx
│
├── leave/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       ├── LeaveForm.tsx
│       ├── LeaveHistory.tsx
│       └── LeaveBalance.tsx
│
├── tasks/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       ├── TaskList.tsx
│       ├── TaskCard.tsx
│       └── TaskFilter.tsx
│
├── projects/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       ├── ProjectList.tsx
│       └── ProjectDetail.tsx
│
├── worklog/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       ├── WorklogForm.tsx
│       └── WorklogHistory.tsx
│
├── announcements/
│   ├── page.tsx
│   ├── service.ts
│   └── components/
│       └── AnnouncementList.tsx
│
└── holidays/
    ├── page.tsx
    └── service.ts
```

---

## Key Implementation Points

### 1. Role-Based Access Control (Backend)

Always check user role in controllers:

```typescript
import { roleMiddleware } from "../../common/middlewares/role.middleware";

// Only admin can create
router.post("/", authMiddleware, roleMiddleware(["admin"]), createEmployee);

// All authenticated users can view their own
router.get("/me", authMiddleware, getMyProfile);

// Only admin/manager can view all
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  getAllEmployees
);
```

### 2. Employee-Specific Endpoints

For each feature, add `/me` endpoints:

```typescript
// Attendance
GET /attendance/me           ← Employee's own attendance
GET /attendance              ← Admin view all

// Leaves
GET /leaves/me              ← Employee's own leaves
POST /leaves/apply          ← Employee applies for leave
GET /leaves                 ← Admin view all

// Worklogs
GET /worklogs/me            ← Employee's own worklogs
POST /worklogs              ← Employee creates worklog
```

### 3. Frontend Role Checking

Always verify user role before rendering:

```typescript
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeOnlyPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Redirect if not employee or higher
    if (!["employee", "manager", "admin"].includes(user.role)) {
      router.push("/login");
    }
  }, []);

  return <div>Employee Content</div>;
}
```

### 4. Sidebar Navigation for Employees

```typescript
// client/src/components/layout/Sidebar.tsx

const EMPLOYEE_ROUTES = [
  { name: "Dashboard", path: "/Employee/dashboard" },
  { name: "Profile", path: "/Employee/profile" },
  { name: "Attendance", path: "/Employee/attendance" },
  { name: "Leave", path: "/Employee/leave" },
  { name: "Tasks", path: "/Employee/tasks" },
  { name: "Projects", path: "/Employee/projects" },
  { name: "Worklog", path: "/Employee/worklog" },
  { name: "Announcements", path: "/Employee/announcements" },
  { name: "Holidays", path: "/Employee/holidays" },
];
```

---

## Step-by-Step Implementation Checklist

### Backend (Priority Order)

- [ ] **Step 1:** Update employee controller with `/me` endpoints
- [ ] **Step 2:** Update attendance routes - add `/attendance/me`
- [ ] **Step 3:** Update leaves routes - add `/leaves/me`, `/leaves/apply`
- [ ] **Step 4:** Update projects routes - add `/projects/assigned-to-me`
- [ ] **Step 5:** Update tasks routes - add `/tasks/assigned-to-me`
- [ ] **Step 6:** Update worklogs routes - add `/worklogs/me`
- [ ] **Step 7:** Ensure role middleware is applied correctly

### Frontend (Priority Order)

- [ ] **Step 1:** Create `/Employee/layout.tsx` with protected route
- [ ] **Step 2:** Create `/Employee/dashboard/page.tsx`
- [ ] **Step 3:** Create `/Employee/profile/page.tsx`
- [ ] **Step 4:** Create `/Employee/attendance/page.tsx`
- [ ] **Step 5:** Create `/Employee/leave/page.tsx`
- [ ] **Step 6:** Create `/Employee/tasks/page.tsx`
- [ ] **Step 7:** Create `/Employee/projects/page.tsx`
- [ ] **Step 8:** Create `/Employee/worklog/page.tsx`
- [ ] **Step 9:** Update Sidebar component with Employee routes
- [ ] **Step 10:** Update login redirect logic to route to `/Employee/dashboard`

---

## Key Files to Update

1. **Backend:**
   - `backend/src/routes.ts` - Verify routes are registered
   - `backend/src/common/middlewares/role.middleware.ts` - Ensure role checking works
   - All module controller/routes files - Add employee-specific endpoints

2. **Frontend:**
   - `client/src/app/(protect)/Employee/layout.tsx` - Create new
   - `client/src/app/page.tsx` - Update redirect logic
   - `client/src/components/layout/Sidebar.tsx` - Add employee routes
   - Create all employee page components

---

## Testing the Implementation

### Backend Testing

```bash
# Test employee can view their own attendance
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/attendance/me

# Test employee can apply for leave
curl -X POST http://localhost:5000/api/leaves/apply \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2024-05-01","endDate":"2024-05-05","reason":"Personal"}'

# Test employee cannot access admin endpoint
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer {employee-token}"
# Should return 403 Forbidden
```

### Frontend Testing

1. Login as employee
2. Verify redirected to `/Employee/dashboard`
3. Check all navigation links work
4. Verify cannot access admin routes
5. Test attendance check-in/out functionality
6. Test leave application form

---

## Common Pitfalls to Avoid

1. **❌ No role checking:** Always add `roleMiddleware` to sensitive endpoints
2. **❌ Employee can edit others:** Filter by `userId` in service methods
3. **❌ Forgotten endpoints:** Add `/me` variant for all user-specific operations
4. **❌ No error handling:** Always return proper error responses with status codes
5. **❌ Frontend doesn't check role:** Always verify role before rendering employee pages
6. **❌ CORS issues:** Ensure backend CORS is configured for frontend domain

---

## Questions & Support

- Each backend module should follow the established pattern
- Use the Admin panel as reference for implementation
- Ensure consistency in error handling and response formats
- Test role-based access thoroughly before deployment
