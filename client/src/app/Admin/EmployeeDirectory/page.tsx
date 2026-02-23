"use client";

import React, { useEffect, useState } from "react";
import { AdminEmployeeForm, AdminEmployeeTable, AdminSidebar } from "@/app/components";
import type { Employee, EmployeeFormState } from "@/app/components/adminTypes";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

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

async function fetchEmployees(token: string): Promise<Employee[]> {
	const res = await fetch(`${API_BASE_URL}/employees`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.message || "Failed to load employees");
	}

	const json = await res.json();
	const items = json.data as any[];
	return (items || []).map((e) => ({
		id: e.id,
		employeeId: e.employeeId,
		fullName: e.fullName,
		email: e.email,
		role: e.role,
		department: e.department,
		designation: e.designation,
		dateOfJoining: typeof e.dateOfJoining === "string" ? e.dateOfJoining : new Date(e.dateOfJoining).toISOString(),
		status: e.status,
		phoneNumber: e.phoneNumber,
		profilePicture: e.profilePicture,
	}));
}

async function createEmployeeApi(form: EmployeeFormState, token: string): Promise<Employee> {
	const payload: any = {
		fullName: form.fullName,
		email: form.email,
		password: form.password,
		phoneNumber: form.phoneNumber || undefined,
		role: form.role,
		department: form.department,
		designation: form.designation,
		dateOfJoining: form.dateOfJoining,
	};

	const res = await fetch(`${API_BASE_URL}/employees`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.message || "Failed to create employee");
	}

	const json = await res.json();
	const e = json.data;
	return {
		id: e.id,
		employeeId: e.employeeId,
		fullName: e.fullName,
		email: e.email,
		role: e.role,
		department: e.department,
		designation: e.designation,
		dateOfJoining: typeof e.dateOfJoining === "string" ? e.dateOfJoining : new Date(e.dateOfJoining).toISOString(),
		status: e.status,
		phoneNumber: e.phoneNumber,
		profilePicture: e.profilePicture,
	};
}

async function updateEmployeeApi(
	employeeId: string,
	form: EmployeeFormState,
	token: string
): Promise<Employee> {
	const payload: any = {
		fullName: form.fullName,
		phoneNumber: form.phoneNumber || undefined,
		designation: form.designation || undefined,
		status: form.status,
	};

	const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.message || "Failed to update employee");
	}

	const json = await res.json();
	const e = json.data;
	return {
		id: e.id,
		employeeId: e.employeeId,
		fullName: e.fullName,
		email: e.email,
		role: e.role,
		department: e.department,
		designation: e.designation,
		dateOfJoining: typeof e.dateOfJoining === "string" ? e.dateOfJoining : new Date(e.dateOfJoining).toISOString(),
		status: e.status,
		phoneNumber: e.phoneNumber,
		profilePicture: e.profilePicture,
	};
}

async function deleteEmployeeApi(employeeId: string, token: string): Promise<void> {
	const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.message || "Failed to delete employee");
	}
}

export default function EmployeeDirectoryPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [form, setForm] = useState<EmployeeFormState>(emptyForm);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [authToken, setAuthToken] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				const token =
					typeof window !== "undefined"
						? window.localStorage.getItem("accessToken")
						: null;
				if (!token) {
					setError("Not authenticated. Please log in as admin.");
					setLoading(false);
					return;
				}
				setAuthToken(token);
				const data = await fetchEmployees(token);
				setEmployees(data);
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Failed to load employees.");
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	const resetForm = () => {
		setForm(emptyForm);
		setEditingId(null);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!form.fullName || !form.email) {
			setError("Full name and email are required.");
			return;
		}
		if (!editingId && !form.password) {
			setError("Password is required for new employees.");
			return;
		}
		if (!authToken) {
			setError("Not authenticated. Please log in as admin.");
			return;
		}

		setError(null);

		const run = async () => {
			try {
				if (editingId) {
					const updated = await updateEmployeeApi(editingId, form, authToken);
					setEmployees((prev) =>
						prev.map((emp) =>
							emp.employeeId === editingId ? updated : emp
						)
					);
				} else {
					const created = await createEmployeeApi(form, authToken);
					setEmployees((prev) => [...prev, created]);
				}
				resetForm();
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Something went wrong.");
			}
		};

		void run();
	};

	const handleEdit = (employee: Employee) => {
		setEditingId(employee.employeeId);
		setForm({
			fullName: employee.fullName,
			email: employee.email,
			password: "",
			phoneNumber: employee.phoneNumber || "",
			department: employee.department,
			designation: employee.designation,
			dateOfJoining: employee.dateOfJoining
				? employee.dateOfJoining.substring(0, 10)
				: "",
			role: employee.role,
			status: employee.status,
		});
	};

	const handleDelete = (id: string) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this employee?"
		);
		if (!confirmed) return;
		if (!authToken) {
			setError("Not authenticated. Please log in as admin.");
			return;
		}

		const run = async () => {
			try {
				await deleteEmployeeApi(id, authToken);
				setEmployees((prev) => prev.filter((emp) => emp.employeeId !== id));
				if (editingId === id) {
					resetForm();
				}
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Failed to delete employee.");
			}
		};

		void run();
	};

	return (
		<div className="flex min-h-screen bg-slate-100">
			<AdminSidebar />
			<div className="ml-64 w-full p-4 sm:p-6 lg:p-8">
				<h1 className="mb-6 text-2xl font-semibold text-slate-900">
					Admin &mdash; Employee Directory
				</h1>

				{/* Form + List layout */}
				<div className="grid gap-6 lg:grid-cols-3">
					<AdminEmployeeForm
						form={form}
						editingId={editingId}
						error={error}
						onChange={handleChange}
						onSubmit={handleSubmit}
						onCancelEdit={resetForm}
					/>

					<AdminEmployeeTable
						employees={employees}
						loading={loading}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>
			</div>
		</div>
	);
}

