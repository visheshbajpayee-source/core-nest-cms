'use client';

import React, { useEffect, useState } from 'react';
import {
  getOwnProfile,
  getAttendanceSummary,
  getMyLeaves,
  getMyTasks,
  getMyWorklogs,
  type AttendanceSummary,
  type LeaveRequest,
  type Task,
  type Worklog,
} from '@/app/services';

interface ReportData {
  profile: any;
  attendance: AttendanceSummary | null;
  leaves: LeaveRequest[];
  tasks: Task[];
  worklogs: Worklog[];
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    profile: null,
    attendance: null,
    leaves: [],
    tasks: [],
    worklogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const [profile, attendance, leaves, tasks, worklogs] = await Promise.all([
          getOwnProfile(),
          getAttendanceSummary(month, year),
          getMyLeaves(),
          getMyTasks(),
          getMyWorklogs(),
        ]);

        setReportData({
          profile,
          attendance,
          leaves: leaves || [],
          tasks: tasks || [],
          worklogs: worklogs || [],
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-semibold">Error Loading Reports</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const leaveStats = {
    total: reportData.leaves.length,
    approved: reportData.leaves.filter((l) => l.status === 'approved').length,
    pending: reportData.leaves.filter((l) => l.status === 'pending').length,
    rejected: reportData.leaves.filter((l) => l.status === 'rejected').length,
  };

  const taskStats = {
    total: reportData.tasks.length,
    completed: reportData.tasks.filter((t) => t.status === 'completed').length,
    pending: reportData.tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length,
    blocked: reportData.tasks.filter((t) => t.status === 'blocked').length,
  };

  const totalWorkHours = reportData.worklogs.reduce((sum, log) => sum + (log.hoursSpent || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 text-sm mt-1">
          Performance and activity overview for {reportData.profile?.fullName || 'Employee'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">Attendance</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {reportData.attendance?.attendancePercentage?.toFixed(1) || 0}%
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {reportData.attendance?.presentDays || 0} / {reportData.attendance?.workingDays || 0} days
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div>
            <p className="text-gray-700 text-sm font-medium">Task Completion</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {taskStats.total > 0 ? ((taskStats.completed / taskStats.total) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {taskStats.completed} / {taskStats.total} tasks completed
            </p>
          </div>
        </div>

        {/* Work Hours Card */}
        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div>
            <p className="text-gray-700 text-sm font-medium">Total Work Hours</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{totalWorkHours.toFixed(1)}</p>
            <p className="text-xs text-gray-600 mt-2">This month</p>
          </div>
        </div>

        {/* Leave Balance Card */}
        <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div>
            <p className="text-gray-700 text-sm font-medium">Leave Status</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{leaveStats.pending}</p>
            <p className="text-xs text-gray-600 mt-2">Pending approvals</p>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-700">Total Requests</span>
              <span className="font-semibold text-gray-900">{leaveStats.total}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Approved
              </span>
              <span className="font-semibold text-green-600">{leaveStats.approved}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                Pending
              </span>
              <span className="font-semibold text-yellow-600">{leaveStats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Rejected
              </span>
              <span className="font-semibold text-red-600">{leaveStats.rejected}</span>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-700">Total Tasks</span>
              <span className="font-semibold text-gray-900">{taskStats.total}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Completed
              </span>
              <span className="font-semibold text-green-600">{taskStats.completed}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                In Progress
              </span>
              <span className="font-semibold text-blue-600">{taskStats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Blocked
              </span>
              <span className="font-semibold text-red-600">{taskStats.blocked}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      {reportData.attendance && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-600">Working Days</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {reportData.attendance.workingDays}
              </p>
            </div>
            <div className="bg-green-50 rounded p-4">
              <p className="text-sm text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {reportData.attendance.presentDays}
              </p>
            </div>
            <div className="bg-red-50 rounded p-4">
              <p className="text-sm text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {reportData.attendance.absentDays}
              </p>
            </div>
            <div className="bg-blue-50 rounded p-4">
              <p className="text-sm text-gray-600">Total Work Hours</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {reportData.attendance.totalWorkHours?.toFixed(1) || 0}h
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Worklogs */}
      {reportData.worklogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Work Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Task</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Hours</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.worklogs.slice(0, 5).map((log) => (
                  <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{log.taskTitle}</td>
                    <td className="py-3 px-4 text-gray-700">{log.hoursSpent}h</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : log.status === 'blocked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {reportData.worklogs.length === 0 &&
        leaveStats.total === 0 &&
        taskStats.total === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700 font-medium">No data available yet</p>
            <p className="text-yellow-600 text-sm mt-1">
              Start logging work, creating tasks, and applying leaves to see reports
            </p>
          </div>
        )}
    </div>
  );
}