# Employee Feature - Quick Reference Guide

## 🏗️ Project Architecture Overview

```
FRONTEND (Next.js)                       BACKEND (Express.js)
┌─────────────────────────────┐         ┌──────────────────────────┐
│                             │         │                          │
│  /Admin/[feature]/page.tsx  │  ───┬──→│  POST /admin/[feature]   │
│  (Role: admin, manager)     │     │   │  DELETE /[feature]/:id   │
│                             │     │   │                          │
│  /Employee/[feature]/...    │  ───┤──→│  GET /[feature]/me       │
│  (Role: employee, manager)  │     │   │  GET /[feature]          │
│                             │     │   │  PUT /[feature]/me       │
│                             │     │   │                          │
│  Service Layer (API calls)  │     │   │  Service Layer (Logic)   │
│  ├── getMyData()            │     │   │  └── filterByUserId()    │
│  └── getAdminData()         │     │   │  └── checkRole()         │
│                             │     │   │                          │
└─────────────────────────────┘     │   │  Middleware              │
                                    │   │  ├── authMiddleware      │
                                    │   │  └── roleMiddleware      │
                                    │   │                          │
                                    └──→│  Models & Database       │
                                        │  └── MongoDB + Mongoose  │
                                        │                          │
                                        └──────────────────────────┘
```

---

## 📊 Request Flow Example: Employee Applies for Leave

```
FRONTEND                          BACKEND                        DATABASE
┌──────────────────┐             ┌──────────────────┐          ┌─────────────┐
│                  │             │                  │          │             │
│  Leave Form      │             │                  │          │  MongoDB    │
│  ├─ startDate    │             │                  │          │             │
│  ├─ endDate      │  POST /api/ │ leave.routes.ts  │          │  Leaves     │
│  ├─ reason       ├────leave/───→ ├─ authMiddleware │  CREATE  │ Collection  │
│  └─ [Submit]     │   apply     │ ├─ validateInput  ├─────────→ └─────────────┘
│                  │             │ └─ leave.service │
│                  │             │    ├─ Save leave │          ┌─────────────┐
│                  │             │    ├─ Update     │  UPDATE  │ LeaveBalance│
│                  │             │    │  balance    ├─────────→ └─────────────┘
│                  │             │    └─ Return     │
│                  │  ← 200 OK ──┤    leave data    │
│  Show Success    │  {data}     │                  │          
│  Message         │             │                  │          
└──────────────────┘             └──────────────────┘          
```

---

## 🔑 Key Concepts

### 1. Role-Based Access Control (RBAC)

**Three Roles in System:**
- `admin` - Full access to everything
- `manager` - Access to department data
- `employee` - Access to only their own data

**Middleware Application:**

```typescript
// Public route
router.post("/login", login);

// All authenticated users
router.get("/employees/me", authMiddleware, getMyProfile);

// Admin only
router.get("/employees", authMiddleware, roleMiddleware(["admin"]), getAllEmployees);

// Admin or Manager (for their own department)
router.get("/reports", authMiddleware, roleMiddleware(["admin", "manager"]), getReports);
```

### 2. Data Filtering Pattern

**Key Rule:** Always filter data by `userId` for employee endpoints

**Bad ❌:**
```typescript
export const getAttendance = async (req) => {
  // ❌ Returns ALL attendance for anyone
  return await Attendance.find();
};
```

**Good ✅:**
```typescript
export const getMyAttendance = async (userId: string) => {
  // ✅ Returns ONLY this employee's attendance
  return await Attendance.find({ employeeId: userId });
};
```

### 3. Endpoint Naming Convention

```
User Action                Backend Endpoint              Role
─────────────────────────  ──────────────────────────  ─────────────────
View my data               GET /resource/me            All authenticated
Create my data             POST /resource              Employee (with auth)
View all data              GET /resource               Admin/Manager only
Create data for others     POST /resource              Admin/Manager only
Update my data             PUT /resource/me            Employee
Update others' data        PUT /resource/:id           Admin/Manager only
Delete                     DELETE /resource/:id        Admin only
```

---

## 🚀 Quick Code Templates

### Backend: Employee-Specific Service Method

```typescript
// Pattern for employee viewing their own data
export const getMyData = async (userId: string, filters?: any) => {
  // Step 1: Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Step 2: Build query with userId filter
  const query: any = { employeeId: userId };
  
  // Step 3: Add optional filters
  if (filters?.startDate) {
    query.date = { $gte: new Date(filters.startDate) };
  }

  // Step 4: Execute query with population
  const data = await Collection.find(query)
    .populate("departmentId", "name")
    .sort({ createdAt: -1 });

  return data;
};
```

### Backend: Admin View All Data

```typescript
// Pattern for admin viewing all data
export const getAllData = async (filters?: any) => {
  const query: any = {};

  // Step 1: Add optional filters (department, status, etc)
  if (filters?.departmentId) {
    query.departmentId = filters.departmentId;
  }
  if (filters?.status) {
    query.status = filters.status;
  }

  // Step 2: Execute query with pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  const data = await Collection.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Collection.countDocuments(query);

  return {
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};
```

### Frontend: Protected Employee Page Template

