"use client";

import React, { useState, useEffect } from "react";
import { getLeaveHistory, LeaveRecord } from "../../services/employeeLeaves/leaves";

interface LeaveHistoryProps {
  history?: Array<{
    type: string;
    from: string;
    to: string;
    days: number;
    status: "Approved" | "Pending" | "Rejected";
    applied: string;
  }>;
}

export default function LeaveHistory({ history: externalHistory }: LeaveHistoryProps) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const startYear = 2026;
  const futureYears = 5;

  const months: string[] = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const years: number[] = Array.from(
    { length: currentYear - startYear + 1 + futureYears },
    (_, i) => startYear + i
  );

  const [dateFilter, setDateFilter] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const [leaveHistory, setLeaveHistory] = useState<LeaveRecord[]>([]);

  const fetchLeaves = async (m: number, y: number) => {
    try {
       

      const response = await getLeaveHistory("12", {
        month: String(m),
        year: String(y),
      });

      if (response.success) {
        console.log("Setting leave history with data:", response.data);
        setLeaveHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    
      fetchLeaves(currentMonth, currentYear);
    
  }, [externalHistory]);

  const handleApply = () => {
    fetchLeaves(dateFilter.month, dateFilter.year);
  };



  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 md:p-6 border border-gray-100 mb-6 sm:mb-8 transition-all duration-300">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">

        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 flex-1">

          {/* Month */}
          <select
            value={dateFilter.month}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, month: Number(e.target.value) })
            }
            className="border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex-1"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

          {/* Year */}
          <select
            value={dateFilter.year}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, year: Number(e.target.value) })
            }
            className="border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex-1"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleApply}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Apply
        </button>
      </div>

      {/* 🔹 Mobile Cards View */}
      <div className="block sm:hidden space-y-3">
        {leaveHistory.map((record, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="font-semibold text-slate-800 text-sm capitalize">
                {record.leaveType}
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  record.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : record.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {record.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500 font-medium">From:</span>
                <div className="text-slate-800">
                  {new Date(record.startDate).toLocaleDateString()}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-medium">To:</span>
                <div className="text-slate-800">
                  {new Date(record.endDate).toLocaleDateString()}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-medium">Days:</span>
                <div className="text-slate-800 font-semibold">
                  {record.numberOfDays}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-medium">Applied:</span>
                <div className="text-slate-800">
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm lg:text-base">
          <thead>
            <tr className="bg-slate-50 text-slate-700">
              <th className="py-3 px-4 text-left font-semibold">Leave Type</th>
              <th className="py-3 px-4 text-left font-semibold">From</th>
              <th className="py-3 px-4 text-left font-semibold">To</th>
              <th className="py-3 px-4 text-left font-semibold">Days</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Applied Date</th>
            </tr>
          </thead>

          <tbody>
            {leaveHistory.map((record, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <td className="py-3 px-4 font-medium text-slate-800 capitalize">
                  {record.leaveType}
                </td>

                <td className="py-3 px-4 text-slate-700">
                  {new Date(record.startDate).toLocaleDateString()}
                </td>

                <td className="py-3 px-4 text-slate-700">
                  {new Date(record.endDate).toLocaleDateString()}
                </td>

                <td className="py-3 px-4 text-slate-700 font-semibold">
                  {record.numberOfDays}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      record.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : record.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-700">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}