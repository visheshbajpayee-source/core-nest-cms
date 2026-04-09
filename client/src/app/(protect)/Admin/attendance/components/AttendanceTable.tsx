import React from "react";
import type { AttendanceRecord } from "../types";

const STATUS_COLORS: Record<string, string> = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  on_leave: "bg-yellow-100 text-yellow-700",
  holiday: "bg-indigo-100 text-indigo-700",
};

export default function AttendanceTable({
  loading,
  records,
}: {
  loading: boolean;
  records: AttendanceRecord[];
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {loading ? (
        <div className="p-10 text-center text-sm text-slate-400">Loading…</div>
      ) : records.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">No records found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Employee ID", "Name", "Date", "Check-in", "Status"].map((header) => (
                  <th key={header} className="px-4 py-2 text-left font-medium text-slate-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {records.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-xs text-slate-500">{record.employee?.employeeId || "-"}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{record.employee?.fullName || "-"}</td>
                  <td className="px-4 py-2 text-slate-600">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {record.checkInTime
                      ? new Date(record.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[record.status]}`}
                    >
                      {record.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
