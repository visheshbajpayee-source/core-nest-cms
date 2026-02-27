"use client";

import React, { useEffect, useState } from "react";
import type { EmployeeFormState } from "../../types/adminTypes";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface AdminEmployeeFormProps {
	form: EmployeeFormState;
	editingId: string | null;
	error: string | null;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancelEdit: () => void;
}


  const departments: string[] = [
    "Engineering",
    "Human Resources",
    "Sales"
  ];

export default function AdminEmployeeForm({
	form,
	editingId,
	error,
	onChange,
	onSubmit,
	onCancelEdit,
}: AdminEmployeeFormProps) {
	// const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
	const [designations, setDesignations] = useState<{ _id: string; title: string }[]>([]);

	useEffect(() => {
		const t = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
		const h = { "Content-Type": "application/json", Authorization: `Bearer ${t}` };
		Promise.all([
			fetch(`${API}/departments`, { headers: h }).then((r) => r.json()),
			fetch(`${API}/designations`, { headers: h }).then((r) => r.json()),
		]).then(([depts, desigs]) => {
			void depts;
			if (desigs.success && Array.isArray(desigs.data)) setDesignations(desigs.data);
		}).catch(() => {});
	}, []);
	return (
		<div className="rounded-lg bg-white p-4 shadow-sm sm:p-5 lg:p-6">
			<h2 className="mb-4 text-lg font-medium text-slate-800">
				{editingId ? "Update Employee" : "Add New Employee"}
			</h2>

			{error && (
				<div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{error}
				</div>
			)}

			<form onSubmit={onSubmit} className="space-y-3">
				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">
						Full Name
					</label>
					<input
						type="text"
						name="fullName"
						value={form.fullName}
						onChange={onChange}
						className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						placeholder="Enter full name"
						required
					/>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={onChange}
							className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							placeholder="name@example.com"
							required
						/>
					</div>

					{!editingId && (
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700">
								Password
							</label>
							<input
								type="password"
								name="password"
								value={form.password}
								onChange={onChange}
								className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="Strong password"
								required
							/>
						</div>
					)}
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Phone Number
						</label>
						<input
							type="text"
							name="phoneNumber"
							value={form.phoneNumber}
							onChange={onChange}
							className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							placeholder="Optional"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Date of Joining
						</label>
						<input
							type="date"
							name="dateOfJoining"
							value={form.dateOfJoining}
							onChange={onChange}
							className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							required
						/>
					</div>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<div>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Designation
						</label>
						<select
							name="designation"
							value={form.designation}
							onChange={onChange}
							required
							className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<option value="">Select designation</option>
							{designations.map((d) => (
								<option key={d._id} value={d._id}>{d.title}</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Role
						</label>
						<select
							name="role"
							value={form.role}
							onChange={onChange}
							className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<option value="employee">Employee</option>
							<option value="manager">Manager</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">
							Status
						</label>
						<select
							name="status"
							value={form.status}
							onChange={onChange}
							className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>
					</div>
				</div>

				<div className="flex items-center gap-3 pt-2">
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
					>
						{editingId ? "Save Changes" : "Add Employee"}
					</button>

					{editingId && (
						<button
							type="button"
							onClick={onCancelEdit}
							className="text-sm font-medium text-slate-600 hover:text-slate-900"
						>
							Cancel edit
						</button>
					)}
				</div>
			</form>
		</div>
	);
}
