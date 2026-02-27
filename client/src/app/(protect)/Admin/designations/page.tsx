"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/(protect)/Admin/components";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface Designation { _id: string; title: string; description?: string; }

const emptyForm = { title: "", description: "" };

export default function AdminDesignationsPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/designations`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load");
      setDesignations(json.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    setSaving(true); setError(null);
    try {
      const url = editingId ? `${API}/designations/${editingId}` : `${API}/designations`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      await load(); setForm(emptyForm); setEditingId(null);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this designation?")) return;
    try {
      const res = await fetch(`${API}/designations/${id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setDesignations((prev) => prev.filter((d) => d._id !== id));
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Designations</h1>
        <p className="mb-6 text-sm text-slate-500">Create and manage job designations.</p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              {editingId ? "Edit Designation" : "Add Designation"}
            </h2>
            {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
                <input
                  type="text" value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Software Engineer" required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <input
                  type="text" value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Optional"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? "Saving…" : editingId ? "Update" : "Add Designation"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setError(null); }} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-800">All Designations ({designations.length})</h2>
            </div>
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">Loading…</div>
            ) : designations.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">No designations yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Title</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Description</th>
                    <th className="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {designations.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-900">{d.title}</td>
                      <td className="px-4 py-2 text-slate-500">{d.description || "-"}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => { setEditingId(d._id); setForm({ title: d.title, description: d.description || "" }); }} className="mr-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">Edit</button>
                        <button onClick={() => handleDelete(d._id)} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
