"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/employee/dashboard", icon: "🏠" },
    { label: "Attendance", path: "/employee/attendance", icon: "📅" },
    { label: "Leave", path: "/employee/leave", icon: "📝" },
    { label: "Daily Work Log", path: "/employee/dailyWorkLog", icon: "🗒️" },
    { label: "Projects", path: "/employee/projects", icon: "📂" },
    { label: "Announcements", path: "/employee/announcements", icon: "📢" },
    { label: "Reports", path: "/employee/reports", icon: "📊" },
  ];

  const sidebarContent = (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex items-center gap-2 border-b border-slate-700 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-500">
          <span className="text-xl">◆</span>
        </div>
        <div className="flex-1">
          <Link href="/employee/dashboard" className="text-white hover:text-teal-300">
            <div className="text-sm font-bold">Core Nest CMS</div>
          </Link>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto rounded p-1 text-slate-400 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
            active={pathname === item.path}
            onNavigate={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-slate-700 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold">
          DS
        </div>
        <div className="text-sm">
          <Link href="/employee/profile" className="text-slate-300 hover:text-white">
            View Profile
          </Link>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white shadow-md lg:hidden"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop — mobile only */}
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
  onNavigate,
}: {
  icon: string;
  label: string;
  path: string;
  active?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={path}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
        active
          ? "border-l-4 border-teal-500 bg-slate-700 text-white"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

