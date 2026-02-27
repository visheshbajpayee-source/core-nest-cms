"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/(protect)/Admin/components";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  target: "all" | "department";
  department?: { name: string };
  priority: "normal" | "important" | "urgent";
  publishedAt: string;
  expiryDate?: string;
  createdBy?: { fullName: string };
}
interface Dept { _id: string; name: string; }

const PRIORITY_COLORS: Record<string, string> = {
  normal: "bg-slate-100 text-slate-600",
  important: "bg-blue-100 text-blue-700",
  urgent: "bg-red-100 text-red-700",
};

const emptyForm = { title: "", content: "", target: "all", department: "", priority: "normal", expiryDate: "" };

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Dept[]>([]);
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
      const [aRes, dRes] = await Promise.all([
        fetch(`${API}/announcements/all`, { headers }),
        fetch(`${API}/departments`, { headers }),
      ]);
      const aJson = await aRes.json();
      const dJson = await dRes.json();
      if (!aRes.ok) throw new Error(aJson.message || "Failed");
      setAnnouncements(aJson.data || []);
      setDepartments(dJson.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return setError("Title and content are required");
    setSaving(true); setError(null);
    try {
      const payload: any = { ...form };
      if (!payload.expiryDate) delete payload.expiryDate;
      if (payload.target !== "department") delete payload.department;
      const url = editingId ? `${API}/announcements/${editingId}` : `${API}/announcements`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      await load(); setForm(emptyForm); setEditingId(null);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      const res = await fetch(`${API}/announcements/${id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (e: any) { setError(e.message); }
  };

  const now = new Date();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Announcements</h1>
        <p className="mb-6 text-sm text-slate-500">Post and manage company-wide announcements.</p>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Form */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-800">{editingId ? "Edit Announcement" : "New Announcement"}</h2>
            {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Content *</label>
                <textarea rows={4} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Target</label>
                  <select value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                    <option value="all">All Employees</option>
                    <option value="department">Department</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                    {["normal", "important", "urgent"].map((pr) => <option key={pr} value={pr}>{pr}</option>)}
                  </select>
                </div>
              </div>
              {form.target === "department" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Department</label>
                  <select value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                    <option value="">Select department</option>
                    {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Expiry Date (optional)</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? "Saving…" : editingId ? "Update" : "Post"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}
                    className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="xl:col-span-2 space-y-4">
            {loading ? (
              <div className="rounded-lg bg-white p-10 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
            ) : announcements.length === 0 ? (
              <div className="rounded-lg bg-white p-10 text-center text-sm text-slate-400 shadow-sm">No announcements yet.</div>
            ) : (
              announcements.map((a) => {
                const expired = a.expiryDate ? new Date(a.expiryDate) < now : false;
                return (
                  <div key={a._id} className={`rounded-lg bg-white p-5 shadow-sm ${expired ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{a.title}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[a.priority]}`}>{a.priority}</span>
                          {expired && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">Expired</span>}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{a.content}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>🎯 {a.target === "all" ? "All Employees" : a.department?.name}</span>
                          <span>📅 {new Date(a.publishedAt).toLocaleDateString()}</span>
                          {a.expiryDate && <span>⏰ Expires {new Date(a.expiryDate).toLocaleDateString()}</span>}
                          {a.createdBy && <span>👤 {a.createdBy.fullName}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => {
                          setEditingId(a._id);
                          setForm({ title: a.title, content: a.content, target: a.target, department: (a.department as any)?._id || "", priority: a.priority, expiryDate: a.expiryDate ? a.expiryDate.substring(0, 10) : "" });
                        }} className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">Edit</button>
                        <button onClick={() => handleDelete(a._id)} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
