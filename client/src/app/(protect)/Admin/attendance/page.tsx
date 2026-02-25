"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/EmployeeComponents";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface AttendanceRecord {
  _id: string;
  employee: { fullName: string; email: string; employeeId: string };
  date: string;
  checkInTime?: string;
  status: "present" | "absent" | "on_leave" | "holiday";
}

const STATUS_COLORS: Record<string, string> = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  on_leave: "bg-yellow-100 text-yellow-700",
  holiday: "bg-indigo-100 text-indigo-700",
};

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Manual correction form
  const [showForm, setShowForm] = useState(false);
  const [corrForm, setCorrForm] = useState({ employee: "", date: "", status: "present", checkInTime: "" });
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month, year });
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`${API}/attendance?${params}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setRecords(json.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [month, year, filterStatus]);

  const handleCorrect = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/attendance`, { method: "POST", headers, body: JSON.stringify(corrForm) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setShowForm(false);
      setCorrForm({ employee: "", date: "", status: "present", checkInTime: "" });
      await load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.employee?.fullName?.toLowerCase().includes(q) ||
      r.employee?.employeeId?.toLowerCase().includes(q)
    );
  });

  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-64 w-full p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
            <p className="mt-1 text-sm text-slate-500">Monitor and manage employee attendance records.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Manual Correction
          </button>
        </div>

        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["present", "absent", "on_leave", "holiday"] as const).map((s) => (
            <div key={s} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-xs font-medium uppercase text-slate-400">{s.replace("_", " ")}</div>
              <div className="mt-1 text-2xl font-bold text-slate-800">{statusCounts[s] || 0}</div>
            </div>
          ))}
        </div>

        {/* Manual correction form */}
        {showForm && (
          <form onSubmit={handleCorrect} className="mb-6 rounded-lg bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Add / Correct Attendance Record</h3>
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Employee Mongo ID *</label>
                <input type="text" value={corrForm.employee} onChange={(e) => setCorrForm((p) => ({ ...p, employee: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" placeholder="MongoDB ObjectId" required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Date *</label>
                <input type="date" value={corrForm.date} onChange={(e) => setCorrForm((p) => ({ ...p, date: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Status *</label>
                <select value={corrForm.status} onChange={(e) => setCorrForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
                  {["present", "absent", "on_leave", "holiday"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Check-in Time</label>
                <input type="datetime-local" value={corrForm.checkInTime} onChange={(e) => setCorrForm((p) => ({ ...p, checkInTime: e.target.value }))}
                  className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="submit" disabled={saving} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <input type="month" value={`${year}-${month}`}
            onChange={(e) => { const [y, m] = e.target.value.split("-"); setYear(y); setMonth(m); }}
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
            <option value="">All Statuses</option>
            {["present", "absent", "on_leave", "holiday"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee…"
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">No records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Employee ID", "Name", "Date", "Check-in", "Status"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-medium text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {filtered.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-xs text-slate-500">{r.employee?.employeeId || "-"}</td>
                      <td className="px-4 py-2 font-medium text-slate-900">{r.employee?.fullName || "-"}</td>
                      <td className="px-4 py-2 text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-slate-600">
                        {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[r.status]}`}>
                          {r.status.replace("_", " ")}
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
