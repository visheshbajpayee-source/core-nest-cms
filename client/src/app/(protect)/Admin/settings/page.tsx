"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/app/EmployeeComponents";

const LEAVE_TYPES = [
  { key: "annual", label: "Annual Leave" },
  { key: "sick", label: "Sick Leave" },
  { key: "casual", label: "Casual Leave" },
  { key: "maternity", label: "Maternity Leave" },
  { key: "paternity", label: "Paternity Leave" },
  { key: "unpaid", label: "Unpaid Leave" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-800">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [orgName, setOrgName] = useState("Core Nest");
  const [orgEmail, setOrgEmail] = useState("");
  const [workingHours, setWorkingHours] = useState("8");
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("17:00");
  const [leaveAllocations, setLeaveAllocations] = useState<Record<string, string>>(
    Object.fromEntries(LEAVE_TYPES.map((t) => [t.key, "12"]))
  );
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  };

  const inputClass =
    "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-64 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mb-6 text-sm text-slate-500">Configure organisation-wide defaults.</p>

        {saved && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            ✓ {saved} settings saved.
          </div>
        )}

        {/* Organisation Details */}
        <SectionCard title="Organisation Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organisation Name">
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Organisation Email">
              <input type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)}
                placeholder="hr@company.com" className={inputClass} />
            </Field>
          </div>
          <button onClick={() => handleSave("Organisation")}
            className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Organisation
          </button>
        </SectionCard>

        {/* Work Schedule */}
        <SectionCard title="Work Schedule">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Standard Working Hours / Day">
              <input type="number" min={1} max={24} value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Standard Check-in Time">
              <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Standard Check-out Time">
              <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <button onClick={() => handleSave("Work Schedule")}
            className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Schedule
          </button>
        </SectionCard>

        {/* Leave Allocations */}
        <SectionCard title="Default Annual Leave Allocations">
          <p className="mb-4 text-xs text-slate-400">
            These defaults are applied when creating new employee leave balance records.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEAVE_TYPES.map((lt) => (
              <Field key={lt.key} label={lt.label}>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={365} value={leaveAllocations[lt.key]}
                    onChange={(e) => setLeaveAllocations((prev) => ({ ...prev, [lt.key]: e.target.value }))}
                    className={inputClass} />
                  <span className="text-xs text-slate-400 whitespace-nowrap">days/yr</span>
                </div>
              </Field>
            ))}
          </div>
          <button onClick={() => handleSave("Leave Allocations")}
            className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Allocations
          </button>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard title="Danger Zone">
          <p className="mb-3 text-xs text-slate-500">Irreversible actions — proceed with caution.</p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              Reset All Leave Balances
            </button>
            <button className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              Archive All Inactive Employees
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            These actions are UI placeholders — hook them to backend endpoints as needed.
          </p>
        </SectionCard>
      </main>
    </div>
  );
}
