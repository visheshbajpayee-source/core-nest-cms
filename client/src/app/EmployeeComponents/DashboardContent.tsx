'use client';

import React from 'react';
import {
  GreetingCard,
  StatsCard,
  DailyWorkLog,
  CalendarWidget,
  MyFocus,
  NoticeBoard,
} from '.';

export default function DashboardContent() {
  const myTasks = [
    { text: 'Review pending page wireframes', type: 'NEW', label: 'Due Today', priority: 'high' as const },
    { text: 'Schedule team sync', team: 'ID-Priv-Latest', priority: 'normal' as const },
    { text: 'Research competitor analysis', team: 'ID-Priv-Latest', priority: 'normal' as const },
  ];

  const notices = [
    { type: 'URGENT', text: 'Server Maintenance Tonight', detail: 'Company Holiday - Dec 25th - Happens by Friday' },
  ];

  const holidays = [
    { date: 'November 25', event: 'Diwali Celebration' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <GreetingCard 
          userName="Disha"
          attendancePercentage={90}
          focusToday="Finalize 1s Marketing Plan"
          quote='"The only way to do great work is to love what you do." - Steve Jobs'
        />
        <StatsCard 
          leaveLeft="5/12"
          remaining="3"
          todayStatus="08:30 AM"
        />
      </div>

      {/* Daily Work Log & Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <DailyWorkLog />
        <CalendarWidget month="November" year={2024} totalDays={30} currentDay={18} />
      </div>

      {/* My Focus & Notice Board Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <MyFocus tasks={myTasks} />
        <NoticeBoard notices={notices} holidays={holidays} />
      </div>
    </div>
  );
}
