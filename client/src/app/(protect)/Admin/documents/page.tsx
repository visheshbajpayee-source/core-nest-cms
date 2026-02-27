"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/(protect)/Admin/components";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const DOC_TYPES = [
  "offer_letter", "id_proof", "address_proof",
  "certificate", "contract", "payslip", "other",
] as const;

type DocType = typeof DOC_TYPES[number];

interface Employee { _id: string; fullName: string; employeeId: string; }
interface IDoc {
  _id: string;
  employee: { _id: string; fullName: string; employeeId: string };
  documentName: string;
  documentType: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: { fullName: string };
  uploadDate: string;
  notes?: string;
}

const fmtBytes = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;
const label = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<IDoc[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterEmp, setFilterEmp] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Form state
  const [empId, setEmpId] = useState("");
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<DocType>("offer_letter");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterEmp !== "all") params.set("employeeId", filterEmp);
      if (filterType !== "all") params.set("documentType", filterType);
      const res = await fetch(`${API}/documents?${params}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setDocs(json.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API}/employees`, { headers });
      const json = await res.json();
      setEmployees(json.data || []);
    } catch {}
  };

  useEffect(() => { fetchAll(); fetchEmployees(); }, []); // eslint-disable-line

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !empId || !docName) return;
    setUploading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("employeeId", empId);
      fd.append("documentName", docName);
      fd.append("documentType", docType);
      if (notes) fd.append("notes", notes);

      const res = await fetch(`${API}/documents`, { method: "POST", headers, body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setDocs((prev) => [json.data, ...prev]);
      // reset form
      setEmpId(""); setDocName(""); setDocType("offer_letter"); setNotes(""); setFile(null);
      (document.getElementById("fileInput") as HTMLInputElement).value = "";
    } catch (e: any) { setError(e.message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      const res = await fetch(`${API}/documents/${id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch (e: any) { setError(e.message); }
  };

  const handleDownload = async (doc: IDoc) => {
    try {
      const res = await fetch(`${API}/documents/${doc._id}/download`, { headers });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = doc.documentName;
      a.click(); URL.revokeObjectURL(url);
    } catch { alert("Download failed"); }
  };

  const inputClass = "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  const shown = docs.filter((d) => {
    if (filterEmp !== "all" && d.employee?._id !== filterEmp) return false;
    if (filterType !== "all" && d.documentType !== filterType) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-4 w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Documents</h1>
        <p className="mb-6 text-sm text-slate-500">Upload and manage employee documents.</p>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Upload Form */}
          <div className="mb-6 lg:mb-0 lg:col-span-1">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">Upload Document</h2>
              <form onSubmit={handleUpload} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Employee *</label>
                  <select value={empId} onChange={(e) => setEmpId(e.target.value)} required className={inputClass}>
                    <option value="">Select employee</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>{e.fullName} ({e.employeeId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Document Name *</label>
                  <input value={docName} onChange={(e) => setDocName(e.target.value)} required
                    placeholder="e.g. Offer Letter 2024" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Document Type *</label>
                  <select value={docType} onChange={(e) => setDocType(e.target.value as DocType)} required className={inputClass}>
                    {DOC_TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">File * (PDF / Word / Image, max 10 MB)</label>
                  <input id="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                    className={inputClass} placeholder="Optional notes…" />
                </div>
                <button type="submit" disabled={uploading}
                  className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                  {uploading ? "Uploading…" : "Upload Document"}
                </button>
              </form>
            </div>
          </div>

          {/* Document List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-3">
              <select value={filterEmp} onChange={(e) => setFilterEmp(e.target.value)}
                className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
                <option value="all">All Employees</option>
                {employees.map((e) => <option key={e._id} value={e._id}>{e.fullName}</option>)}
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
                <option value="all">All Types</option>
                {DOC_TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-10 text-sm text-slate-400">Loading…</div>
            ) : shown.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-400">
                No documents found.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Employee", "Name", "Type", "Size", "Uploaded", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-medium text-slate-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {shown.map((doc) => (
                      <tr key={doc._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{doc.employee?.fullName}</div>
                          <div className="text-xs text-slate-400">{doc.employee?.employeeId}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{doc.documentName}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 capitalize">
                            {label(doc.documentType)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{fmtBytes(doc.fileSize)}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                          <div className="text-slate-400">{doc.uploadedBy?.fullName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleDownload(doc)}
                              className="rounded bg-indigo-50 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100">
                              Download
                            </button>
                            <button onClick={() => handleDelete(doc._id)}
                              className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
