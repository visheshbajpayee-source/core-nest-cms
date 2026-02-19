'use client';

import React from 'react';
import {
  GreetingCard,
  StatsCard,
  DailyWorkLog,
  CalendarWidget,
  MyFocus,
  NoticeBoard,
} from './dashboard';

export default function DashboardContent() {
  const workLogEntries = [
    { time: '09:00', task: 'Daily Standup', team: 'Alpha Project', status: 'Completed' as const },
    { time: '09:30', task: 'Q3 Marketing Plan', team: '3.0', status: 'In Progress' as const },
  ];

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

  const handleAddLog = () => {
    console.log('Add log clicked');
    // Add your logic here
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GreetingCard 
          userName="Disha"
          attendancePercentage={92}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DailyWorkLog entries={workLogEntries} onAddLog={handleAddLog} />
        <CalendarWidget month="November" year={2024} totalDays={30} currentDay={18} />
      </div>

      {/* My Focus & Notice Board Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyFocus tasks={myTasks} />
        <NoticeBoard notices={notices} holidays={holidays} />
      </div>
    </div>
  );
}
