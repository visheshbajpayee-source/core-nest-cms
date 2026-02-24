

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", path: "/employee/dashboard", icon: "🏠" },
    { label: "Attendance", path: "/employee/attendance", icon: "📅" },
    { label: "Leave", path: "/employee/leave", icon: "📝" },
    { label: "Daily Work Log", path: "/employee/dailyWorkLog", icon: "🗒️" },
    { label: "Projects", path: "/employee/projects", icon: "📂" },
    { label: "Announcements", path: "/employee/announcements", icon: "📢" },
    // { label: "Reports", path: "/employee/reports", icon: "📊" },
    // { label: "Settings", path: "/employee/settings", icon: "⚙️" },
    // { label: "Profile", path: "/employee/profile", icon: "👤" },
  ];

  
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col z-10">
      <div className="p-6 flex items-center gap-2 border-b border-slate-700">
        <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
          <span className="text-xl">◆</span>
        </div>
        <div>
          <Link href="/employee/dashboard" className="text-white hover:text-teal-300">
            <div className="font-bold text-sm">Core Nest CMS</div>
          </Link>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
            active={pathname === item.path}
          />
        ))}
      </nav>

      <Link href="/employee/Profile">
        <div className="p-4 border-t border-slate-700 flex items-center gap-3 hover:bg-slate-700 transition cursor-pointer">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
            DS
          </div>
          <div className="text-sm">
            <div className="font-medium">Disha Sharma</div>
          </div>
        </div>
      </Link>

      <div className="text-sm px-6 py-3">
        {/* <div className="font-medium">Disha Sharma</div> */}
        <Link href="/employee/profile" className="text-slate-300 hover:text-white">View Profile</Link> 
      </div>
    </aside>
  );
}

function NavItem({
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
      className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
        active
          ? "bg-slate-700 border-l-4 border-teal-500 text-white"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
