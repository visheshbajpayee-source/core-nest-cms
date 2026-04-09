"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/(protect)/Admin/components";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface WorkLog {
  _id: string;
  employee: { fullName: string; employeeId: string };
  date: string;
  taskTitle: string;
  taskDescription: string;
  project?: { name: string };
  hoursSpent: number;
  status: "in_progress" | "completed" | "blocked";
}

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  blocked: "bg-red-100 text-red-700",
};

export default function AdminWorklogsPage() {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { Authorization: `Bearer ${token}` };

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month, year });
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`${API}/worklogs?${params}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setLogs(json.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [month, year, filterStatus]);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return !q || l.employee?.fullName?.toLowerCase().includes(q) || l.taskTitle?.toLowerCase().includes(q);
  });

  const totalHours = filtered.reduce((sum, l) => sum + (l.hoursSpent || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Work Logs</h1>
        <p className="mb-6 text-sm text-slate-500">Review daily work logs from employees.</p>

        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="text-xs font-medium uppercase text-slate-400">Total Entries</div>
            <div className="mt-1 text-2xl font-bold text-slate-800">{filtered.length}</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="text-xs font-medium uppercase text-slate-400">Total Hours</div>
            <div className="mt-1 text-2xl font-bold text-slate-800">{totalHours.toFixed(1)}</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="text-xs font-medium uppercase text-slate-400">Blocked</div>
            <div className="mt-1 text-2xl font-bold text-red-600">{filtered.filter((l) => l.status === "blocked").length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <input type="month" value={`${year}-${month}`}
            onChange={(e) => { const [y, m] = e.target.value.split("-"); setYear(y); setMonth(m); }}
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
            <option value="">All Statuses</option>
            {["in_progress", "completed", "blocked"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee / task…"
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">No work logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Employee", "Date", "Task", "Project", "Hours", "Status"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-medium text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {filtered.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-900">{l.employee?.fullName || "-"}</td>
                      <td className="px-4 py-2 text-slate-600">{new Date(l.date).toLocaleDateString()}</td>
                      <td className="max-w-xs px-4 py-2">
                        <div className="font-medium text-slate-900">{l.taskTitle}</div>
                        <div className="truncate text-xs text-slate-400">{l.taskDescription}</div>
                      </td>
                      <td className="px-4 py-2 text-slate-600">{l.project?.name || "-"}</td>
                      <td className="px-4 py-2 text-slate-700">{l.hoursSpent}h</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[l.status]}`}>
                          {l.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
