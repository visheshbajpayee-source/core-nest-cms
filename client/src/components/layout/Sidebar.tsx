"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useSidebarCollapsed } from "./useSidebarCollapsed";

type IconName =
  | "dashboard"
  | "attendance"
  | "leave"
  | "worklog"
  | "projects"
  | "announcements"
  | "reports";

type NavEntry = {
  label: string;
  path: string;
  icon: IconName;
};

const navItems: NavEntry[] = [
  { label: "Dashboard", path: "/employee/dashboard", icon: "dashboard" },
  { label: "Attendance", path: "/employee/attendance", icon: "attendance" },
  { label: "Leave", path: "/employee/leave", icon: "leave" },
  { label: "Daily Work Log", path: "/employee/dailyWorkLog", icon: "worklog" },
  { label: "Projects", path: "/employee/projects", icon: "projects" },
  { label: "Announcements", path: "/employee/announcements", icon: "announcements" },
  { label: "Reports", path: "/employee/reports", icon: "reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggle } = useSidebarCollapsed();

  const sidebarContent = (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white text-slate-700 shadow-xl transition-[width,transform] duration-300 dark:border-slate-800 dark:bg-linear-to-b dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 dark:shadow-none
        ${collapsed ? "w-18" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div
        className={`flex items-center gap-3 border-b border-slate-200 py-5 dark:border-slate-800 ${
          collapsed ? "justify-center px-2" : "px-5"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-teal-400 to-emerald-600 text-white shadow-md shadow-teal-500/30">
          <span className="text-lg leading-none">◆</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <Link
              href="/employee/dashboard"
              className="text-slate-900 transition hover:text-teal-600 dark:text-white dark:hover:text-teal-300"
            >
              <div className="text-sm font-bold tracking-tight truncate">Core Nest CMS</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Employee Portal
              </div>
            </Link>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded p-1 text-slate-400 transition hover:text-slate-700 dark:hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <nav
        className={`flex-1 space-y-1 overflow-y-auto py-4 ${collapsed ? "px-2" : "px-3"}`}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
            active={pathname === item.path}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      <div className={`border-t border-slate-200 dark:border-slate-800 ${collapsed ? "p-2" : "p-4"}`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <ThemeToggle compact />
            <Link
              href="/employee/profile"
              title="View Profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm"
            >
              DS
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Appearance
              </span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                DS
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <Link
                  href="/employee/profile"
                  className="block truncate font-medium text-slate-700 transition hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-300"
                >
                  View Profile
                </Link>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Account settings
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <CollapseHandle collapsed={collapsed} onToggle={toggle} />
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-md ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700 lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {sidebarContent}
    </>
  );
}

function NavItem({
  icon,
  label,
  path,
  active = false,
  collapsed = false,
  onNavigate,
}: {
  icon: IconName;
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
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
      } ${
        active
          ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-teal-500 transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
      <NavIcon
        name={icon}
        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
          active
            ? "text-teal-600 dark:text-teal-300"
            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-200"
        }`}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

function CollapseHandle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand" : "Collapse"}
      className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-teal-300 lg:flex"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-3.5 w-3.5 transition-transform duration-300 ${
          collapsed ? "rotate-180" : ""
        }`}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function NavIcon({ name, className }: { name: IconName; className?: string }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "attendance":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="M9 15l2 2 4-4" />
        </svg>
      );
    case "leave":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M9 14h6M9 18h4" />
        </svg>
      );
    case "worklog":
      return (
        <svg {...common}>
          <path d="M4 4h12l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path d="M16 4v4h4M7 12h10M7 16h7" />
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      );
    case "announcements":
      return (
        <svg {...common}>
          <path d="M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1z" />
          <path d="M16 8a5 5 0 010 8" />
        </svg>
      );
    case "reports":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
  }
}
