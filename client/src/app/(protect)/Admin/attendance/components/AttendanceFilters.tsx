import React from "react";

export default function AttendanceFilters({
  month,
  year,
  filterStatus,
  search,
  onMonthYearChange,
  onFilterStatusChange,
  onSearchChange,
}: {
  month: string;
  year: string;
  filterStatus: string;
  search: string;
  onMonthYearChange: (year: string, month: string) => void;
  onFilterStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <input
        type="month"
        value={`${year}-${month}`}
        onChange={(e) => {
          const [nextYear, nextMonth] = e.target.value.split("-");
          onMonthYearChange(nextYear, nextMonth);
        }}
        className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
      />
      <select
        value={filterStatus}
        onChange={(e) => onFilterStatusChange(e.target.value)}
        className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
      >
        <option value="">All Statuses</option>
        {["present", "absent", "on_leave", "holiday"].map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search employee…"
        className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
      />
    </div>
  );
}
