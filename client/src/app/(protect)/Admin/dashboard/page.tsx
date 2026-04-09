"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/app/(protect)/Admin/components";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type Employee = { status?: "active" | "inactive" | string };
type Leave = { status?: "pending" | "approved" | "rejected" | string; employee?: { fullName?: string }; leaveType?: string; startDate?: string; };
type Announcement = { title?: string; priority?: string; createdAt?: string; };
type Project = { status?: "not_started" | "in_progress" | "completed" | "on_hold" | string };
type Attendance = { status?: "present" | "absent" | "on_leave" | "holiday" | string };

type ApiPayload<T> = { success?: boolean; data?: T; message?: string };

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function AdminDashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<Leave[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());

    Promise.allSettled([
      fetch(`${API}/employees`, { headers }),
      fetch(`${API}/leaves?status=pending`, { headers }),
      fetch(`${API}/announcements`, { headers }),
      fetch(`${API}/projects`, { headers }),
      fetch(`${API}/attendance?month=${month}&year=${year}`, { headers }),
    ]).then(async (results) => {
      const parse = async <T,>(index: number) => {
        const result = results[index];
        if (result.status !== "fulfilled") return null;
        const res = result.value;
        if (!res.ok) return null;
        const json = (await res.json()) as ApiPayload<T>;
        return json?.data ?? null;
      };

      const employeeData = await parse<Employee[]>(0);
      const leaveData = await parse<Leave[]>(1);
      const announcementData = await parse<Announcement[]>(2);
      const projectData = await parse<Project[]>(3);
      const attendanceData = await parse<Attendance[]>(4);

      setEmployees(asArray<Employee>(employeeData));
      setPendingLeaves(asArray<Leave>(leaveData));
      setAnnouncements(asArray<Announcement>(announcementData));
      setProjects(asArray<Project>(projectData));
      setAttendance(asArray<Attendance>(attendanceData));
      setLoading(false);
    }).catch((e: unknown) => {
      setError(e instanceof Error ? e.message : "Failed to load dashboard data.");
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const activeEmployees = employees.filter((e) => e.status === "active").length;
    const todayPresent = attendance.filter((r) => r.status === "present").length;
    const activeProjects = projects.filter((p) => p.status === "in_progress").length;

    return [
      { label: "Total Employees", value: employees.length, sub: `${activeEmployees} active` },
      { label: "Pending Leaves", value: pendingLeaves.length, sub: "Require approval" },
      { label: "Active Projects", value: activeProjects, sub: `${projects.length} total projects` },
      { label: "Today Present", value: todayPresent, sub: `${attendance.length} attendance records` },
    ];
  }, [employees, pendingLeaves, projects, attendance]);

  const latestLeaves = pendingLeaves.slice(0, 5);
  const latestAnnouncements = announcements.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Role-specific overview of organization activity and pending actions.
          </p>
        </header>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-xs font-medium uppercase text-slate-400">{item.label}</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{loading ? "—" : item.value}</div>
              <div className="mt-1 text-xs text-slate-500">{item.sub}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-800">Pending Leave Requests</h2>
              <Link href="/Admin/leaves" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                View all
              </Link>
            </div>
            {loading ? (
              <div className="p-6 text-sm text-slate-400">Loading…</div>
            ) : latestLeaves.length === 0 ? (
              <div className="p-6 text-sm text-slate-400">No pending leave requests.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {latestLeaves.map((leave, idx) => (
                  <li key={`${leave.employee?.fullName ?? "employee"}-${idx}`} className="px-5 py-3">
                    <div className="text-sm font-medium text-slate-800">{leave.employee?.fullName ?? "Unknown Employee"}</div>
                    <div className="text-xs text-slate-500">
                      {(leave.leaveType ?? "leave").toString().replace("_", " ")} · {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "No date"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-800">Recent Announcements</h2>
              <Link href="/Admin/announcements" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Manage
              </Link>
            </div>
            {loading ? (
              <div className="p-6 text-sm text-slate-400">Loading…</div>
            ) : latestAnnouncements.length === 0 ? (
              <div className="p-6 text-sm text-slate-400">No announcements available.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {latestAnnouncements.map((item, idx) => (
                  <li key={`${item.title ?? "announcement"}-${idx}`} className="px-5 py-3">
                    <div className="text-sm font-medium text-slate-800">{item.title ?? "Untitled announcement"}</div>
                    <div className="text-xs uppercase text-slate-500">
                      {(item.priority ?? "normal").toString()} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "No date"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Quick Access</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Employee Directory", href: "/Admin/EmployeeDirectory" },
              { label: "Attendance", href: "/Admin/attendance" },
              { label: "Projects", href: "/Admin/projects" },
              { label: "Reports", href: "/Admin/reports" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
