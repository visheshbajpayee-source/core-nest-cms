"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/app/EmployeeComponents";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type ReportType = "attendance" | "worklogs" | "leaves";

interface AttendanceRow { employee: { fullName: string; employeeId: string }; date: string; status: string; checkInTime?: string; }
interface WorklogRow { employee: { fullName: string; employeeId: string }; date: string; taskTitle: string; hoursSpent: number; status: string; }
interface LeaveRow { employee: { fullName: string; employeeId: string }; leaveType: string; startDate: string; endDate: string; numberOfDays: number; status: string; }

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("attendance");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { Authorization: `Bearer ${token}` };

  const generate = async () => {
    setLoading(true); setError(null); setGenerated(false);
    try {
      const params = new URLSearchParams({ month, year });
      const endpoint = reportType === "attendance" ? "attendance" : reportType === "worklogs" ? "worklogs" : "leaves";
      const res = await fetch(`${API}/${endpoint}?${params}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setData(json.data || []);
      setGenerated(true);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const exportCSV = () => {
    if (!data.length) return;
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === "attendance") {
      headers = ["Employee ID", "Name", "Date", "Check-in", "Status"];
      rows = (data as AttendanceRow[]).map((r) => [
        r.employee?.employeeId || "",
        r.employee?.fullName || "",
        new Date(r.date).toLocaleDateString(),
        r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "",
        r.status,
      ]);
    } else if (reportType === "worklogs") {
      headers = ["Employee ID", "Name", "Date", "Task", "Hours", "Status"];
      rows = (data as WorklogRow[]).map((r) => [
        r.employee?.employeeId || "",
        r.employee?.fullName || "",
        new Date(r.date).toLocaleDateString(),
        r.taskTitle,
        String(r.hoursSpent),
        r.status,
      ]);
    } else {
      headers = ["Employee ID", "Name", "Type", "From", "To", "Days", "Status"];
      rows = (data as LeaveRow[]).map((r) => [
        r.employee?.employeeId || "",
        r.employee?.fullName || "",
        r.leaveType,
        new Date(r.startDate).toLocaleDateString(),
        new Date(r.endDate).toLocaleDateString(),
        String(r.numberOfDays),
        r.status,
      ]);
    }

    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${year}_${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderTable = () => {
    if (reportType === "attendance") {
      return (
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50"><tr>
            {["Emp ID", "Name", "Date", "Check-in", "Status"].map((h) => <th key={h} className="px-4 py-2 text-left font-medium text-slate-600">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {(data as AttendanceRow[]).map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-xs text-slate-500">{r.employee?.employeeId}</td>
                <td className="px-4 py-2 font-medium text-slate-900">{r.employee?.fullName}</td>
                <td className="px-4 py-2 text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-slate-600">{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                <td className="px-4 py-2"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize">{r.status.replace("_", " ")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (reportType === "worklogs") {
      const totalHours = (data as WorklogRow[]).reduce((s, r) => s + (r.hoursSpent || 0), 0);
      return (
        <>
          <div className="mb-3 rounded-md bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            Total hours logged: {totalHours.toFixed(1)}h across {data.length} entries
          </div>
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50"><tr>
              {["Emp ID", "Name", "Date", "Task", "Hours", "Status"].map((h) => <th key={h} className="px-4 py-2 text-left font-medium text-slate-600">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {(data as WorklogRow[]).map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-xs text-slate-500">{r.employee?.employeeId}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{r.employee?.fullName}</td>
                  <td className="px-4 py-2 text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-slate-700">{r.taskTitle}</td>
                  <td className="px-4 py-2 font-medium text-slate-800">{r.hoursSpent}h</td>
                  <td className="px-4 py-2 capitalize text-slate-500">{r.status.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }
    // leaves
    return (
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50"><tr>
          {["Emp ID", "Name", "Type", "From", "To", "Days", "Status"].map((h) => <th key={h} className="px-4 py-2 text-left font-medium text-slate-600">{h}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {(data as LeaveRow[]).map((r, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="px-4 py-2 text-xs text-slate-500">{r.employee?.employeeId}</td>
              <td className="px-4 py-2 font-medium text-slate-900">{r.employee?.fullName}</td>
              <td className="px-4 py-2 capitalize text-slate-700">{r.leaveType}</td>
              <td className="px-4 py-2 text-slate-600">{new Date(r.startDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-slate-600">{new Date(r.endDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-center font-medium text-slate-800">{r.numberOfDays}</td>
              <td className="px-4 py-2 capitalize text-slate-500">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-64 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
        <p className="mb-6 text-sm text-slate-500">Generate attendance, work log and leave reports.</p>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value as ReportType)}
              className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
              <option value="attendance">Attendance</option>
              <option value="worklogs">Work Logs</option>
              <option value="leaves">Leaves</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Month & Year</label>
            <input type="month" value={`${year}-${month}`}
              onChange={(e) => { const [y, m] = e.target.value.split("-"); setYear(y); setMonth(m); }}
              className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <button onClick={generate} disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Generating…" : "Generate Report"}
          </button>
          {generated && data.length > 0 && (
            <button onClick={exportCSV}
              className="rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
              Export CSV
            </button>
          )}
        </div>

        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {/* Results */}
        {generated && (
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 capitalize">
                {reportType} Report — {new Date(Number(year), Number(month) - 1).toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
              <span className="text-xs text-slate-400">{data.length} records</span>
            </div>
            {data.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">No data for this period.</div>
            ) : (
              <div className="overflow-x-auto p-4">{renderTable()}</div>
            )}
          </div>
        )}

        {!generated && !loading && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 p-12 text-center text-sm text-slate-400">
            Select a report type and month, then click "Generate Report".
          </div>
        )}
      </main>
    </div>
  );
}
