"use client";
import React, { useState, useEffect, useRef } from "react";
import { getAttendanceHistory, AttendanceRecord } from "../services/attendence";

export default function Attendance() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1–12
  const currentYear = now.getFullYear();

  const startYear = 2026;
  const futureYears = 5;

  const months: string[] = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const monthsShort: string[] = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const years: number[] = Array.from(
    { length: currentYear - startYear + 1 + futureYears },
    (_, i) => startYear + i
  );

const [dateFilter, setDateFilter] = useState({
  month: currentMonth,
  year: currentYear,
});
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);
  const yearPickerRef = useRef<HTMLDivElement>(null);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setShowMonthPicker(false);
      }
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target as Node)) {
        setShowYearPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Fetch attendance for selected month/year
const fetchAttendance = async (m: number, y: number) => {
  try {
    const response = await getAttendanceHistory({
      month: String(m).padStart(2, "0"),
      year: String(y),
    });

    console.log("Fetched attendance history:", response);
    
    if (response.success && Array.isArray(response.data)) {
      setAttendanceHistory(response.data);
      console.log("Set attendance history with", response.data.length, "records");
    } else {
      console.warn("Invalid response format:", response);
      setAttendanceHistory([]);
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);
    setAttendanceHistory([]);
  }
};

  // 🔹 First time load → fetch current month/year
  useEffect(() => {
    fetchAttendance(currentMonth, currentYear);
  }, []);

  // 🔹 Apply button handler
  const handleApply = () => {
    console.log(dateFilter.month, dateFilter.year);
    fetchAttendance(dateFilter.month, dateFilter.year);
  };

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 md:p-6 border border-gray-100 mb-6 sm:mb-8 transition-all duration-300">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
          
          {/* Month Picker */}
          <div className="flex-1 relative" ref={monthPickerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <button
              onClick={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
              className="w-full border border-gray-300 p-2.5 sm:p-3 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white cursor-pointer text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span>{months[dateFilter.month - 1]}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMonthPicker && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                <div className="grid grid-cols-3 gap-2">
                  {monthsShort.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDateFilter({...dateFilter, month: i + 1});
                        setShowMonthPicker(false);
                      }}
                      className={`p-2 text-sm rounded hover:bg-gray-100 ${
                        dateFilter.month === i + 1 
                          ? 'bg-gray-800 text-white hover:bg-gray-900' 
                          : 'text-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setDateFilter({...dateFilter, month: currentMonth});
                      setShowMonthPicker(false);
                    }}
                    className="flex-1 text-xs py-1.5 px-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    This month
                  </button>
                  <button
                    onClick={() => setShowMonthPicker(false)}
                    className="flex-1 text-xs py-1.5 px-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Year Picker */}
          <div className="flex-1 relative" ref={yearPickerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <button
              onClick={() => {
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
              className="w-full border border-gray-300 p-2.5 sm:p-3 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white cursor-pointer text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span>{dateFilter.year}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showYearPicker && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                <div className="max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {years.map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          setDateFilter({...dateFilter, year: y});
                          setShowYearPicker(false);
                        }}
                        className={`p-2 text-sm rounded hover:bg-gray-100 ${
                          dateFilter.year === y 
                            ? 'bg-gray-800 text-white hover:bg-gray-900' 
                            : 'text-gray-700'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setDateFilter({...dateFilter, year: currentYear});
                      setShowYearPicker(false);
                    }}
                    className="flex-1 text-xs py-1.5 px-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    This year
                  </button>
                  <button
                    onClick={() => setShowYearPicker(false)}
                    className="flex-1 text-xs py-1.5 px-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:mt-6">
          <button
            onClick={handleApply}
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium text-sm sm:text-base"
          >
            Apply
          </button>

       
        </div>
      </div>

      {/* Empty State */}
      {attendanceHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No attendance records found</p>
          <p className="text-gray-400 text-sm mt-1">Try selecting a different month or year</p>
        </div>
      )}

      {/* Mobile Cards View */}
      {attendanceHistory.length > 0 && (
        <div className="block sm:hidden space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {attendanceHistory.map((record, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="font-semibold text-slate-800 text-sm">{record.date}</div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  record.status === "Present"
                    ? "bg-green-100 text-green-700"
                    : record.status === "Late"
                    ? "bg-yellow-100 text-yellow-700"
                    : record.status === "Absent"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {record.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500 font-medium">Check In:</span>
                <div className="text-slate-800 font-semibold">{record.checkIn || "—"}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Check Out:</span>
                <div className="text-slate-800 font-semibold">{record.checkOut || "—"}</div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 font-medium">Work Hours:</span>
                <div className="text-slate-800 font-semibold">{record.workHours || "—"}</div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Desktop Table View */}
      {attendanceHistory.length > 0 && (
        <div className="hidden sm:block overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
        <table className="min-w-full text-sm lg:text-base">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 text-slate-700">
              <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left font-semibold">Date</th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left font-semibold">Check In</th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left font-semibold">Check Out</th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left font-semibold">Work Hours</th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map((record, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 font-medium text-slate-800">{record.date}</td>
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700">{record.checkIn || "—"}</td>
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700">{record.checkOut || "—"}</td>
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700 font-semibold">{record.workHours || "—"}</td>
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : record.status === "Late"
                        ? "bg-yellow-100 text-yellow-700"
                        : record.status === "Absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
    </>
  );
}