'use client';

import React from 'react';
import AttendanceCircle from '../ReusableComponents/AttendanceCircle';

interface GreetingCardProps {
  userName?: string;
  attendancePercentage?: number;
  focusToday?: string;
  quote?: string;
}

export default function GreetingCard({
  userName = 'Disha',
  attendancePercentage = 25,
  focusToday = 'Finalize 1s Marketing Plan',
  quote = '"The only way to do great work is to love what you do." - Steve Jobs',
}: GreetingCardProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 sm:p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4 sm:text-2xl sm:mb-6">
        Good Morning, {userName}!
      </h1>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Attendance Circle — reusable component */}
        <AttendanceCircle
          percentage={attendancePercentage}
          size={128}
          label="Attendance"
          animate
          showTooltip
        />

        {/* Focus Section */}
        <div className="flex-1 text-center sm:text-left">
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-700">Your focus today:</span>
            <div className="text-base font-bold text-gray-800 mt-1 sm:text-lg">
              "{focusToday}"
            </div>
          </div>
          <p className="text-sm text-gray-500 italic mt-3 sm:mt-4">{quote}</p>
        </div>
      </div>
    </div>
  );
}

