import React, { useEffect, useState } from 'react';
import {
  getAttendanceSummary,
  AttendanceSummary,
  checkIn,
  checkOut,
} from '../services/attendence';

const AttendanceRecord = () => {
  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummary>({
      presentDays: 0,
      absentDays: 0,
      totalWorkHours: 0,
      attendancePercentage: 0,
      workingDays: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      todayCheckIn: null,
      todayCheckOut: null,
      currentStatus: 'Absent',
    });

  const [loading, setLoading] = useState(true);

  // ---------------- FETCH ----------------
  const fetchAttendanceSummary = async () => {
    try {
      const res = await getAttendanceSummary();

      if (res.success && res.data) {
        setAttendanceSummary({
          ...res.data,
          todayCheckIn: res.data.todayCheckIn || null,
          todayCheckOut: res.data.todayCheckOut || null,
          currentStatus: res.data.todayCheckOut
            ? 'Present'
            : res.data.todayCheckIn
            ? 'Active'
            : 'Absent',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary();
  }, []);

  const handleAttendanceAction = async () => {
    setLoading(true);

    try {
      const res = await getAttendanceSummary();

      if (!res.success || !res.data) {
        alert('Failed to fetch attendance status');
        setLoading(false);
        return;
      }

      const isCheckedIn = !!res.data.todayCheckIn;
      const isCheckedOut = !!res.data.todayCheckOut;

      let response;

      if (isCheckedIn && !isCheckedOut) {
        response = await checkOut();
      }

      else if (!isCheckedIn) {
        response = await checkIn();
      }

      else {
        alert('Attendance already completed for today');
        await fetchAttendanceSummary();
        setLoading(false);
        return;
      }

      if (response?.success) {
        await fetchAttendanceSummary();
      } else {
        const msg = response?.message;

        if (msg?.includes('Already checked in today')) {
          alert('You are already checked in today');
          await fetchAttendanceSummary();
        } else {
          alert(msg || 'Something went wrong');
        }
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message;

      if (msg?.includes('Already checked in today')) {
        alert('Already checked in today');
        await fetchAttendanceSummary();
      } else {
        console.error(error);
        alert('Server error');
      }
    } finally {
      setLoading(false);
    }
  };

  const percentage =
    attendanceSummary.attendancePercentage || 0;

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (percentage / 100) * circumference;

  const formatWorkHours = (hours: number): string => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(
      2,
      '0'
    )}`;
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 border border-gray-100">

        <div className="relative flex flex-col items-center">
          <svg className="w-40 h-40" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#F3F6FC"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#818CF8"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 80 80)"
            />
          </svg>

          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">
              Worked
            </div>

            <div className="text-3xl font-bold text-slate-800">
              {loading
                ? '--:--'
                : formatWorkHours(
                    attendanceSummary.totalWorkHours
                  )}
            </div>

            <div className="text-xs text-slate-400 mt-1">
              Hrs
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              attendanceSummary.currentStatus === 'Present' ||
              attendanceSummary.currentStatus === 'Active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                attendanceSummary.currentStatus === 'Present' ||
                attendanceSummary.currentStatus === 'Active'
                  ? 'bg-green-700'
                  : 'bg-gray-700'
              }`}
            ></span>

            {attendanceSummary.currentStatus ||
              'Not Checked In'}
          </div>
          <button
            onClick={handleAttendanceAction}
            disabled={loading || attendanceSummary.todayCheckOut}
            className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg shadow transition"
          >
            {loading
              ? 'Please Wait...'
              : attendanceSummary.todayCheckOut
              ? 'Already Checked Out'
              : attendanceSummary.todayCheckIn
              ? 'Check Out'
              : 'Check In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord;