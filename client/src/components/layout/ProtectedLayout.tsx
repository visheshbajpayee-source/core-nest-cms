"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/lib/logout";

const navItems = [
  { href: "/employee1/dashboard",    label: "Dashboard",     icon: "🏠" },
  { href: "/employee1/attendance",   label: "Attendance",    icon: "📅" },
  { href: "/employee1/leave",        label: "Leave",         icon: "📝" },
  { href: "/employee1/worklog",      label: "Work Log",      icon: "🗒️" },
  { href: "/employee1/projects",     label: "Projects",      icon: "📂" },
  { href: "/employee1/announcement", label: "Announcements", icon: "📢" },
  { href: "/employee1/reports",      label: "Reports",       icon: "📊" },
  // { href: "/employee1/profile",      label: "Profile",       icon: "👤" },
];

interface Props {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
      
  }, [router]);

  // Prevent flicker before redirect
  if (isAuthenticated === null) return null;

  return (
    <div className="min-h-screen overflow-x-hidden">
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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-transform duration-300
          ${ mobileOpen ? "translate-x-0" : "-translate-x-full" } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-slate-700 p-5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-500">
            <span className="text-lg">◆</span>
          </div>
          <span className="text-sm font-bold">Core Nest CMS</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded p-1 text-slate-400 hover:text-white lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
                pathname === item.href
                  ? "border-l-4 border-teal-500 bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold">
              E
            </div>
            <Link href="/employee1/profile" className="text-slate-300 hover:text-white">
              View Profile
            </Link>
          </div>
          <button
            type="button"
            onClick={() => logout("/login")}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-600 bg-slate-700/60 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-full pt-16 lg:ml-64 lg:pt-0 lg:w-[calc(100%-16rem)]">
        {children}
      </main>
    </div>
  );
}