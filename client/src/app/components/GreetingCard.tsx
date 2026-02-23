'use client';

import React from 'react';

interface GreetingCardProps {
  userName?: string;
  attendancePercentage?: number;
  focusToday?: string;
  quote?: string;
}

export default function GreetingCard({
  userName = 'Disha',
  attendancePercentage = 92,
  focusToday = 'Finalize 1s Marketing Plan',
  quote = '"The only way to do great work is to love what you do." - Steve Jobs',
}: GreetingCardProps) {
  const circumference = 2 * Math.PI * 56;
  const progressOffset = circumference * (attendancePercentage / 100);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Good Morning, {userName}!</h1>
      
      <div className="flex items-start gap-6">
        {/* Attendance Circle */}
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#14b8a6"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${progressOffset} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-800">{attendancePercentage}%</div>
            <div className="text-xs text-gray-500">Attendance</div>
          </div>
        </div>

        {/* Focus Section */}
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-700">Your focus today:</span>
            <div className="text-lg font-bold text-gray-800 mt-1">
              "{focusToday}"
            </div>
          </div>
          <p className="text-sm text-gray-500 italic mt-4">{quote}</p>
        </div>
      </div>
    </div>
  );
}
