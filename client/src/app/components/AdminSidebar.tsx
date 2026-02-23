"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemConfig {
	label: string;
	path: string;
	icon: string;
}

const adminNavItems: NavItemConfig[] = [
	{ label: "Dashboard", path: "/Admin/dashboard", icon: "📊" },
	{ label: "Employee Directory", path: "/Admin/EmployeeDirectory", icon: "👥" },
	{ label: "Departments", path: "/Admin/departments", icon: "🏢" },
	{ label: "Designations", path: "/Admin/designations", icon: "🎓" },
	{ label: "Attendance", path: "/Admin/attendance", icon: "📅" },
	{ label: "Work Logs", path: "/Admin/worklogs", icon: "🗒️" },
	{ label: "Leaves", path: "/Admin/leaves", icon: "📝" },
	{ label: "Projects", path: "/Admin/projects", icon: "📂" },
	{ label: "Announcements", path: "/Admin/announcements", icon: "📢" },
	{ label: "Reports", path: "/Admin/reports", icon: "📈" },
	{ label: "Holidays", path: "/Admin/holidays", icon: "🎉" },
	{ label: "Documents", path: "/Admin/documents", icon: "📁" },
	{ label: "Settings", path: "/Admin/settings", icon: "⚙️" },
];

export default function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed left-0 top-0 z-10 flex h-screen w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-950 text-white">
			<div className="flex items-center gap-2 border-b border-slate-800 p-6">
				<div className="flex h-9 w-9 items-center justify-center rounded bg-indigo-500 text-lg font-semibold">
					A
				</div>
				<div>
					<Link href="/Admin/dashboard" className="text-white hover:text-indigo-300">
						<div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
							Core Nest CMS
						</div>
						<div className="text-sm font-semibold">Admin Panel</div>
					</Link>
				</div>
			</div>

			<nav className="flex-1 space-y-1 py-4">
				{adminNavItems.map((item) => (
					<AdminNavItem
						key={item.path}
						icon={item.icon}
						label={item.label}
						path={item.path}
						active={pathname === item.path}
					/>
				))}
			</nav>

			<div className="flex items-center gap-3 border-t border-slate-800 p-4 text-sm">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold">
					AD
				</div>
				<div>
					<div className="font-medium">Admin User</div>
					<p className="text-xs text-slate-400">admin@corenest.local</p>
				</div>
			</div>
		</aside>
	);
}

function AdminNavItem({
	icon,
	label,
	path,
	active = false,
}: {
	icon: string;
	label: string;
	path: string;
	active?: boolean;
}) {
	return (
		<Link
			href={path}
			className={`flex items-center gap-3 px-6 py-2.5 text-sm transition ${
				active
					? "border-l-4 border-indigo-500 bg-slate-800 text-white"
					: "text-slate-300 hover:bg-slate-800/60 hover:text-white"
			}`}
		>
			<span className="text-lg">{icon}</span>
			<span>{label}</span>
		</Link>
	);
}
