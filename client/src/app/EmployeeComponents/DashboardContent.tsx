'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  GreetingCard,
  StatsCard,
  DailyWorkLog,
  CalendarWidget,
  MyFocus,
  NoticeBoard,
} from '.';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

type Summary = {
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  totalWorkHours: number;
  attendancePercentage: number;
};

type AttendanceRecord = {
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workHours: number | null;
  status: string;
};

type TaskRecord = {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
};

type AnnouncementRecord = {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
};

type HolidayRecord = {
  name: string;
  date: string;
};

type LeaveRecord = {
  status: 'pending' | 'approved' | 'rejected' | string;
};

type WorkLogRecord = {
  _id: string;
  date: string;
  taskTitle: string;
  taskDescription: string;
  hoursSpent: number;
  status: 'in_progress' | 'completed' | 'blocked';
};

type WorkLogEntry = {
  id: string;
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: number;
  status: 'In Progress' | 'Completed' | 'Blocked';
};

export default function DashboardContent() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [holidays, setHolidays] = useState<HolidayRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [worklogs, setWorklogs] = useState<WorkLogRecord[]>([]);
  const [userName, setUserName] = useState('Employee');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const today = now.toISOString().slice(0, 10);

    const requests = [
      fetch(`${API_BASE}/employees/me`, { headers }),
      fetch(`${API_BASE}/attendance/summary?month=${month}&year=${year}`, { headers }),
      fetch(`${API_BASE}/attendance/me?month=${month}&year=${year}`, { headers }),
      fetch(`${API_BASE}/tasks`, { headers }),
      fetch(`${API_BASE}/announcements`, { headers }),
      fetch(`${API_BASE}/holidays?year=${year}`, { headers }),
      fetch(`${API_BASE}/leaves`, { headers }),
      fetch(`${API_BASE}/worklogs?date=${today}`, { headers }),
    ];

    Promise.allSettled(requests).then(async (results) => {
      const parse = async <T,>(idx: number) => {
        const result = results[idx];
        if (result.status !== 'fulfilled') return null;
        const res = result.value;
        if (!res.ok) return null;
        return (await res.json()) as ApiResponse<T>;
      };

      const meRes = await parse<{ fullName?: string }>(0);
      const summaryRes = await parse<Summary>(1);
      const attendanceRes = await parse<AttendanceRecord[]>(2);
      const taskRes = await parse<TaskRecord[]>(3);
      const announcementRes = await parse<AnnouncementRecord[]>(4);
      const holidayRes = await parse<HolidayRecord[]>(5);
      const leaveRes = await parse<LeaveRecord[]>(6);
      const worklogRes = await parse<WorkLogRecord[]>(7);

      if (meRes?.data?.fullName) setUserName(meRes.data.fullName);
      if (summaryRes?.data) setSummary(summaryRes.data);
      if (attendanceRes?.data) setAttendance(attendanceRes.data);
      if (taskRes?.data) setTasks(taskRes.data);
      if (announcementRes?.data) setAnnouncements(announcementRes.data);
      if (holidayRes?.data) setHolidays(holidayRes.data);
      if (leaveRes?.data) setLeaves(leaveRes.data);
      if (worklogRes?.data) setWorklogs(worklogRes.data);
    });
  }, []);

  const taskItems = useMemo(() => {
    const priorityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return tasks
      .slice()
      .sort((a, b) => (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0))
      .slice(0, 3)
      .map((task) => ({
        text: task.title,
        type: task.priority === 'high' ? 'NEW' : undefined,
        label: task.status,
        team: 'Assigned Task',
        priority: task.priority === 'high' ? 'high' as const : 'normal' as const,
      }));
  }, [tasks]);

  const noticeItems = useMemo(() => {
    return announcements.slice(0, 3).map((announcement) => ({
      type: announcement.priority.toUpperCase(),
      text: announcement.title,
      detail: announcement.content,
    }));
  }, [announcements]);

  const holidayItems = useMemo(() => {
    return holidays.slice(0, 4).map((holiday) => {
      const holidayDate = new Date(holiday.date);
      const monthName = holidayDate.toLocaleString('default', { month: 'long' });
      return {
        date: `${monthName} ${holidayDate.getDate()}`,
        event: holiday.name,
      };
    });
  }, [holidays]);

  const leaveApproved = leaves.filter((leave) => leave.status === 'approved').length;
  const leaveTotal = leaves.length;

  const todayAttendance = useMemo(() => {
    const today = new Date().toDateString();
    return attendance.find((item) => new Date(item.date).toDateString() === today) ?? null;
  }, [attendance]);

  const todayStatus = todayAttendance?.checkInTime
    ? new Date(todayAttendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : todayAttendance?.status
      ? todayAttendance.status
      : 'Not Marked';

  const monthName = new Date(2000, (summary?.month ?? new Date().getMonth() + 1) - 1, 1).toLocaleString('default', {
    month: 'long',
  });

  const worklogEntries: WorkLogEntry[] = worklogs.map((item) => ({
    id: item._id,
    date: item.date,
    title: item.taskTitle,
    description: item.taskDescription,
    project: 'General',
    hoursSpent: item.hoursSpent,
    status:
      item.status === 'completed'
        ? 'Completed'
        : item.status === 'blocked'
          ? 'Blocked'
          : 'In Progress',
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <GreetingCard 
          userName={userName}
          attendancePercentage={summary?.attendancePercentage ?? 0}
          focusToday={taskItems[0]?.text ?? 'No assigned tasks yet'}
          quote='"The only way to do great work is to love what you do." - Steve Jobs'
        />
        <StatsCard 
          leaveLeft={`${leaveApproved}/${leaveTotal}`}
          remaining={`${summary?.absentDays ?? 0}`}
          todayStatus={todayStatus}
        />
      </div>

      {/* Daily Work Log & Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <DailyWorkLog initialEntries={worklogEntries} />
        <CalendarWidget
          month={monthName}
          year={summary?.year ?? new Date().getFullYear()}
          totalDays={new Date(summary?.year ?? new Date().getFullYear(), summary?.month ?? new Date().getMonth() + 1, 0).getDate()}
          currentDay={new Date().getDate()}
        />
      </div>

      {/* My Focus & Notice Board Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <MyFocus tasks={taskItems} />
        <NoticeBoard notices={noticeItems} holidays={holidayItems} />
      </div>
    </div>
  );
}
