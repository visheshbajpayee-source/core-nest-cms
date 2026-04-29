'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  GreetingCard,
  StatsCard,
  DailyWorkLog,
  CalendarWidget,
  MyFocus,
  NoticeBoard,
} from './components';
import api from '@/app/lib/api';

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

type EmployeeProfile = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  department: string;
  departmentId?: string;
  designation: string;
  designationId?: string;
  dateOfJoining: string;
  employeeId: string;
  status: string;
  profilePicture?: string;
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

type LeaveTypeRecord = {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  maxDaysPerYear: number;
  isActive: boolean;
};

type LeaveRecord = {
  leaveType?: string | { _id?: string; id?: string; code?: string; name?: string };
  totalDays?: number;
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
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [holidays, setHolidays] = useState<HolidayRecord[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [worklogs, setWorklogs] = useState<WorkLogRecord[]>([]);
  const [userName, setUserName] = useState('Employee');

  const isObjectIdLike = (value?: string) => /^[a-fA-F0-9]{24}$/.test((value ?? '').trim());

  const resolveDepartmentName = async (id: string) => {
    try {
      const response = await api.get(`/api/v1/departments/${id}`);
      const data = response.data as ApiResponse<{ name?: string }>;
      return data?.data?.name ?? null;
    } catch { return null; }
  };

  const resolveDesignationTitle = async (id: string) => {
    try {
      const response = await api.get(`/api/v1/designations/${id}`);
      const data = response.data as ApiResponse<{ title?: string }>;
      return data?.data?.title ?? null;
    } catch { return null; }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const requests = [
      api.get(`/api/v1/employees/me`),
      api.get(`/api/v1/attendance/summary`, { params: { month, year } }),
      api.get(`/api/v1/attendance/me`, { params: { month, year } }),
      api.get(`/api/v1/tasks`),
      api.get(`/api/v1/announcements`),
      api.get(`/api/v1/holidays`, { params: { year } }),
      api.get(`/api/v1/leave-types`),
      api.get(`/api/v1/leaves`),
      api.get(`/api/v1/worklogs`),
    ];

    Promise.allSettled(requests).then(async (results) => {
      const parse = <T,>(idx: number): ApiResponse<T> | null => {
        const result = results[idx];
        if (result.status !== 'fulfilled') return null;
        return result.value.data as ApiResponse<T>;
      };

      const meRes = parse<EmployeeProfile>(0);
      const summaryRes = parse<Summary>(1);
      const attendanceRes = parse<AttendanceRecord[]>(2);
      const taskRes = parse<TaskRecord[]>(3);
      const announcementRes = parse<AnnouncementRecord[]>(4);
      const holidayRes = parse<HolidayRecord[]>(5);
      const leaveTypesRes = parse<LeaveTypeRecord[]>(6);
      const leaveRes = parse<LeaveRecord[]>(7);
      const worklogRes = parse<WorkLogRecord[]>(8);

      if (meRes?.data) {
        const employee = { ...meRes.data };
        const deptLookupId = isObjectIdLike(employee.department) ? employee.department : employee.departmentId;
        const desigLookupId = isObjectIdLike(employee.designation) ? employee.designation : employee.designationId;

        if (deptLookupId && isObjectIdLike(deptLookupId)) {
          const name = await resolveDepartmentName(deptLookupId);
          if (name) employee.department = name;
        }
        if (desigLookupId && isObjectIdLike(desigLookupId)) {
          const title = await resolveDesignationTitle(desigLookupId);
          if (title) employee.designation = title;
        }

        setProfile(employee);
        if (employee.fullName) setUserName(employee.fullName);
      }

      if (summaryRes?.data) setSummary(summaryRes.data);
      if (attendanceRes?.data) setAttendance(attendanceRes.data);
      if (taskRes?.data) setTasks(taskRes.data);
      if (announcementRes?.data) setAnnouncements(announcementRes.data);
      if (holidayRes?.data) setHolidays(holidayRes.data);
      if (leaveTypesRes?.data) setLeaveTypes(leaveTypesRes.data);
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
  const leavePending = leaves.filter((leave) => leave.status === 'pending').length;
  const leaveRejected = leaves.filter((leave) => leave.status === 'rejected').length;
  const leaveTotal = leaves.length;

  const leaveTotalDaysAllowed = useMemo(
    () => leaveTypes.reduce((sum, leaveType) => sum + (leaveType.maxDaysPerYear ?? 0), 0),
    [leaveTypes]
  );

  const leaveUsedDays = useMemo(
    () => leaves
      .filter((leave) => leave.status === 'approved')
      .reduce((sum, leave) => sum + (leave.totalDays ?? 0), 0),
    [leaves]
  );

  const leaveLeftDays = Math.max(leaveTotalDaysAllowed - leaveUsedDays, 0);

  const completedTasks = tasks.filter((task) => task.status?.toLowerCase() === 'completed').length;
  const pendingTasks = tasks.filter((task) => task.status?.toLowerCase() !== 'completed').length;

  const todayAttendance = useMemo(() => {
    const today = new Date().toDateString();
    return attendance.find((item) => new Date(item.date).toDateString() === today) ?? null;
  }, [attendance]);

  const todayWorkHours = todayAttendance?.workHours ?? 0;

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

    const attendanceByDay = useMemo(() => {
      const map: Record<number, string> = {};
      attendance.forEach((item) => {
        const dateObj = new Date(item.date);
        if (!Number.isNaN(dateObj.getTime())) {
          map[dateObj.getDate()] = item.status;
        }
      });
      return map;
    }, [attendance]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header Section */}
      {/* <h1 className="text-2xl font-bold mb-4"> I M under Employee Dashboard </h1> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <GreetingCard 
          userName={userName}
          attendancePercentage={summary?.attendancePercentage ?? 0}
          focusToday={taskItems[0]?.text ?? 'No assigned tasks yet'}
          quote='"The only way to do great work is to love what you do." - Steve Jobs'
        />
        <StatsCard 
          leaveLeft={`${leaveLeftDays}/${leaveTotalDaysAllowed}`}
          remaining={`${leavePending}`}
          todayStatus={todayStatus}
        />
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Leave Summary:</span>{' '}
        Left <span className="font-semibold">{leaveLeftDays}</span> / Total <span className="font-semibold">{leaveTotalDaysAllowed}</span>{' '}
        · Approved Requests: <span className="font-semibold">{leaveApproved}</span>
        · Pending: <span className="font-semibold">{leavePending}</span>
        · Rejected: <span className="font-semibold">{leaveRejected}</span>
      </div>

      {/* Daily Work Log & Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <DailyWorkLog initialEntries={worklogEntries} />
        <CalendarWidget
          month={monthName}
          year={summary?.year ?? new Date().getFullYear()}
          totalDays={new Date(summary?.year ?? new Date().getFullYear(), summary?.month ?? new Date().getMonth() + 1, 0).getDate()}
          currentDay={new Date().getDate()}
          attendanceByDay={attendanceByDay}
        />
      </div>

      {/* My Focus & Notice Board Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <MyFocus tasks={taskItems} />
        <NoticeBoard notices={noticeItems} holidays={holidayItems} />
      </div>

      <div className="mt-4 text-xs text-slate-500">
        API-backed fields shown above: profile, attendance summary, today attendance, tasks, announcements, holidays, leaves, and today worklogs.
        No dedicated backend API found for "unread announcements" or "team progress %" on this dashboard.
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}
