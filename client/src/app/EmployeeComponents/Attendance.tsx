'use client';
import Sidebar from './Sidebar';
import React from 'react';

export default function Attendance() {
  return (
    <div className="flex min-h-screen bg-slate-100">
     
      <div className="flex-1 w-full p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">My Attendance</h1>
            <p className="text-gray-500">Track your daily attendance records and performance.</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Check-in Widget */}
            <div className="col-span-1 bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-between gap-8 border border-gray-100">
              <div className="relative flex flex-col items-center">
                <svg className="w-40 h-40" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" stroke="#F3F6FC" strokeWidth="12" fill="none" />
                  <path d="M80 12 a68 68 0 1 1 0 136" stroke="#818CF8" strokeWidth="12" fill="none" strokeLinecap="round" />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Worked</div>
                  <div className="text-3xl font-bold text-slate-800">04:12</div>
                  <div className="text-xs text-slate-400 mt-1">Hrs</div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold w-max">
                  <span className="w-2 h-2 bg-green-700 rounded-full inline-block"></span>
                  Present
                </div> 
                <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition">Check Out</button>
                <button className="border border-slate-200 text-slate-500 font-semibold px-6 py-2 rounded-lg transition hover:bg-slate-100">Request Break</button>
              </div>
            </div>
            {/* Stats Grid */}
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">Present Days</div>
                <div className="text-2xl font-bold text-slate-800">18</div>
                <div className="text-xs text-green-700 font-semibold">On track</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">Absent</div>
                <div className="text-2xl font-bold text-slate-800">1</div>
                <div className="text-xs text-slate-400 font-semibold">Casual Leave</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">Late Arrival</div>
                <div className="text-2xl font-bold text-slate-800">2</div>
                <div className="text-xs text-orange-700 font-semibold">Needs attention</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                <div className="text-xs text-slate-400 font-medium">Attendance %</div>
                <div className="text-2xl font-bold text-slate-800">92%</div>
                <div className="text-xs text-green-700 font-semibold">+2.4%</div>
              </div>
            </div>
          </div>

          {/* Attendance History Table */}
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mb-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Attendance History</h3>
              <span className="text-indigo-600 font-semibold text-sm cursor-pointer">Download Report</span>
            </div>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-700">
                  <th className="py-2 px-4 text-left font-semibold">Date</th>
                  <th className="py-2 px-4 text-left font-semibold">Check In</th>
                  <th className="py-2 px-4 text-left font-semibold">Check Out</th>
                  <th className="py-2 px-4 text-left font-semibold">Work Hours</th>
                  <th className="py-2 px-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4">Oct 24, 2023</td>
                  <td className="py-2 px-4">09:00 AM</td>
                  <td className="py-2 px-4">—</td>
                  <td className="py-2 px-4">—</td>
                  <td className="py-2 px-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Active</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Oct 23, 2023</td>
                  <td className="py-2 px-4">08:55 AM</td>
                  <td className="py-2 px-4">06:05 PM</td>
                  <td className="py-2 px-4">09:10</td>
                  <td className="py-2 px-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Present</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Oct 22, 2023</td>
                  <td className="py-2 px-4">—</td>
                  <td className="py-2 px-4">—</td>
                  <td className="py-2 px-4">—</td>
                  <td className="py-2 px-4"><span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Absent</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Oct 21, 2023</td>
                  <td className="py-2 px-4">09:45 AM</td>
                  <td className="py-2 px-4">06:30 PM</td>
                  <td className="py-2 px-4">08:45</td>
                  <td className="py-2 px-4"><span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">Late</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Oct 20, 2023</td>
                  <td className="py-2 px-4">09:02 AM</td>
                  <td className="py-2 px-4">05:58 PM</td>
                  <td className="py-2 px-4">08:56</td>
                  <td className="py-2 px-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Present</span></td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end pt-6 gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 scale-125"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
          </div>

          {/* Aside Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">October 2023</h3>
                <div className="flex gap-2">
                  <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">{'<'}</button>
                  <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">{'>'}</button>
                </div>
              </div>
              {/* Calendar grid placeholder */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                <div className="text-slate-400 font-medium">M</div>
                <div className="text-slate-400 font-medium">T</div>
                <div className="text-slate-400 font-medium">W</div>
                <div className="text-slate-400 font-medium">T</div>
                <div className="text-slate-400 font-medium">F</div>
                <div className="text-slate-400 font-medium">S</div>
                <div className="text-slate-400 font-medium">S</div>
                {/* Example days */}
                <div className="opacity-0">0</div>
                <div className="opacity-0">0</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">1</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">2</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">3</div>
                <div>4</div>
                <div>5</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">6</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">7</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">8</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">9</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">10</div>
                <div>11</div>
                <div>12</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">13</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">14</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">15</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">16</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">17</div>
                <div>18</div>
                <div>19</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">20</div>
                <div className="bg-red-100 text-red-700 rounded-full">21</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">22</div>
                <div className="bg-indigo-100 text-indigo-700 rounded-full">23</div>
                <div className="bg-indigo-700 text-white rounded-full shadow">24</div>
                <div>25</div>
                <div>26</div>
                <div>27</div>
                <div>28</div>
                <div>29</div>
                <div>30</div>
                <div>31</div>
              </div>
            </div>
            <div className="bg-linear-to-b from-indigo-100 to-white rounded-2xl p-6 border-none">
              <h4 className="text-teal-500 font-semibold text-sm mb-2">Company Policy</h4>
              <p className="text-xs text-slate-500">Remember to check in before 09:30 AM to avoid late marking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}