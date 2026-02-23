'use client';

import React, { useState, useEffect } from 'react';

interface StatBoxProps {
  icon: string;
  label: string;
  value: string;
  color: 'teal' | 'orange' | 'purple';
}

function StatBox({ icon, label, value, color }: StatBoxProps) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="text-center">
      <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-bold text-gray-800">{value}</div>
    </div>
  );
}

interface StatsCardProps {
  leaveLeft?: string;
  remaining?: string;
  todayStatus?: string;
}

export default function StatsCard({
  leaveLeft = '5/12',
  remaining = '3',
  todayStatus = '08:30 AM',
}: StatsCardProps) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatBox icon="📋" label="Leave Left" value={leaveLeft} color="teal" />
        <StatBox icon="🕐" label="Today's Status" value={todayStatus} color="purple" />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-xs text-gray-500 mb-1">Time Elapsed</div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
          </svg>
          <div className="text-2xl font-mono font-bold text-gray-800">{formatTimer(timer)}</div>
        </div>
      </div>
    </div>
  );
}