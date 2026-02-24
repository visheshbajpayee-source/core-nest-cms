"use client";

import React, { useEffect, useRef, useState } from "react";
import { AdminSidebar } from "@/app/EmployeeComponents";
import { dummyProjects, dummyEmployees, type Project, type TeamMember } from "./projectdata";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface Dept { _id: string; name: string; }

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-600",
  in_progress:  "bg-blue-100 text-blue-700",
  completed:    "bg-green-100 text-green-700",
  on_hold:      "bg-yellow-100 text-yellow-700",
};

const STATUS_BAR: Record<string, string> = {
  not_started: "bg-slate-300",
  in_progress:  "bg-blue-400",
  completed:    "bg-green-400",
  on_hold:      "bg-yellow-400",
};

const STATUSES = ["not_started", "in_progress", "completed", "on_hold"] as const;
const emptyForm = {
  name: "", description: "", startDate: "", expectedEndDate: "",
  status: "not_started", department: "",
};

// ─── Avatar initials helper ───────────────────────────────────────────────────
function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const colours = ["bg-indigo-100 text-indigo-700", "bg-rose-100 text-rose-700",
    "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-violet-100 text-violet-700"];
  const colour = colours[name.charCodeAt(0) % colours.length];
  const sz = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-xs";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sz} ${colour}`}>
      {initials}
    </span>
  );
}

