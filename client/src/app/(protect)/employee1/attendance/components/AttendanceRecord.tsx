import React, { useEffect, useState } from 'react'
import { getAttendanceSummary, AttendanceSummary } from '../services/attendence';

const AttendanceRecord = () => {

const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>({
  presentDays: 0,
  absentDays: 0,
  totalWorkHours: 0,
  attendancePercentage: 0,
  workingDays: 0,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});

const [loading, setLoading] = useState(true);

useEffect(() => {
  getAttendanceSummary()
    .then(res => {
      console.log("Attendance summary:", res);
      if (res.success && res.data) {
        setAttendanceSummary(res.data);
      }
    })
    .catch(err => {
      console.error("Error fetching attendance summary:", err);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

// Calculate percentage and circle values
const percentage = attendanceSummary.attendancePercentage || 0;
const radius = 68;  
const circumference = 2 * Math.PI * radius;
const offset = circumference - (percentage / 100) * circumference;

// Format work hours
const formatWorkHours = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
//   const getAttendanceStatus = (absentDays: number) => {
//   if (absentDays <= 2) return "Excellent";
//   if (absentDays <= 4) return "Good";
//   if (absentDays <= 6) return "Average";
//   return "Poor";
// };
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};


  return (

          <div className="flex flex-col gap-6 mb-8">
            {/* Check-in Widget - Centered at top */}
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
                    {loading ? '--:--' : formatWorkHours(attendanceSummary.totalWorkHours)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Hrs</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  attendanceSummary.currentStatus === 'Present' || attendanceSummary.currentStatus === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${
                    attendanceSummary.currentStatus === 'Present' || attendanceSummary.currentStatus === 'Active'
                      ? 'bg-green-700'
                      : 'bg-gray-700'
                  }`}></span>
                  {attendanceSummary.currentStatus || 'Not Checked In'}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg shadow transition">
                    {attendanceSummary.todayCheckOut ? 'Already Checked Out' : attendanceSummary.todayCheckIn ? 'Check Out' : 'Check In'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid - Full width below */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">
                  Present Days
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {loading ? '--' : attendanceSummary.presentDays}
                </div>
                <div className="text-xs text-green-700 font-semibold">
                  {attendanceSummary.presentDays >= attendanceSummary.workingDays * 0.9 ? 'On track' : 'Needs improvement'}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">Absent</div>
                <div className="text-2xl font-bold text-slate-800">
                  {loading ? '--' : attendanceSummary.absentDays}
                </div>
                <div className="text-xs  text-green-700 font-semibold">
                  {attendanceSummary.absentDays <= 2 ? 'Excellent' : attendanceSummary.absentDays <= 4 ? 'Good' : 'Needs improvement'}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">
                Total Working Days
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {loading ? '--' : attendanceSummary.workingDays || 0}
                </div>
                <div className="text-xs text-orange-700 font-semibold">
                  {(attendanceSummary.lateArrivals || 0) > 3 ? 'Needs attention' : 'Good'}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">
                  Attendance %
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {loading ? '--' : `${Math.round(attendanceSummary.attendancePercentage)}%`}
                </div>
                <div className={`text-xs font-semibold ${
                  attendanceSummary.attendancePercentage >= 90 
                    ? 'text-green-700' 
                    : attendanceSummary.attendancePercentage >= 75 
                    ? 'text-yellow-700' 
                    : 'text-red-700'
                }`}>
                  {attendanceSummary.attendancePercentage >= 90 ? 'Excellent' : attendanceSummary.attendancePercentage >= 75 ? 'Good' : 'Poor'}
                </div>
              </div>
            </div>
          </div>
  )
}

export default AttendanceRecord