"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/(protect)/Admin/components";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface LeaveRequest {
  _id: string;
  employee: { fullName: string; employeeId: string; email: string };
  leaveType: "sick" | "casual" | "earned" | "other";
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: { fullName: string };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterType) params.set("leaveType", filterType);
      const res = await fetch(`${API}/leaves?${params}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setLeaves(json.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filterStatus, filterType]);

  const action = async (id: string, act: "approve" | "reject") => {
    setProcessing(id);
    setError(null);
    try {
      const res = await fetch(`${API}/leaves/${id}/${act}`, { method: "PUT", headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setLeaves((prev) => prev.map((l) => l._id === id ? { ...l, status: act === "approve" ? "approved" : "rejected" } : l));
    } catch (e: any) { setError(e.message); }
    finally { setProcessing(null); }
  };

  const filtered = leaves.filter((l) => {
    const q = search.toLowerCase();
    return !q || l.employee?.fullName?.toLowerCase().includes(q) || l.employee?.employeeId?.toLowerCase().includes(q);
  });

  const counts = leaves.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Leave Management</h1>
        <p className="mb-6 text-sm text-slate-500">Approve or reject employee leave requests.</p>

        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`rounded-lg p-4 shadow-sm text-left transition ${filterStatus === s ? "ring-2 ring-indigo-500" : ""} bg-white`}>
              <div className="text-xs font-medium uppercase text-slate-400">{s}</div>
              <div className="mt-1 text-2xl font-bold text-slate-800">{counts[s] || 0}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
            <option value="">All Statuses</option>
            {["pending", "approved", "rejected"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
            <option value="">All Types</option>
            {["sick", "casual", "earned", "other"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee…"
            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">No leave requests found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Employee", "Type", "From", "To", "Days", "Reason", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-medium text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {filtered.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2">
                        <div className="font-medium text-slate-900">{l.employee?.fullName}</div>
                        <div className="text-xs text-slate-400">{l.employee?.employeeId}</div>
                      </td>
                      <td className="px-4 py-2 capitalize text-slate-700">{l.leaveType}</td>
                      <td className="px-4 py-2 text-slate-600">{new Date(l.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-slate-600">{new Date(l.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-center font-medium text-slate-800">{l.numberOfDays}</td>
                      <td className="max-w-xs px-4 py-2 truncate text-slate-500">{l.reason}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[l.status]}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {l.status === "pending" ? (
                          <div className="flex gap-2">
                            <button onClick={() => action(l._id, "approve")} disabled={processing === l._id}
                              className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50">
                              Approve
                            </button>
                            <button onClick={() => action(l._id, "reject")} disabled={processing === l._id}
                              className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50">
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {l.approvedBy ? `By ${l.approvedBy.fullName}` : "—"}
                          </span>
                        )}
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
