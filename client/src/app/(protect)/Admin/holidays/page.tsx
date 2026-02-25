"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/EmployeeComponents";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface Holiday { _id: string; name: string; date: string; description?: string; type: "national" | "regional" | "company"; }

const TYPE_COLORS: Record<string, string> = {
  national: "bg-red-100 text-red-700",
  regional: "bg-orange-100 text-orange-700",
  company: "bg-indigo-100 text-indigo-700",
};

const emptyForm = { name: "", date: "", description: "", type: "company" };

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/holidays?year=${year}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setHolidays(json.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [year]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) return setError("Name and date are required");
    setSaving(true); setError(null);
    try {
      const url = editingId ? `${API}/holidays/${editingId}` : `${API}/holidays`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      await load(); setForm(emptyForm); setEditingId(null);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this holiday?")) return;
    try {
      const res = await fetch(`${API}/holidays/${id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setHolidays((prev) => prev.filter((h) => h._id !== id));
    } catch (e: any) { setError(e.message); }
  };

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const grouped = holidays.reduce((acc, h) => {
    const m = new Date(h.date).getMonth();
    if (!acc[m]) acc[m] = [];
    acc[m].push(h);
    return acc;
  }, {} as Record<number, Holiday[]>);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-64 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Holiday Calendar</h1>
        <p className="mb-6 text-sm text-slate-500">Manage public and company holidays for the year.</p>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Form */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-800">{editingId ? "Edit Holiday" : "Add Holiday"}</h2>
            {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" placeholder="e.g. Diwali" required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Date *</label>
                <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Type</label>
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                  {["national", "regional", "company"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" placeholder="Optional" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? "Saving…" : editingId ? "Update" : "Add Holiday"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}
                    className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* Calendar List */}
          <div className="xl:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Year:</label>
              <input type="number" value={year} onChange={(e) => setYear(e.target.value)} min={2020} max={2035}
                className="w-24 rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" />
              <span className="text-sm text-slate-500">{holidays.length} holidays</span>
            </div>
            {loading ? (
              <div className="rounded-lg bg-white p-10 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
            ) : holidays.length === 0 ? (
              <div className="rounded-lg bg-white p-10 text-center text-sm text-slate-400 shadow-sm">No holidays for {year}.</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([mStr, hs]) => (
                  <div key={mStr} className="rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-2">
                      <h3 className="text-sm font-semibold text-slate-700">{months[Number(mStr)]}</h3>
                    </div>
                    <table className="min-w-full text-sm">
                      <tbody className="divide-y divide-slate-50">
                        {hs.map((h) => (
                          <tr key={h._id} className="hover:bg-slate-50">
                            <td className="px-4 py-2 w-24 font-medium text-slate-900">
                              {new Date(h.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
                            </td>
                            <td className="px-4 py-2 text-slate-800">{h.name}</td>
                            <td className="px-4 py-2 text-slate-400 text-xs">{h.description || "-"}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[h.type]}`}>{h.type}</span>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button onClick={() => { setEditingId(h._id); setForm({ name: h.name, date: h.date.substring(0, 10), description: h.description || "", type: h.type }); }}
                                className="mr-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">Edit</button>
                              <button onClick={() => handleDelete(h._id)}
                                className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
