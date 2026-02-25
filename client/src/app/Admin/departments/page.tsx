"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/EmployeeComponents";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface Department {
  _id: string;
  name: string;
  description?: string;
  head?: { fullName: string; employeeId: string };
}

const emptyForm = { name: "", description: "" };

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
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
      const res = await fetch(`${API}/departments`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load");
      setDepartments(json.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required");
    setSaving(true);
    setError(null);
    try {
      const url = editingId ? `${API}/departments/${editingId}` : `${API}/departments`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      await load();
      setForm(emptyForm);
      setEditingId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;
    try {
      const res = await fetch(`${API}/departments/${id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const startEdit = (dept: Department) => {
    setEditingId(dept._id);
    setForm({ name: dept.name, description: dept.description || "" });
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-64 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Departments</h1>
        <p className="mb-6 text-sm text-slate-500">Create and manage company departments.</p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              {editingId ? "Edit Department" : "Add Department"}
            </h2>
            {error && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Engineering"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Optional"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving…" : editingId ? "Update" : "Add Department"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setForm(emptyForm); setError(null); }}
                    className="text-sm text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">All Departments ({departments.length})</h2>
            </div>
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">Loading…</div>
            ) : departments.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">No departments yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Description</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Head</th>
                    <th className="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {departments.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-900">{d.name}</td>
                      <td className="px-4 py-2 text-slate-500">{d.description || "-"}</td>
                      <td className="px-4 py-2 text-slate-500">{d.head?.fullName || "-"}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => startEdit(d)} className="mr-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">Edit</button>
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
