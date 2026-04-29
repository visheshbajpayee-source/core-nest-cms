"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/(protect)/Admin/components";
import {
  getAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  type LeaveRequest,
} from "@/app/services/admin-leaves.service";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"pending" | "approved" | "rejected" | "">("");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadLeaves() {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      if (filterStatus) filters.status = filterStatus;
      const data = await getAllLeaveRequests(filters);
      setLeaves(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load leave requests");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, [filterStatus]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessing(id);
    setError(null);
    try {
      if (action === "approve") {
        await approveLeaveRequest(id);
      } else {
        await rejectLeaveRequest(id);
      }

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === id
            ? { ...l, status: action === "approve" ? "approved" : "rejected" }
            : l
        )
      );
    } catch (err: any) {
      setError(err?.message || `Failed to ${action} leave`);
    } finally {
      setProcessing(null);
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const q = search.toLowerCase();
    return (
      !q ||
      l.employee?.fullName?.toLowerCase().includes(q) ||
      l.employee?.employeeId?.toLowerCase().includes(q) ||
      l.employee?.email?.toLowerCase().includes(q)
    );
  });

  const counts = {
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">
          Leave Management
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Approve or reject employee leave requests.
        </p>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s === filterStatus ? "" : s)}
              className={`rounded-lg p-4 shadow-sm text-left transition ${
                filterStatus === s ? "ring-2 ring-indigo-500" : ""
              } bg-white hover:shadow-md`}
            >
              <div className="text-xs font-medium uppercase text-slate-400">
                {s}
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-800">
                {counts[s]}
              </div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name, ID, or email…"
            className="flex-1 rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          {filterStatus && (
            <button
              onClick={() => setFilterStatus("")}
              className="rounded border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400">
              Loading leave requests…
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">
              No leave requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Employee",
                      "Leave Type",
                      "From",
                      "To",
                      "Days",
                      "Reason",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-slate-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 bg-white">
                  {filteredLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td className="px-4 py-3">
                        {leave.employee?.fullName}
                      </td>

                      <td className="px-4 py-3">
                        {leave.leaveType?.name}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {leave.totalDays}
                      </td>

                      <td className="px-4 py-3">
                        {leave.reason}
                      </td>

                      <td className="px-4 py-3">
                        {leave.status}
                      </td>

                      <td className="px-4 py-3">
                        {leave.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleAction(leave._id, "approve")}>
                              Approve
                            </button>
                            <button onClick={() => handleAction(leave._id, "reject")}>
                              Reject
                            </button>
                          </div>
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