// ─── Employee search chip input ───────────────────────────────────────────────
function MemberSearch({
  selected, onChange, pool,
}: { selected: TeamMember[]; onChange: (v: TeamMember[]) => void; pool: TeamMember[]; }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = pool.filter((e) =>
    !selected.find((s) => s._id === e._id) &&
    (e.fullName.toLowerCase().includes(query.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(query.toLowerCase()) ||
      e.email.toLowerCase().includes(query.toLowerCase()))
  );

  const add = (emp: TeamMember) => { onChange([...selected, emp]); setQuery(""); };
  const remove = (id: string) => onChange(selected.filter((s) => s._id !== id));

  return (
    <div ref={ref} className="relative">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((m) => (
            <span key={m._id}
              className="flex items-center gap-1 rounded-full bg-indigo-50 pl-2 pr-1 py-0.5 text-xs font-medium text-indigo-700">
              {m.fullName}
              <span className="text-xs text-slate-400 ml-0.5">({m.employeeId})</span>
              <button type="button" onClick={() => remove(m._id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-indigo-200 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
      {/* Search input */}
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search by name, ID or email…"
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
      />
      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {filtered.map((emp) => (
            <li key={emp._id}>
              <button type="button" onMouseDown={() => add(emp)}
                className="flex w-full items-center gap-3 px-3 py-2 hover:bg-indigo-50 text-left">
                <Avatar name={emp.fullName} size="sm" />
                <div>
                  <div className="text-sm font-medium text-slate-800">{emp.fullName}
                    <span className="ml-1.5 text-xs text-slate-400">{emp.employeeId}</span>
                  </div>
                  <div className="text-xs text-slate-400">{emp.email} · {emp.designation}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.length > 0 && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-lg">
          No matching employees found.
        </div>
      )}
    </div>
  );
}

// ─── Project Detail Modal ─────────────────────────────────────────────────────
function DetailModal({ project, onClose, onEdit }: { project: Project; onClose: () => void; onEdit: () => void; }) {
  const daysLeft = Math.ceil((new Date(project.expectedEndDate).getTime() - Date.now()) / 86400000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Hero bar */}
        <div className={`h-1.5 w-full rounded-t-2xl ${STATUS_BAR[project.status]}`} />

        <div className="p-6">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <span className={`mb-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[project.status]}`}>
                {project.status.replace(/_/g, " ")}
              </span>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">{project.name}</h2>
              {project.department && (
                <p className="mt-1 text-sm text-slate-400">{project.department.name}</p>
              )}
            </div>
            <button onClick={onClose}
              className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <div className="mb-5 rounded-lg bg-slate-50 p-4">
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {project.description || "No description provided."}
            </p>
          </div>

          {/* Timeline */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-100 p-3 text-center">
              <div className="text-xs text-slate-400 mb-0.5">Start Date</div>
              <div className="text-sm font-semibold text-slate-800">{new Date(project.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <div className="rounded-lg border border-slate-100 p-3 text-center">
              <div className="text-xs text-slate-400 mb-0.5">End Date</div>
              <div className="text-sm font-semibold text-slate-800">{new Date(project.expectedEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <div className={`rounded-lg border p-3 text-center ${daysLeft < 0 ? "border-red-100 bg-red-50" : daysLeft <= 7 ? "border-yellow-100 bg-yellow-50" : "border-slate-100"}`}>
              <div className="text-xs text-slate-400 mb-0.5">Days Left</div>
              <div className={`text-sm font-semibold ${daysLeft < 0 ? "text-red-600" : daysLeft <= 7 ? "text-yellow-700" : "text-slate-800"}`}>
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d`}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Team Members ({project.teamMembers.length})
            </h3>
            {project.teamMembers.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No members assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {project.teamMembers.map((m) => (
                  <div key={m._id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
                    <Avatar name={m.fullName} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{m.fullName}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{m.employeeId}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                        <span>{m.email}</span>
                        <span className="text-slate-300">·</span>
                        <span>{m.designation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Close
            </button>
            <button onClick={onEdit}
              className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Edit Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
function ProjectModal({
  open, onClose, form, setForm, members, setMembers,
  departments, saving, error, editingId, onSubmit,
}: {
  open: boolean; onClose: () => void;
  form: typeof emptyForm; setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  members: TeamMember[]; setMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  departments: Dept[]; saving: boolean; error: string | null;
  editingId: string | null; onSubmit: (e: React.FormEvent) => void;
}) {
  if (!open) return null;
  const inputClass = "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{editingId ? "Edit Project" : "New Project"}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Project Name *</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required className={inputClass} placeholder="e.g. Employee Self-Service Portal" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3} className={inputClass} placeholder="Brief overview of the project…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                required className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">End Date *</label>
              <input type="date" value={form.expectedEndDate} onChange={(e) => setForm((p) => ({ ...p, expectedEndDate: e.target.value }))}
                required className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Department</label>
              <select value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} className={inputClass}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Status</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className={inputClass}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>

          {/* Team member search */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Assign Team Members
              <span className="ml-1 text-slate-400">(search by name, ID or email)</span>
            </label>
            <MemberSearch selected={members} onChange={setMembers} pool={dummyEmployees} />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(dummyProjects);
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/departments`, { headers })
      .then((r) => r.json())
      .then((j) => { if (j.data) setDepartments(j.data); })
      .catch(() => {});
  }, []); // eslint-disable-line

  const openCreate = () => { setForm(emptyForm); setMembers([]); setEditingId(null); setError(null); setModalOpen(true); };
  const openEdit = (p: Project) => {
    setEditingId(p._id); setError(null);
    setForm({ name: p.name, description: p.description || "", startDate: p.startDate?.substring(0, 10), expectedEndDate: p.expectedEndDate?.substring(0, 10), status: p.status, department: p.department?._id || "" });
    setMembers(p.teamMembers);
    setDetailProject(null);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(emptyForm); setMembers([]); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.expectedEndDate) { setError("Name, start date and end date are required"); return; }
    setSaving(true); setError(null);
    try {
      const url = editingId ? `${API}/projects/${editingId}` : `${API}/projects`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify({ ...form, teamMembers: members.map((m) => m._id) }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      const saved: Project = { ...json.data, teamMembers: members };
      if (editingId) setProjects((prev) => prev.map((p) => (p._id === editingId ? saved : p)));
      else setProjects((prev) => [saved, ...prev]);
      closeModal();
    } catch {
      // Optimistic update when backend is down
      const dept = departments.find((d) => d._id === form.department);
      const pseudo: Project = { _id: editingId ?? `local-${Date.now()}`, name: form.name, description: form.description, startDate: form.startDate, expectedEndDate: form.expectedEndDate, status: form.status as Project["status"], department: dept ? { _id: dept._id, name: dept.name } : undefined, teamMembers: members };
      if (editingId) setProjects((prev) => prev.map((p) => (p._id === editingId ? pseudo : p)));
      else setProjects((prev) => [pseudo, ...prev]);
      closeModal();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setProjects((prev) => prev.filter((p) => p._id !== id));
    try { await fetch(`${API}/projects/${id}`, { method: "DELETE", headers }); } catch {}
  };

  const shown = filterStatus ? projects.filter((p) => p.status === filterStatus) : projects;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-64 w-full p-4 sm:p-6 lg:p-8">

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
            <p className="mt-0.5 text-sm text-slate-500">Manage projects, teams and deadlines.</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

        {/* Filter pills */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(["", ...STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterStatus === s ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600"}`}>
              {s ? s.replace(/_/g, " ") : "All"}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {shown.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-14 text-center text-sm text-slate-400">No projects found.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((p) => (
              <div key={p._id} className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow overflow-hidden">
                {/* Coloured top bar */}
                <div className={`h-1 w-full ${STATUS_BAR[p.status]}`} />
                {/* Clickable body → opens detail */}
                <button type="button" onClick={() => setDetailProject(p)}
                  className="flex-1 p-5 text-left hover:bg-slate-50/60 transition-colors">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[p.status]}`}>
                      {p.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-slate-400">{p.department?.name || "—"}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 leading-snug">{p.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                    {p.description || "No description provided."}
                  </p>
                  {/* Meta */}
                  <div className="mt-4 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(p.startDate).toLocaleDateString()} → {new Date(p.expectedEndDate).toLocaleDateString()}
                    </div>
                    {/* Avatar stack */}
                    {p.teamMembers.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="flex -space-x-2">
                          {p.teamMembers.slice(0, 4).map((m) => (
                            <Avatar key={m._id} name={m.fullName} size="sm" />
                          ))}
                          {p.teamMembers.length > 4 && (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500 ring-2 ring-white">
                              +{p.teamMembers.length - 4}
                            </span>
                          )}
                        </div>
                        <span className="ml-1">{p.teamMembers.length} member{p.teamMembers.length !== 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </div>
                </button>
                {/* Actions row */}
                <div className="flex gap-2 border-t border-slate-100 px-5 py-3">
                  <button onClick={() => openEdit(p)}
                    className="flex-1 rounded-md border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)}
                    className="flex-1 rounded-md border border-red-100 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail modal */}
      {detailProject && (
        <DetailModal
          project={detailProject}
          onClose={() => setDetailProject(null)}
          onEdit={() => openEdit(detailProject)}
        />
      )}

      {/* Create / Edit modal */}
      <ProjectModal
        open={modalOpen} onClose={closeModal}
        form={form} setForm={setForm}
        members={members} setMembers={setMembers}
        departments={departments} saving={saving} error={error}
        editingId={editingId} onSubmit={handleSubmit}
      />
    </div>
  );
}