```typescript
// Pattern for all employee pages
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeFeaturePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 1: Check authentication and role
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      router.push("/login");
      return;
    }

    // Redirect admin to their dashboard
    if (user.role === "admin") {
      router.push("/Admin/dashboard");
      return;
    }

    // Step 2: Fetch data
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resource/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const json = await response.json();
      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Render based on state
  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Feature Title</h1>
      {/* Your content here */}
    </div>
  );
}
```

### Frontend: Service File Template

```typescript
// client/src/app/(protect)/Employee/[feature]/service.ts

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Add auth token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getMyData = async (filters?: any) => {
  const response = await API.get("/resource/me", { params: filters });
  return response.data.data;
};

export const createData = async (payload: any) => {
  const response = await API.post("/resource", payload);
  return response.data.data;
};

export const updateData = async (id: string, payload: any) => {
  const response = await API.put(`/resource/${id}`, payload);
  return response.data.data;
};
```

---

## 📋 Implementation Checklist

### Backend Routes to Add/Update

#### Employees Module
```typescript
GET    /employees/me          ← Employee views own profile
PUT    /employees/me          ← Employee updates own profile
GET    /employees             ← Admin views all (already exists)
POST   /employees             ← Admin creates (already exists)
```

#### Attendance Module
```typescript
GET    /attendance/me         ← Employee views own attendance ⭐ NEW
POST   /attendance/checkin    ← Employee checks in ⭐ NEW
POST   /attendance/checkout   ← Employee checks out ⭐ NEW
GET    /attendance            ← Admin views all (already exists)
PATCH  /attendance/:id        ← Admin updates (already exists)
```

#### Leaves Module
```typescript
GET    /leaves/me             ← Employee views own leaves ⭐ NEW
POST   /leaves/apply          ← Employee applies for leave ⭐ NEW
GET    /leaves                ← Admin views all (already exists)
PATCH  /leaves/:id            ← Admin approves/rejects (already exists)
```

#### Tasks Module
```typescript
GET    /tasks/me              ← Employee views assigned tasks ⭐ NEW
GET    /tasks/assigned-to-me  ← Alternative naming
GET    /tasks                 ← Admin views all (already exists)
```

#### Worklogs Module
```typescript
GET    /worklogs/me           ← Employee views own worklogs ⭐ NEW
POST   /worklogs              ← Employee creates worklog ⭐ NEW
GET    /worklogs              ← Admin views all (already exists)
```

#### Projects Module
```typescript
GET    /projects/assigned-to-me  ← Employee views assigned ⭐ NEW
GET    /projects                ← Admin views all (already exists)
```

### Frontend Pages to Create

```
client/src/app/(protect)/Employee/
├── layout.tsx                    ⭐ NEW - Protected layout
├── dashboard/page.tsx            ⭐ NEW
├── dashboard/components/         ⭐ NEW
├── profile/page.tsx              ⭐ NEW
├── profile/components/           ⭐ NEW
├── attendance/page.tsx           ⭐ NEW
├── attendance/components/        ⭐ NEW
├── leave/page.tsx                ⭐ NEW
├── leave/components/             ⭐ NEW
├── tasks/page.tsx                ⭐ NEW
├── tasks/components/             ⭐ NEW
├── worklog/page.tsx              ⭐ NEW
├── worklog/components/           ⭐ NEW
├── projects/page.tsx             ⭐ NEW
└── projects/components/          ⭐ NEW
```

---

## 🔗 API Response Format (Consistent Across All Endpoints)

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data fetched successfully",
  "data": { /* actual data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "data": null
}
```

**Pagination Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data fetched",
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

## 🧪 Testing Commands

### Test Employee Access (Should Succeed)

```bash
# Get employee's own data
curl -H "Authorization: Bearer {employee_token}" \
  http://localhost:5000/api/employees/me

# Apply for leave
curl -X POST http://localhost:5000/api/leaves/apply \
  -H "Authorization: Bearer {employee_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-06-01",
    "endDate": "2024-06-05",
    "leaveType": "sick",
    "reason": "Medical appointment"
  }'
```

### Test Employee Access Restriction (Should Fail with 403)

```bash
# Try to view all employees
curl -H "Authorization: Bearer {employee_token}" \
  http://localhost:5000/api/employees

# Try to delete another employee
curl -X DELETE http://localhost:5000/api/employees/other-employee-id \
  -H "Authorization: Bearer {employee_token}"
```

### Test Unauthenticated Access (Should Fail with 401)

```bash
# No token provided
curl http://localhost:5000/api/employees/me
```

---

## 📚 Reference Files in Your Project

- **Admin Layout Pattern:** `client/src/app/(protect)/Admin/layout.tsx`
- **Existing Modules:** `backend/src/modules/attendance/`
- **Middleware Examples:** `backend/src/common/middlewares/`
- **API Response Utils:** `backend/src/common/utils/ApiResponse.ts`
- **Error Handling:** `backend/src/common/utils/ApiError.ts`

---

## 💡 Tips & Best Practices

1. **Copy existing admin routes as template** - They already follow best practices
2. **Always validate role before operation** - Use middleware consistently
3. **Create `/me` endpoints first** - These are core to employee features
4. **Test with both admin and employee accounts** - Verify role-based restrictions
5. **Use Postman/Thunder Client** - Test backend before building frontend
6. **Reuse existing components** - Don't reinvent tables, forms, etc.
7. **Keep services pure** - No API calls in components, use service layer
8. **Handle loading/error states** - Users need feedback on what's happening
