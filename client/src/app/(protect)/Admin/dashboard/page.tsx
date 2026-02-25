"use client";

import React from "react";
import { AdminSidebar, DashboardContent } from "@/app/EmployeeComponents";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="ml-64 w-full">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of employee activity, attendance and focus.
          </p>
        </header>
        <DashboardContent />
      </main>
    </div>
  );
}
