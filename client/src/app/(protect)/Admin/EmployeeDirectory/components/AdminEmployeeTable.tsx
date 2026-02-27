"use client";

import React from "react";
import type { Employee } from "../../types/adminTypes";

interface AdminEmployeeTableProps {
	employees: Employee[];
	loading: boolean;
	onEdit: (employee: Employee) => void;
	onDelete: (employeeId: string) => void;
}

export default function AdminEmployeeTable({
	employees,
	loading,
	onEdit,
	onDelete,
}: AdminEmployeeTableProps) {
	return (
		<div className="lg:col-span-2">
			<div className="overflow-hidden rounded-lg bg-white shadow-sm">
				<div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
					<h2 className="text-sm font-semibold text-slate-800">
						Employees ({employees.length})
					</h2>
				</div>

				{loading ? (
					<div className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
						Loading employees...
					</div>
				) : employees.length === 0 ? (
					<div className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
						No employees found. Add the first employee using the form.
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200 text-sm">
							<thead className="bg-slate-50">
								<tr>
									<th className="px-4 py-2 text-left font-medium text-slate-600 sm:px-6">
										Employee ID
									</th>
									<th className="px-4 py-2 text-left font-medium text-slate-600 sm:px-6">
										Name
									</th>
									<th className="hidden px-4 py-2 text-left font-medium text-slate-600 sm:table-cell sm:px-6">
										Email
									</th>
									<th className="hidden px-4 py-2 text-left font-medium text-slate-600 md:table-cell md:px-6">
										Department
									</th>
									<th className="hidden px-4 py-2 text-left font-medium text-slate-600 lg:table-cell lg:px-6">
										Designation
									</th>
									<th className="hidden px-4 py-2 text-left font-medium text-slate-600 xl:table-cell xl:px-6">
										Phone
									</th>
									<th className="hidden px-4 py-2 text-left font-medium text-slate-600 md:table-cell md:px-6">
										Role
									</th>
									<th className="px-4 py-2 text-left font-medium text-slate-600 sm:px-6">
										Status
									</th>
									<th className="px-4 py-2 text-right font-medium text-slate-600 sm:px-6">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 bg-white">
								{employees.map((emp) => (
									<tr key={emp.id} className="hover:bg-slate-50">
										<td className="whitespace-nowrap px-4 py-2 text-xs text-slate-500 sm:px-6">
											{emp.employeeId}
										</td>
										<td className="whitespace-nowrap px-4 py-2 sm:px-6">
											<div className="text-sm font-medium text-slate-900">{emp.fullName}</div>
											<div className="mt-0.5 text-xs text-slate-500 sm:hidden">{emp.email}</div>
											<div className="mt-0.5 text-xs text-slate-400 md:hidden">{emp.department || ""}</div>
										</td>
										<td className="hidden whitespace-nowrap px-4 py-2 text-xs text-slate-600 sm:table-cell sm:px-6">
											{emp.email}
										</td>
										<td className="hidden whitespace-nowrap px-4 py-2 text-xs text-slate-600 md:table-cell md:px-6">
											{emp.department || "-"}
										</td>
										<td className="hidden whitespace-nowrap px-4 py-2 text-xs text-slate-600 lg:table-cell lg:px-6">
											{emp.designation || "-"}
										</td>
										<td className="hidden whitespace-nowrap px-4 py-2 text-xs text-slate-600 xl:table-cell xl:px-6">
											{emp.phoneNumber || "-"}
										</td>
										<td className="hidden whitespace-nowrap px-4 py-2 text-xs text-slate-600 md:table-cell md:px-6">
											{emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
										</td>
										<td className="whitespace-nowrap px-4 py-2 sm:px-6">
											<span
												className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
													emp.status === "active"
														? "bg-green-50 text-green-700 ring-1 ring-green-100"
														: "bg-slate-50 text-slate-600 ring-1 ring-slate-100"
												}`}
											>
												{emp.status === "active" ? "Active" : "Inactive"}
											</span>
										</td>
										<td className="whitespace-nowrap px-4 py-2 text-right text-xs sm:px-6">
											<button
													onClick={() => onEdit(emp)}
													className="mr-2 rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
											>
												Edit
											</button>
											<button
													onClick={() => onDelete(emp.employeeId)}
													className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
