"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminSidebar } from "../../components";

type EmployeeDetail = Record<string, unknown>;

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export default function AdminEmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const employeeLookupId = decodeURIComponent(params?.id ?? "");

  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [designationName, setDesignationName] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    fetch(`${API}/employees/${encodeURIComponent(employeeLookupId)}`, { headers })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to fetch employee details");

        const payload = (json?.data ?? null) as EmployeeDetail | null;
        setEmployee(payload);

        const deptId = typeof payload?.department === "string" ? payload.department : "";
        const desigId = typeof payload?.designation === "string" ? payload.designation : "";

        const requests: Promise<any>[] = [];
        if (deptId && /^[a-fA-F0-9]{24}$/.test(deptId)) {
          requests.push(fetch(`${API}/departments`, { headers }).then((r) => r.json()));
        } else {
          requests.push(Promise.resolve(null));
        }

        if (desigId && /^[a-fA-F0-9]{24}$/.test(desigId)) {
          requests.push(fetch(`${API}/designations`, { headers }).then((r) => r.json()));
        } else {
          requests.push(Promise.resolve(null));
        }

        const [deptRes, desigRes] = await Promise.all(requests);

        if (deptRes?.success && Array.isArray(deptRes.data) && deptId) {
          const found = deptRes.data.find((item: any) => (item.id ?? item._id) === deptId);
          setDepartmentName(found?.name ?? deptId);
        } else {
          setDepartmentName(deptId ?? "-");
        }

        if (desigRes?.success && Array.isArray(desigRes.data) && desigId) {
          const found = desigRes.data.find((item: any) => (item.id ?? item._id) === desigId);
          setDesignationName(found?.title ?? desigId);
        } else {
          setDesignationName(desigId ?? "-");
        }
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Failed to load employee details.");
      })
      .finally(() => setLoading(false));
  }, [employeeLookupId]);

  const detailEntries = useMemo(() => {
    if (!employee) return [] as Array<{ label: string; value: string }>;

    return Object.entries(employee).map(([key, rawValue]) => {
      if (key === "department" && departmentName && departmentName !== String(rawValue ?? "")) {
        return {
          label: toLabel(key),
          value: `${formatValue(rawValue, key)} (${departmentName})`,
        };
      }

      if (key === "designation" && designationName && designationName !== String(rawValue ?? "")) {
        return {
          label: toLabel(key),
          value: `${formatValue(rawValue, key)} (${designationName})`,
        };
      }

      return {
        label: toLabel(key),
        value: formatValue(rawValue, key),
      };
    });
  }, [employee, departmentName, designationName]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="w-full pt-16 lg:ml-4 lg:pt-0">
        <main className="p-4 sm:p-6 lg:py-8 lg:pr-8 lg:pl-0">
          <div className="mb-5">
            <Link href="/Admin/EmployeeDirectory" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              ← Back to Employee Directory
            </Link>
          </div>

          {loading ? (
            <div className="rounded-lg bg-white p-8 text-sm text-slate-500 shadow-sm">Loading employee details...</div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : !employee ? (
            <div className="rounded-lg bg-white p-8 text-sm text-slate-500 shadow-sm">Employee not found.</div>
          ) : (
            <div className="rounded-lg bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <h1 className="text-xl font-semibold text-slate-900">
                  {typeof employee.fullName === "string" ? employee.fullName : "Employee"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Employee ID: {typeof employee.employeeId === "string" ? employee.employeeId : "-"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
                {detailEntries.map((item) => (
                  <InfoItem key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value || "-"}</p>
    </div>
  );
}

function toLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value: unknown, key?: string): string {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "boolean") return value ? "True" : "False";

  if (typeof value === "number") return String(value);

  if (typeof value === "string") {
    const lowerKey = (key || "").toLowerCase();
    const shouldFormatAsDate = lowerKey.includes("date") || lowerKey.includes("at");

    if (shouldFormatAsDate) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleString();
      }
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.length ? JSON.stringify(value) : "[]";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
