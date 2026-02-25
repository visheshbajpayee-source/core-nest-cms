import React from 'react'

const AttendanceRecord = () => {

const percentage = 40; // Present days / total days * 100
const radius = 68;  
const circumference = 2 * Math.PI * radius;
const offset = circumference - (percentage / 100) * circumference;
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
                  <div className="text-3xl font-bold text-slate-800">04:12</div>
                  <div className="text-xs text-slate-400 mt-1">Hrs</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-700 rounded-full inline-block"></span>
                  Present
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg shadow transition">
                    Check Out
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
                <div className="text-2xl font-bold text-slate-800">18</div>
                <div className="text-xs text-green-700 font-semibold">
                  On track
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">Absent</div>
                <div className="text-2xl font-bold text-slate-800">1</div>
                <div className="text-xs text-slate-400 font-semibold">
                  Casual Leave
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">
                  Late Arrival
                </div>
                <div className="text-2xl font-bold text-slate-800">2</div>
                <div className="text-xs text-orange-700 font-semibold">
                  Needs attention
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">
                  Attendance %
                </div>
                <div className="text-2xl font-bold text-slate-800">92%</div>
                <div className="text-xs text-green-700 font-semibold">
                  +2.4%
                </div>
              </div>
            </div>
          </div>
  )
}

export default AttendanceRecord