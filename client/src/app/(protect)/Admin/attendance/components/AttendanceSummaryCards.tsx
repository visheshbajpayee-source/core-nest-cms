import React from "react";
import type { AttendanceStatus } from "../types";

export default function AttendanceSummaryCards({
  statusCounts,
}: {
  statusCounts: Record<string, number>;
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {(["present", "absent", "on_leave", "holiday"] as AttendanceStatus[]).map((status) => (
        <div key={status} className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-xs font-medium uppercase text-slate-400">{status.replace("_", " ")}</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">{statusCounts[status] || 0}</div>
        </div>
      ))}
    </div>
  );
}
