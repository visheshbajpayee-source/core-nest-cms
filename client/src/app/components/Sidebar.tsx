// 'use client';

// import React from 'react';
// import Link from "next/link";
// export default function Sidebar() {
//   return (
//     <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col">
//       <div className="p-6 flex items-center gap-2 border-b border-slate-700">
//         <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
//           <span className="text-xl">◆</span>
//         </div>
//         <div>
//           <div className="font-bold text-sm">Core Nest CMS</div>
//         </div>
//       </div>

//       <nav className="flex-1 py-4">
//         <NavItem icon="" label="Dashboard" active />

        
      
//         <NavItem icon="" label="Attendance"  />
//         <NavItem icon="" label="Leave" path="/leave"/>
//         <NavItem icon="" label="Daily Work Log" />
//         <NavItem icon="" label="Projects" />
//         <NavItem icon="" label="Announcements" />
//         <NavItem icon="" label="Reports" />
//         <NavItem icon="" label="Settings" />
//       </nav>

//       <div className="p-4 border-t border-slate-700 flex items-center gap-3">
//         <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
//           DS
//         </div>
//         <div className="text-sm">
//           <div className="font-medium">Disha Sharma</div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
//   return (
//     <a
//       href="#"
//       className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
//         active
//           ? 'bg-slate-700 border-l-4 border-teal-500 text-white'
//           : 'text-slate-300 hover:bg-slate-700 hover:text-white'
//       }`}
//     >
//       <span className="text-lg">{icon}</span>
//       <span>{label}</span>
//     </a>
//   );
// }


"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", path: "/employee/dashboard", icon: "🏠" },
    { label: "Attendance", path: "/employee/attendance", icon: "📅" },
    { label: "Leave", path: "/leave", icon: "📝" },
    { label: "Daily Work Log", path: "/employee/daily-work-log", icon: "🗒️" },
    { label: "Projects", path: "/employee/projects", icon: "📂" },
    { label: "Announcements", path: "/employee/announcements", icon: "📢" },
    { label: "Reports", path: "/employee/reports", icon: "📊" },
    { label: "Settings", path: "/employee/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-2 border-b border-slate-700">
        <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
          <span className="text-xl">◆</span>
        </div>
        <div>
          <div className="font-bold text-sm">Core Nest CMS</div>
        </div>
      </div>

      <nav className="flex-1 py-4">
<<<<<<< HEAD
        <NavItem icon="" label="Dashboard" active />
        <NavItem icon="" label="Leave"  />
        <NavItem icon="" label="Attendance" />
        <NavItem icon="" label="Daily Work Log" />
        <NavItem icon="" label="Projects" />
        <NavItem icon="" label="Announcements" />
        <NavItem icon="" label="Reports" />
        <NavItem icon="" label="Settings" />
=======
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
            active={pathname === item.path}
          />
        ))}
>>>>>>> 03dcb8f5ce2570cf0c473746a2371af56b853ff7
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
