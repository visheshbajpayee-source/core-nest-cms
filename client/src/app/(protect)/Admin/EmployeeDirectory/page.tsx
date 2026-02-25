"use client";

import React, { useEffect, useState } from "react";
import { AdminEmployeeTable, AdminSidebar } from "@/app/EmployeeComponents";
import type { Employee, EmployeeFormState } from "@/app/AdminComponents/adminTypes";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const emptyForm: EmployeeFormState = {
	fullName: "",
	email: "",
	password: "",
	phoneNumber: "",
	department: "",
	designation: "",
	dateOfJoining: "",
	role: "employee",
	status: "active",
};

// â”€â”€â”€ Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function EmployeeModal({
	open, onClose, editingId, form, error, onChange, onSubmit, saving,
}: {
	open: boolean; onClose: () => void; editingId: string | null;
	form: EmployeeFormState; error: string | null;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onSubmit: (e: React.FormEvent) => void; saving: boolean;
}) {
	const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
	const [designations, setDesignations] = useState<{ _id: string; title: string }[]>([]);

	useEffect(() => {
		if (!open) return;
		const t = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
		const h = { "Content-Type": "application/json", Authorization: `Bearer ${t}` };
		Promise.all([
			fetch(`${API}/departments`, { headers: h }).then((r) => r.json()),
			fetch(`${API}/designations`, { headers: h }).then((r) => r.json()),
		]).then(([depts, desigs]) => {
			if (depts.success && Array.isArray(depts.data)) setDepartments(depts.data);
			if (desigs.success && Array.isArray(desigs.data)) setDesignations(desigs.data);
		}).catch(() => {});
	}, [open]); // eslint-disable-line

	if (!open) return null;
	const inp = "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200";
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
			onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
			<div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
				<div className="mb-5 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-slate-900">
						{editingId ? "Edit Employee" : "Add New Employee"}
					</h2>
					<button onClick={onClose}
						className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				{error && (
					<div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
				)}
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="mb-1 block text-xs font-medium text-slate-700">Full Name *</label>
						<input type="text" name="fullName" value={form.fullName} onChange={onChange} required placeholder="Aryan Mehta" className={inp} />
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-700">Email *</label>
							<input type="email" name="email" value={form.email} onChange={onChange} required placeholder="name@company.com" className={inp} />
						</div>
						{!editingId && (
							<div>
								<label className="mb-1 block text-xs font-medium text-slate-700">Password *</label>
								<input type="password" name="password" value={form.password} onChange={onChange} required placeholder="Strong password" className={inp} />
							</div>
						)}
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-700">Phone Number</label>
							<input type="text" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="Optional" className={inp} />
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-700">Date of Joining *</label>
							<input type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={onChange} required className={inp} />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-700">Department *</label>
							<select name="department" value={form.department} onChange={onChange} required className={inp}>
								<option value="">Select department</option>
								{departments.map((d) => (
									<option key={d._id} value={d._id}>{d.name}</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-700">Designation *</label>
							<select name="designation" value={form.designation} onChange={onChange} required className={inp}>
								<option value="">Select designation</option>
								{designations.map((d) => (
									<option key={d._id} value={d._id}>{d.title}</option>
								))}
							</select>
						</div>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-700">Role</label>
							<select name="role" value={form.role} onChange={onChange} className={inp}>
								<option value="employee">Employee</option>
								<option value="manager">Manager</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-slate-700">Status</label>
							<select name="status" value={form.status} onChange={onChange} className={inp}>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</div>
					</div>
					<div className="flex justify-end gap-3 pt-1">
						<button type="button" onClick={onClose}
							className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
							Cancel
						</button>
						<button type="submit" disabled={saving}
							className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
							{saving ? "Savingâ€¦" : editingId ? "Update Employee" : "Add Employee"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function EmployeeDirectoryPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [form, setForm] = useState<EmployeeFormState>(emptyForm);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

	const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
	const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

	useEffect(() => {
		const t = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
		if (!t) { setError("Not authenticated. Please log in."); setLoading(false); return; }
		setLoading(true);
		fetch(`${API}/employees`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` } })
			.then(async (r) => {
				const j = await r.json();
				if (!r.ok || !j.success) {
					setError(j.message || `Server error ${r.status}`);
					return;
				}
				const list: any[] = Array.isArray(j.data) ? j.data : [];
				setEmployees(list.map((e) => ({
					id: e.id ?? e._id,
					employeeId: e.employeeId,
					fullName: e.fullName,
					email: e.email,
					role: e.role,
					department: e.department,
					departmentId: e.departmentId,
					designation: e.designation,
					designationId: e.designationId,
					dateOfJoining: typeof e.dateOfJoining === "string"
						? e.dateOfJoining
						: new Date(e.dateOfJoining).toISOString(),
					status: e.status,
					phoneNumber: e.phoneNumber,
					profilePicture: e.profilePicture,
				})));
			})
			.catch(() => setError("Could not reach the server. Is the backend running?"))
			.finally(() => setLoading(false));
	}, []); // eslint-disable-line

	const openCreate = () => { setForm(emptyForm); setEditingId(null); setError(null); setModalOpen(true); };
	const openEdit = (emp: Employee) => {
		setEditingId(emp.employeeId); setError(null);
		setForm({ fullName: emp.fullName, email: emp.email, password: "", phoneNumber: emp.phoneNumber || "",
			department: emp.departmentId || "", designation: emp.designationId || "",
			dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.substring(0, 10) : "",
			role: emp.role, status: emp.status });
		setModalOpen(true);
	};
	const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(emptyForm); setError(null); };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.fullName || !form.email) { setError("Full name and email are required."); return; }
		if (!editingId && !form.password) { setError("Password is required for new employees."); return; }
		setSaving(true); setError(null);
		try {
			if (editingId) {
				const res = await fetch(`${API}/employees/${editingId}`, {
					method: "PUT", headers,
					body: JSON.stringify({ fullName: form.fullName, phoneNumber: form.phoneNumber || undefined, designation: form.designation || undefined, status: form.status }),
				});
				const json = await res.json();
				if (!res.ok) throw new Error(json.message || "Failed");
				const e = json.data;
				const updated: Employee = { id: e.id ?? e._id, employeeId: e.employeeId, fullName: e.fullName, email: e.email, role: e.role, department: e.department, designation: e.designation, dateOfJoining: e.dateOfJoining, status: e.status, phoneNumber: e.phoneNumber };
				setEmployees((prev) => prev.map((emp) => emp.employeeId === editingId ? updated : emp));
			} else {
				const res = await fetch(`${API}/employees`, {
					method: "POST", headers,
					body: JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password, phoneNumber: form.phoneNumber || undefined, role: form.role, department: form.department, designation: form.designation, dateOfJoining: form.dateOfJoining }),
				});
				const json = await res.json();
				if (!res.ok) throw new Error(json.message || "Failed");
				const e = json.data;
				const created: Employee = { id: e.id ?? e._id, employeeId: e.employeeId, fullName: e.fullName, email: e.email, role: e.role, department: e.department, designation: e.designation, dateOfJoining: e.dateOfJoining, status: e.status, phoneNumber: e.phoneNumber };
				setEmployees((prev) => [created, ...prev]);
			}
			closeModal();
		} catch (err: any) {
			setError(err?.message || "Something went wrong. Please try again.");
		} finally { setSaving(false); }
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this employee?")) return;
		setEmployees((prev) => prev.filter((emp) => emp.employeeId !== id));
		fetch(`${API}/employees/${id}`, { method: "DELETE", headers }).catch(() => {});
	};

	const shown = employees.filter((emp) => {
		const matchSearch = !search ||
			emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
			emp.email.toLowerCase().includes(search.toLowerCase()) ||
			emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
			emp.department.toLowerCase().includes(search.toLowerCase());
		const matchStatus = filterStatus === "all" || emp.status === filterStatus;
		return matchSearch && matchStatus;
	});

	const total = employees.length;
	const active = employees.filter((e) => e.status === "active").length;
	const inactive = employees.filter((e) => e.status === "inactive").length;

	return (
		<div className="flex min-h-screen bg-slate-100">
			<AdminSidebar />
			<div className="w-full pt-16 lg:ml-64 lg:pt-0">
				<div className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Employee Directory</h1>
						<p className="mt-0.5 text-sm text-slate-500">Manage all employees across departments.</p>
					</div>
					<button onClick={openCreate}
						className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-transform">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
						</svg>
						Add Employee
					</button>
				</div>
			{/* Error banner */}
			{error && !modalOpen && (
				<div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					<span>{error}</span>
					<button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-600">✕</button>
				</div>
			)}
				{/* Stats */}
				<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
					{[
						{ label: "Total Employees", value: total, color: "text-slate-900" },
						{ label: "Active", value: active, color: "text-green-600" },
						{ label: "Inactive", value: inactive, color: "text-red-500" },
					].map((s) => (
						<div key={s.label} className="rounded-xl bg-white px-5 py-4 shadow-sm">
							<div className="text-xs text-slate-400">{s.label}</div>
							<div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
						</div>
					))}
				</div>

				{/* Filters */}
				<div className="mb-4 flex flex-wrap items-center gap-3">
					<input value={search} onChange={(e) => setSearch(e.target.value)}
						placeholder="Search name, email, ID or department…"
						className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none sm:w-72" />
					<div className="flex flex-wrap gap-2">
						{(["all", "active", "inactive"] as const).map((s) => (
							<button key={s} onClick={() => setFilterStatus(s)}
								className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors capitalize ${filterStatus === s ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600"}`}>
								{s}
							</button>
						))}
					</div>
					<span className="ml-auto text-xs text-slate-400">{shown.length} of {total}</span>
				</div>

				{/* Table */}
				<AdminEmployeeTable employees={shown} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
			</div>
			</div>

			<EmployeeModal open={modalOpen} onClose={closeModal} editingId={editingId}
				form={form} error={error} onChange={handleChange} onSubmit={handleSubmit} saving={saving} />
		</div>
	);
}
