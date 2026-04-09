import React from "react";
import type { AttendanceCorrectionPayload, AttendanceStatus } from "../types";

export default function ManualCorrectionForm({
  form,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: {
  form: AttendanceCorrectionPayload;
  saving: boolean;
  onChange: (next: AttendanceCorrectionPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mb-6 rounded-lg bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Add / Correct Attendance Record</h3>
      <div className="grid gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Employee ID *</label>
          <input
            type="text"
            value={form.employee}
            onChange={(e) => onChange({ ...form, employee: e.target.value })}
            className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="EMP014"
            required
          />
          <p className="mt-1 text-[11px] text-slate-400">You can also paste Mongo ObjectId if needed.</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => onChange({ ...form, date: e.target.value })}
            className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Status *</label>
          <select
            value={form.status}
            onChange={(e) => onChange({ ...form, status: e.target.value as AttendanceStatus })}
            className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {["present", "absent", "on_leave", "holiday"].map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Check-in Time</label>
          <input
            type="datetime-local"
            value={form.checkInTime}
            onChange={(e) => onChange({ ...form, checkInTime: e.target.value })}
            className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-800">
          Cancel
        </button>
      </div>
    </form>
  );
}
