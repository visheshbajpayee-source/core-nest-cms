# CMS Client Overview

This document explains the client-side structure of the `core-nest-cms` app inside the `client/` folder. It covers how pages and routes are organized, how the service layer manages API calls, and how authentication is handled.

## 1. Purpose

The `client` folder contains a Next.js frontend for the CMS. It is built with:
- `next` for routing and server rendering
- `react` for UI
- `axios` for HTTP requests
- `tailwindcss` for styling
- `typescript` for typing and developer safety

## 2. Key configuration files

- `package.json` - dependency and script definitions
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS setup
- `next-env.d.ts` - Next.js environment type declarations

## 3. Main application structure

### `src/app/`
This is the main App Router structure for Next.js.

- `layout.tsx`
  - Root layout for the app.
  - Provides the `<html>` and `<body>` wrapper and includes global CSS.

- `page.tsx`
  - The root route `/`.
  - Currently redirects immediately to `/login`.

### `src/app/(auth)/login/`
Contains the login UI and service logic.

- `page.tsx`
  - Renders the login form.
  - Submits credentials and redirects users after successful login.

- `service/login.service.ts`
  - Calls the backend login endpoint.
  - Stores `accessToken` in `localStorage`.
  - Fetches the current user profile from `/employees/me`.
  - Stores profile information and exports the user `role`.

### `src/app/(protect)/`
Protected application routes that require authentication.

- `layout.tsx`
  - Wraps protected routes.
  - Checks authentication state using `localStorage`.
  - Redirects unauthenticated users to `/login`.

### `src/app/(protect)/Admin/`
Admin-facing pages such as:
- `announcements`
- `attendance`
- `dashboard`
- `departments`
- `designations`
- `documents`
- `EmployeeDirectory`
- `holidays`
- `leaves`
- `projects`
- `reports`
- `settings`
- `worklogs`

Each feature typically has a `page.tsx` and may include its own components, services, or types.

### `src/app/(protect)/employee1/`
Employee-facing pages such as:
- `announcement`
- `attendance`
- `dashboard`
- `leave`
- `profile`
- `projects`
- `reports`
- `worklog`

This is the section for the employee dashboard experience.

### `src/app/employee/`
Additional employee-related pages, including:
- `attendance`
- `leave`

These may be alternate or supplemental employee views.

## 4. UI and shared components

### `src/EmployeeComponents/`
Contains reusable UI components for the employee interface.
Examples:
- `Announcements.tsx`
- `AttendanceCircle.tsx`
- `DashboardContent.tsx`
- `Sidebar.tsx`
- `NoticeBoard.tsx`
- Nested attendance and leave components

### `src/LeaveComponent/`
Contains leave-related UI components and forms.

### `src/ReusableComponents/`
Contains small generic components shared across the app, such as `AttendanceCircle.tsx`.

### `src/components/layout/`
Contains layout helpers like `ProtectedLayout.tsx`.
- `ProtectedLayout.tsx` renders the authenticated sidebar and main content area.

## 5. API management

### `src/app/lib/api.ts`
This is the main shared API client for the app.

- Creates an Axios instance.
- Uses `baseURL: http://localhost:5000`.
- Sets default `Content-Type: application/json`.
- Enables `withCredentials: true`.
- Adds an Axios request interceptor to attach `Authorization: Bearer <token>` from `localStorage`.

This file is the central place where HTTP requests are configured.

### Feature-specific services

This app also contains service files under `src/app/services/` for specific domains.

Examples:
- `src/app/services/auth.service.ts`
- `src/app/services/attendence/attendence.ts`
- `src/app/services/employeeLeaves/leaves.ts`

These files typically:
- Define API payload and response types.
- Build request URLs.
- Call backend endpoints.
- Return structured data to UI components.

### `src/app/services/attendence/attendence.ts`
This attendance service:
- Defines `AttendanceRecord` and `AttendanceHistoryResponse` types.
- Creates its own Axios instance using `NEXT_PUBLIC_API_URL` or `http://localhost:5000/api`.
- Adds a request interceptor to attach `Authorization` if `authToken` exists in `localStorage`.
- Currently returns dummy data instead of a live backend response.

> Note: There is a mismatch between `accessToken` and `authToken` storage keys in the client. The login service stores the token as `accessToken`, while the attendance service reads `authToken`. This will prevent the attendance API from getting the token unless the key names are aligned.

## 6. Authentication flow

- User visits `/login`.
- Login page calls `loginAndStoreProfile` in `service/login.service.ts`.
- The service sends a `POST` request to `${API}/login`.
- On success, it stores `accessToken` in `localStorage`.
- It then fetches `/employees/me` using the token and stores full profile data.
- Login page redirects based on role:
  - `employee` → `/employee1/dashboard`
  - `admin` → `/Admin/dashboard`

Protected pages use `ProtectedLayout.tsx` to verify the token exists and enforce login.

## 7. Routing and role-based layout

- Next.js App Router uses folder names to define routes.
- `/(auth)` is the public auth zone.
- `/(protect)` is a protected zone for logged-in users.
- Role-specific subfolders like `Admin` and `employee1` keep admin and employee pages separated.

## 8. How to run the client

From the `client/` folder:

```bash
pnpm install
pnpm dev
```

Then open the app in the browser, usually at `http://localhost:3000`.

## 9. Improvements to consider

- Unify auth token storage key (`accessToken` vs `authToken`).
- Centralize service API client usage to avoid duplicate Axios instances.
- Move all feature services under a single `src/app/services/` pattern.
- Use `NEXT_PUBLIC_API_URL` consistently in `src/app/lib/api.ts`.
- Replace dummy attendance data with real backend endpoint calls.
