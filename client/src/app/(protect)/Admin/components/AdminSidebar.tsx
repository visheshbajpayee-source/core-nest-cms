"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/logout";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useSidebarCollapsed } from "@/components/layout/useSidebarCollapsed";

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
	const [mobileOpen, setMobileOpen] = useState(false);
	const { collapsed, toggle } = useSidebarCollapsed();

	const sidebar = (
		<aside
			className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-linear-to-b from-slate-900 to-slate-950 text-white transition-[width,transform] duration-300
				${collapsed ? "w-18" : "w-64"}
				${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
		>
			<div className={`flex items-center gap-2 border-b border-slate-800 ${collapsed ? "justify-center p-3" : "p-6"}`}>
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-indigo-500 text-lg font-semibold">
					A
				</div>
				{!collapsed && (
					<div className="flex-1 min-w-0">
						<Link href="/Admin/dashboard" className="text-white hover:text-indigo-300">
							<div className="text-xs font-semibold uppercase tracking-wide text-slate-300 truncate">
								Core Nest CMS
							</div>
							<div className="text-sm font-semibold truncate">Admin Panel</div>
						</Link>
					</div>
				)}
				{!collapsed && (
					<button
						onClick={() => setMobileOpen(false)}
						aria-label="Close menu"
						className="ml-auto rounded p-1 text-slate-400 hover:text-white lg:hidden"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</div>

			<nav className={`flex-1 space-y-1 overflow-y-auto py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${collapsed ? "px-2" : ""}`}>
				{adminNavItems.map((item) => (
					<AdminNavItem
						key={item.path}
						icon={item.icon}
						label={item.label}
						path={item.path}
						active={pathname === item.path}
						collapsed={collapsed}
						onNavigate={() => setMobileOpen(false)}
					/>
				))}
			</nav>

			<div className={`border-t border-slate-800 text-sm ${collapsed ? "p-2" : "p-4"}`}>
				{collapsed ? (
					<div className="flex flex-col items-center gap-2">
						<ThemeToggle compact />
						<div
							title="Admin User"
							className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold"
						>
							AD
						</div>
						<button
							type="button"
							onClick={() => logout("/login")}
							title="Log Out"
							aria-label="Log Out"
							className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-slate-200 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
						</button>
					</div>
				) : (
					<>
						<div className="mb-3 flex items-center justify-between">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
								Appearance
							</span>
							<ThemeToggle />
						</div>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold">
								AD
							</div>
							<div className="min-w-0">
								<div className="font-medium truncate">Admin User</div>
								<p className="text-xs text-slate-400 truncate">admin@corenest.local</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => logout("/login")}
							className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							Log Out
						</button>
					</>
				)}
			</div>

			<button
				type="button"
				onClick={toggle}
				aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				title={collapsed ? "Expand" : "Collapse"}
				className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-md transition hover:text-indigo-300 lg:flex"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2.2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className={`h-3.5 w-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
			</button>
		</aside>
	);

	return (
		<>
			<button
				onClick={() => setMobileOpen(true)}
				className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md lg:hidden"
				aria-label="Open menu"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>

			{mobileOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{sidebar}
		</>
	);
}

function AdminNavItem({
	icon,
	label,
	path,
	active = false,
	collapsed = false,
	onNavigate,
}: {
	icon: string;
	label: string;
	path: string;
	active?: boolean;
	collapsed?: boolean;
	onNavigate?: () => void;
}) {
	return (
		<Link
			href={path}
			onClick={onNavigate}
			title={collapsed ? label : undefined}
			className={`flex items-center gap-3 text-sm transition ${
				collapsed ? "justify-center rounded-md px-0 py-2.5" : "px-6 py-2.5"
			} ${
				active
					? collapsed
						? "bg-slate-800 text-white"
						: "border-l-4 border-indigo-500 bg-slate-800 text-white"
					: "text-slate-300 hover:bg-slate-800/60 hover:text-white"
			}`}
		>
			<span className="text-lg">{icon}</span>
			{!collapsed && <span className="truncate">{label}</span>}
		</Link>
	);
}
