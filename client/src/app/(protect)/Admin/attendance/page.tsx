"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "@/app/(protect)/Admin/components";
import type { AttendanceCorrectionPayload, AttendanceRecord } from "./types";
import { createAttendanceCorrection, getAttendanceRecords } from "./service";
import {
  AttendanceFilters,
  AttendanceSummaryCards,
  AttendanceTable,
  ManualCorrectionForm,
} from "./components";

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Manual correction form
  const [showForm, setShowForm] = useState(false);
  const [corrForm, setCorrForm] = useState<AttendanceCorrectionPayload>({
    employee: "",
    date: "",
    status: "present",
    checkInTime: "",
  });
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendanceRecords({ month, year, status: filterStatus || undefined });
      setRecords(data);
    } catch (e: any) {
      setError(e.message);
    }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [month, year, filterStatus]);

  const handleCorrect = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAttendanceCorrection(corrForm);
      setShowForm(false);
      setCorrForm({ employee: "", date: "", status: "present", checkInTime: "" });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
    finally { setSaving(false); }
  };

  const filtered = useMemo(() => {
    const selectedMonth = Number(month);
    const selectedYear = Number(year);
    const q = search.trim().toLowerCase();

    return records.filter((record) => {
      const date = new Date(record.date);
      const sameMonth = date.getMonth() + 1 === selectedMonth;
      const sameYear = date.getFullYear() === selectedYear;
      const matchStatus = !filterStatus || record.status === filterStatus;
      const matchSearch =
        !q ||
        record.employee?.fullName?.toLowerCase().includes(q) ||
        record.employee?.employeeId?.toLowerCase().includes(q);

      return sameMonth && sameYear && matchStatus && matchSearch;
    });
  }, [records, month, year, filterStatus, search]);

  const statusCounts = filtered.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
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

        <AttendanceSummaryCards statusCounts={statusCounts} />

        {showForm && (
          <ManualCorrectionForm
            form={corrForm}
            saving={saving}
            onChange={setCorrForm}
            onSubmit={handleCorrect}
            onCancel={() => setShowForm(false)}
          />
        )}

        <AttendanceFilters
          month={month}
          year={year}
          filterStatus={filterStatus}
          search={search}
          onMonthYearChange={(nextYear, nextMonth) => {
            setYear(nextYear);
            setMonth(nextMonth);
          }}
          onFilterStatusChange={setFilterStatus}
          onSearchChange={setSearch}
        />

        <AttendanceTable loading={loading} records={filtered} />
      </main>
    </div>
  );
}
