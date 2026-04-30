"use client";

import React, { useState } from "react";
import AttendanceHistory  from "./AttendanceHistory";
import AttendanceRecord from "./AttendanceRecord";
import AttendanceCalender from "./AttendanceCalender";
import CompanyPolicy from "./CompanyPolicy";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="flex-1 w-full p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
              My Attendance
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Track your daily attendance records and performance. Click on a date in the calendar to view details.
            </p>
          </div>

          <AttendanceRecord />
          <AttendanceHistory selectedDate={selectedDate} />  
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          <AttendanceCalender onDateSelect={setSelectedDate} selectedDate={selectedDate} />
   
             <CompanyPolicy />
          </div>
        </div>
      </div>
    </div>
  );
}
