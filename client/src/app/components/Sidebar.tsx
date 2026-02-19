'use client';

import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-2 border-b border-slate-700">
        <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
          <span className="text-xl">◆</span>
        </div>
        <div>
          <div className="font-bold text-sm">Core Nest CMS</div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        <NavItem icon="" label="Dashboard" active />
        <NavItem icon="" label="Employee Directory" />
        <NavItem icon="" label="Attendance" />
        <NavItem icon="" label="Daily Work Log" />
        <NavItem icon="" label="Projects" />
        <NavItem icon="" label="Announcements" />
        <NavItem icon="" label="Reports" />
        <NavItem icon="" label="Settings" />
      </nav>

      <div className="p-4 border-t border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
          DS
        </div>
        <div className="text-sm">
          <div className="font-medium">Disha Sharma</div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
        active
          ? 'bg-slate-700 border-l-4 border-teal-500 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
