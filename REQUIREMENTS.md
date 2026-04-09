# Core Nest CMS - Requirements Document

## Overview

Core Nest CMS is a full-stack office management system designed to help organizations manage their employees, track daily activities, handle attendance, and streamline internal operations. The application follows a client-server architecture built on the MERN stack (MongoDB, Express.js, React/Next.js, Node.js) with TypeScript.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [User Roles](#user-roles)
4. [Module Requirements](#module-requirements)
   - [Authentication & Authorization](#1-authentication--authorization)
   - [Employee Management](#2-employee-management)
   - [Attendance Management](#3-attendance-management)
   - [Daily Work Logs](#4-daily-work-logs)
   - [Leave Management](#5-leave-management)
   - [Department & Designation Management](#6-department--designation-management)
   - [Project & Task Management](#7-project--task-management)
   - [Announcements & Notices](#8-announcements--notices)
   - [Reports & Analytics](#9-reports--analytics)
   - [Document Management](#10-document-management)
   - [Holiday Calendar](#11-holiday-calendar)
   - [Settings & Configuration](#12-settings--configuration)
5. [Frontend Requirements](#frontend-requirements)
6. [Backend Requirements](#backend-requirements)
7. [Database Schema Guidelines](#database-schema-guidelines)
8. [API Design Guidelines](#api-design-guidelines)
9. [TypeScript Quick Start Guide](#typescript-quick-start-guide)

---

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | Next.js (React), TypeScript     |
| Backend  | Express.js, Node.js, TypeScript |
| Database | MongoDB (with Mongoose ODM)     |
| Auth     | JWT (JSON Web Tokens)           |
| Styling  | Any CSS framework or custom CSS |

---

## Architecture Overview

```
┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────┐
│                     │  HTTP   │                     │  Query  │              │
│   Next.js Client    │ ◄─────► │   Express Backend   │ ◄─────► │   MongoDB    │
│   (Port 3000)       │  REST   │   (Port 5000)       │         │              │
│                     │   API   │                     │         │              │
└─────────────────────┘         └─────────────────────┘         └──────────────┘
```

- The **frontend** communicates with the **backend** exclusively through REST API calls.
- The **backend** handles all business logic, authentication, and database operations.
- Both teams must agree on API contracts (endpoints, request/response formats) before development begins.

---

## User Roles

The system supports three distinct roles with varying levels of access:

### Admin

- Full access to the entire system.
- Can manage all employees, departments, designations, and settings.
- Can view all reports and analytics.
- Can manage announcements, holidays, and system-wide configurations.
- Can approve/reject leave requests for all employees.

### Manager

- Can view and manage employees within their own department.
- Can approve/reject leave requests for employees in their department.
- Can create and assign projects/tasks to their department members.
- Can view reports for their department.
- Can post announcements visible to their department.

### Employee

- Can view and update their own profile.
- Can log daily work entries.
- Can view their own attendance records.
- Can apply for leave.
- Can view announcements, holidays, and their assigned tasks.

---

## Module Requirements

### 1. Authentication & Authorization

**Registration:**

- Admin can register new employees into the system.
- Required fields: Full Name, Email, Password, Department, Designation, Role.
- Email must be unique across the system.
- Password must meet minimum security requirements (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character).

**Login:**

- Users log in using their email and password.
- On successful login, a JWT token is issued.
- The first login of each day automatically records the attendance (marks the user as "present" for that day).
- Token should have a reasonable expiration time.

**Authorization:**

- All protected routes must verify the JWT token.
- Role-based access control must be enforced on both frontend and backend.
- Unauthorized access attempts must return appropriate error responses.

**Password Management:**

- Users can change their own password (requires current password).
- Admin can reset any employee's password.
- Forgot password flow via email (optional/stretch goal).

**Session:**

- On logout, the token should be invalidated on the client side.
- Consider implementing refresh tokens for better session management.

---

### 2. Employee Management

**Employee Profile:**

- Each employee has a profile with the following information:
  - Full Name
  - Email
  - Phone Number
  - Department
  - Designation
  - Date of Joining
  - Role (Admin / Manager / Employee)
  - Profile Picture (optional)
  - Employee ID (auto-generated or manually assigned)
  - Status (Active / Inactive)

**CRUD Operations:**

- **Admin** can create, read, update, and delete employee records.
- **Manager** can view employees within their department.
- **Employee** can view and edit only their own profile (limited fields: phone number, profile picture).

**Employee Directory:**

- A searchable and filterable list of all employees.
- Filter by department, designation, status, and role.
- Search by name, email, or employee ID.

---

### 3. Attendance Management

**Automatic Attendance:**

- The first login of each calendar day is recorded as the "check-in" time.
- The system must track the date and timestamp of each check-in.
- No manual attendance entry by employees (only admins can correct records).

**Attendance Records:**

- Each attendance record contains:
  - Employee ID
  - Date
  - Check-in Time (first login timestamp)
  - Status (Present / Absent / On Leave / Holiday)

**Attendance Views:**

- **Employee**: Can view their own attendance history (daily, weekly, monthly).
- **Manager**: Can view attendance for all employees in their department.
- **Admin**: Can view attendance for all employees across the organization.

**Attendance Corrections:**

- Admin can manually mark attendance or correct records (e.g., if an employee was working but forgot to log in).

**Monthly Summary:**

- Total days present, absent, on leave, and holidays for each employee per month.

---

### 4. Daily Work Logs

**Log Entry:**

- Each employee can create one or more work log entries per day.
- Each log entry contains:
  - Date
  - Task Title
  - Task Description
  - Project (optional, linked to a project if applicable)
  - Hours Spent
  - Status (In Progress / Completed / Blocked)

**Log Management:**

- Employees can add, edit, and delete their own logs for the current day.
- Past logs (previous days) are read-only for employees.
- Managers can view all logs from their department members.
- Admin can view all logs across the organization.

**Daily Summary:**

- A consolidated view of all work done by an employee on a given day.
- Total hours worked per day.

---

### 5. Leave Management

**Leave Types:**

- Sick Leave
- Casual Leave
- Earned/Privilege Leave
- Other (configurable by Admin)

**Leave Application:**

- Employee submits a leave request with:
  - Leave Type
  - Start Date
  - End Date
  - Reason
- System calculates the number of leave days automatically.
- Employee can view the status of their leave requests (Pending / Approved / Rejected).

**Leave Approval:**

- Manager can approve or reject leave requests from their department.
- Admin can approve or reject leave requests for any employee.
- On approval/rejection, the employee should see the updated status.

**Leave Balance:**

- Each employee has a configurable leave balance per leave type per year.
- The system deducts from the balance upon leave approval.
- Admin can configure the default leave allocation for each type.

---

### 6. Department & Designation Management

**Departments:**

- Admin can create, update, and delete departments.
- Each department has:
  - Department Name
  - Department Description
  - Department Head (linked to a Manager)

**Designations:**

- Admin can create, update, and delete designations.
- Each designation has:
  - Title (e.g., Software Engineer, HR Executive, Team Lead)
  - Description

**Assignments:**

- Admin can assign employees to departments and designations.
- An employee belongs to exactly one department and has one designation.

---

### 7. Project & Task Management

**Projects:**

- Admin or Manager can create projects.
- Each project has:
  - Project Name
  - Description
  - Start Date
  - Expected End Date
  - Status (Not Started / In Progress / Completed / On Hold)
  - Assigned Department
  - Team Members (list of employees)

**Tasks:**

- Tasks exist within a project.
- Each task has:
  - Task Title
  - Description
  - Assigned To (one or more employees)
  - Priority (Low / Medium / High / Critical)
  - Status (To Do / In Progress / In Review / Done)
  - Due Date
- Employees can update the status of tasks assigned to them.
- Tasks can be linked to daily work log entries.

---

### 8. Announcements & Notices

**Creating Announcements:**

- Admin can create organization-wide announcements.
- Manager can create department-specific announcements.
- Each announcement has:
  - Title
  - Content/Body
  - Target Audience (All / Specific Department)
  - Priority (Normal / Important / Urgent)
  - Published Date
  - Expiry Date (optional)

**Viewing Announcements:**

- All users see a notification or a section on their dashboard with relevant announcements.
- Announcements are sorted by date (most recent first).
- Expired announcements are automatically hidden from the active view but remain accessible in an archive.

---

### 9. Reports & Analytics

**Attendance Reports:**

- Monthly attendance report per employee.
- Department-wise attendance summary.
- Late check-in report (if a "standard check-in time" is configured).

**Work Log Reports:**

- Daily/weekly/monthly work log summaries per employee.
- Department-wise productivity summary (total hours logged).
- Project-wise time tracking report.

**Leave Reports:**

- Leave balance summary per employee.
- Department-wise leave utilization report.

**Access:**

- Admin can access all reports.
- Manager can access reports for their department.
- Employee can access only their own reports.

**Export:**

- Reports should be exportable in CSV format (stretch goal: PDF export).

---

### 10. Document Management

**Employee Documents:**

- Each employee can have documents attached to their profile (e.g., ID proof, offer letter, certifications).
- Admin can upload documents to any employee's profile.
- Employees can upload documents to their own profile.

**Document Fields:**

- Document Name
- Document Type (ID Proof / Offer Letter / Certificate / Other)
- File (uploaded file)
- Upload Date
- Uploaded By

**Access Control:**

- Employees can view only their own documents.
- Managers can view documents of employees in their department.
- Admin can view and manage all documents.

---

### 11. Holiday Calendar

**Holiday Management:**

- Admin can create and manage a list of holidays for the year.
- Each holiday has:
  - Holiday Name
  - Date
  - Description (optional)
  - Type (National Holiday / Regional Holiday / Company Holiday)

**Calendar View:**

- All users can view the holiday calendar.
- Holidays are automatically factored into attendance and leave calculations.

---

### 12. Settings & Configuration

**System Settings (Admin Only):**

- Organization Name and Logo
- Default Leave Allocations (per leave type per year)
- Standard Working Hours per day
- Standard Check-in Time (for late reports)
- Financial Year Start/End

**User Settings:**

- Change Password
- Update Profile Picture
- Notification Preferences (stretch goal)

---

## Frontend Requirements

### General

- Responsive design that works on desktop and tablet screens.
- Clean and intuitive user interface.
- Proper loading states for all API calls.
- Error handling with user-friendly error messages.
- Form validation on the client side before submitting to the API.

### Pages & Layouts

- **Login Page**: Email and password form.
- **Dashboard**: Role-specific overview with key metrics (attendance status, recent logs, pending leaves, announcements).
- **Employee Directory**: Searchable list with filters.
- **Employee Profile**: Detailed view/edit page.
- **Attendance Page**: Calendar or table view of attendance records.
- **Work Logs Page**: Form to add daily entries, list view of past entries.
- **Leave Management Page**: Apply for leave, view leave history and balance.
- **Projects Page**: List of projects, project detail view with tasks.
- **Announcements Page**: List of announcements.
- **Reports Page**: Various report views with date range filters.
- **Admin Panel**: Department management, designation management, holiday management, system settings.

### Navigation

- Sidebar or top navigation that adapts based on user role.
- Only show navigation items the user has access to.

### State Management

- Manage authentication state (logged-in user, token).
- Handle API response data efficiently.
- Maintain form states and validation.

---

## Backend Requirements

### General

- RESTful API design.
- Proper HTTP status codes for all responses.
- Input validation and sanitization on all endpoints.
- Centralized error handling middleware.
- Consistent response format across all endpoints.

### Authentication Middleware

- JWT verification middleware for all protected routes.
- Role-checking middleware to enforce access control.

### API Response Format

All API responses should follow a consistent structure:

**Success Response:**

```
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**

```
{
  "success": false,
  "error": "Error description",
  "message": "Something went wrong"
}
```

### File Uploads

- Handle file uploads for profile pictures and documents.
- Validate file types and sizes.
- Store files in a designated location (local storage or cloud storage).

### Environment Variables

- Database connection string, JWT secret, port number, and other sensitive configurations must be stored in environment variables.
- Never commit `.env` files to the repository.

### Logging

- Log important events (login attempts, errors, critical operations).

---

## Database Schema Guidelines

Below are the key collections (tables) the application will need. The exact field names and types are left to the implementation team.

| Collection    | Purpose                                      |
| ------------- | -------------------------------------------- |
| Users         | Employee accounts, credentials, profiles     |
| Departments   | Department information                       |
| Designations  | Job titles and descriptions                  |
| Attendance    | Daily attendance records                     |
| WorkLogs      | Daily task/work log entries                  |
| Leaves        | Leave requests and approvals                 |
| LeaveBalances | Per-employee leave balance per type per year |
| Projects      | Project details and team assignments         |
| Tasks         | Tasks within projects                        |
| Announcements | Notices and announcements                    |
| Documents     | Uploaded employee documents metadata         |
| Holidays      | Holiday calendar entries                     |
| Settings      | System-wide configuration key-value pairs    |

---

## API Design Guidelines

Organize API routes by module. Below is a suggested grouping:

| Module          | Base Route           |
| --------------- | -------------------- |
| Auth            | `/api/auth`          |
| Users/Employees | `/api/employees`     |
| Attendance      | `/api/attendance`    |
| Work Logs       | `/api/worklogs`      |
| Leaves          | `/api/leaves`        |
| Departments     | `/api/departments`   |
| Designations    | `/api/designations`  |
| Projects        | `/api/projects`      |
| Tasks           | `/api/tasks`         |
| Announcements   | `/api/announcements` |
| Documents       | `/api/documents`     |
| Holidays        | `/api/holidays`      |
| Reports         | `/api/reports`       |
| Settings        | `/api/settings`      |

Use standard HTTP methods:

- `GET` for retrieving data
- `POST` for creating new records
- `PUT` or `PATCH` for updating records
- `DELETE` for removing records

---

## TypeScript Quick Start Guide

TypeScript is a superset of JavaScript that adds static type checking. Every valid JavaScript code is also valid TypeScript. The key difference is that TypeScript lets you define types for your variables, function parameters, and return values, which helps catch errors during development rather than at runtime.

### Setting Up

TypeScript is already configured in this project. Both `client/` and `backend/` directories have a `tsconfig.json` file. TypeScript files use the `.ts` extension (or `.tsx` for React components).

### Basic Types

```typescript
// Primitive types
let username: string = "John";
let age: number = 25;
let isActive: boolean = true;

// Arrays
let scores: number[] = [90, 85, 78];
let names: string[] = ["Alice", "Bob"];

// Object type
let employee: { name: string; age: number; email: string } = {
  name: "John",
  age: 25,
  email: "john@example.com",
};
```

### Interfaces

Interfaces define the shape of an object. Use them to describe what properties an object should have.

```typescript
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  isActive: boolean;
}

// Now you can use this interface as a type
let emp: Employee = {
  id: "EMP001",
  name: "Jane",
  email: "jane@example.com",
  department: "Engineering",
  isActive: true,
};
```

### Optional Properties

Use `?` to mark a property as optional.

```typescript
interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string; // This property is optional
}
```

### Functions with Types

```typescript
// Function with typed parameters and return type
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function with types
const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

// Function that does not return anything
function logMessage(message: string): void {
  console.log(message);
}
```

### Type for API Responses

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

// Usage
let response: ApiResponse<Employee> = {
  success: true,
  data: { id: "1", name: "John", email: "john@example.com" },
  message: "Employee fetched successfully",
};
```

### Enums

Enums let you define a set of named constants.

```typescript
enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  EMPLOYEE = "employee",
}

enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

let userRole: Role = Role.ADMIN;
```

### Type Aliases

Use `type` to create custom type names.

```typescript
type ID = string;
type Status = "active" | "inactive"; // Union type - value can only be one of these

let userId: ID = "EMP001";
let status: Status = "active";
```

### Working with Express (Backend)

```typescript
import express, { Request, Response } from "express";

const app = express();

app.get("/api/employees", (req: Request, res: Response) => {
  // req and res are now typed, your editor will show autocomplete
  res.json({ success: true, data: [] });
});
```

### Working with React (Frontend)

```typescript
// Defining props for a component
interface EmployeeCardProps {
  name: string;
  email: string;
  department: string;
}

const EmployeeCard = ({ name, email, department }: EmployeeCardProps) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
      <p>{department}</p>
    </div>
  );
};
```

### Handling State in React

```typescript
import { useState } from "react";

interface Employee {
  id: string;
  name: string;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // TypeScript now knows employees is an array of Employee objects
  // and loading is a boolean
};
```

### Common Mistakes to Avoid

1. **Do not use `any` everywhere** - It defeats the purpose of TypeScript. Try to define proper types.
2. **Do not ignore TypeScript errors** - They exist to help you. Fix them rather than suppressing them.
3. **Start simple** - You do not need to type everything perfectly from day one. Start with basic types and improve as you learn.

### Helpful Tips

- Hover over variables in your code editor (VS Code) to see their inferred types.
- If TypeScript can figure out the type automatically, you do not need to write it explicitly:
  ```typescript
  let name = "John"; // TypeScript already knows this is a string
  ```
- Use your editor's autocomplete - TypeScript powers intelligent suggestions.
- When unsure about a type, check the library's documentation or type definitions.

---

## Development Workflow

### Branch Strategy

| Branch    | Purpose                                    |
| --------- | ------------------------------------------ |
| `main`    | Production-ready, stable code              |
| `testing` | QA and integration testing                 |
| `dev`     | Active development and feature integration |

### Collaboration Between Teams

1. Both frontend and backend teams should agree on the **API contracts** (endpoints, request body, response format) before starting development.
2. The backend team should provide API documentation (endpoint list with request/response examples) as they build each module.
3. The frontend team can use mock data to start building UI components while waiting for APIs.
4. Regular sync-ups between teams are recommended to ensure smooth integration.

### Code Quality

- Write clean, readable, and well-structured code.
- Follow consistent naming conventions throughout the project.
- Keep functions small and focused on a single responsibility.
- Test your code before pushing to the repository.

---

## Priority Order

The following is the recommended order of implementation, starting with the foundation and building upward:

| Priority | Module                              |
| -------- | ----------------------------------- |
| 1        | Authentication & Authorization      |
| 2        | Employee Management                 |
| 3        | Department & Designation Management |
| 4        | Attendance Management               |
| 5        | Daily Work Logs                     |
| 6        | Leave Management                    |
| 7        | Announcements & Notices             |
| 8        | Project & Task Management           |
| 9        | Holiday Calendar                    |
| 10       | Document Management                 |
| 11       | Reports & Analytics                 |
| 12       | Settings & Configuration            |
