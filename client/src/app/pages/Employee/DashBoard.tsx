'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
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

  const workLogEntries = [
    { time: '09:00', task: 'Daily Standup', team: 'Alpha Project', status: 'Completed' },
    { time: '09:30', task: 'Q3 Marketing Plan', team: '3.0', status: 'In Progress' },
  ];

  const myTasks = [
    { text: 'Review pending page wireframes', type: 'NEW', label: 'Due Today', priority: 'high' },
    { text: 'Schedule team sync', team: 'ID-Priv-Latest', priority: 'normal' },
    { text: 'Research competitor analysis', team: 'ID-Priv-Latest', priority: 'normal' },
  ];

  const notices = [
    { type: 'URGENT', text: 'Server Maintenance Tonight', detail: 'Company Holiday - Dec 25th - Happens by Friday' },
  ];

  const holidays = [
    { date: 'November 25', event: 'Diwali Celebration' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-slate-700">
          <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
            <span className="text-xl">◆</span>
          </div>
          <div>
            <div className="font-bold text-sm">Core Nest CMS</div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <NavItem icon="📊" label="Dashboard" active />
          <NavItem icon="👥" label="Employee Directory" />
          <NavItem icon="📅" label="Attendance" />
          <NavItem icon="📝" label="Daily Work Log" />
          <NavItem icon="📁" label="Projects" />
          <NavItem icon="📢" label="Announcements" />
          <NavItem icon="📈" label="Reports" />
          <NavItem icon="⚙️" label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
            DS
          </div>
          <div className="text-sm">
            <div className="font-medium">Disha Sharma</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Greeting Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Good Morning, Disha!</h1>
              
              <div className="flex items-start gap-6">
                {/* Attendance Circle */}
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#14b8a6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56 * 0.92} ${2 * Math.PI * 56}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-800">92%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>
                </div>

                {/* Focus Section */}
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-gray-700">Your focus today:</span>
                    <div className="text-lg font-bold text-gray-800 mt-1">
                      "Finalize 1s Marketing Plan"
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 italic mt-4">
                    "The only way to do great work is to love what you do." - Steve Jobs
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatBox icon="📋" label="Leave Left" value="5/12" color="teal" />
                <StatBox icon="📊" label="Remaining" value="3" color="orange" />
                <StatBox icon="🕐" label="Today's Status" value="08:30 AM" color="purple" />
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
          </div>

          {/* Daily Work Log & Calendar Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Daily Work Log */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Daily Work Log</h2>
                <button className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition">
                  Add Log
                </button>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">Add your completed work log for today</div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Today's Entries</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Team Name</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workLogEntries.map((entry, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-2">
                          <div className="text-sm text-gray-500">{entry.time}</div>
                          <div className="text-sm font-medium text-gray-800">{entry.task}</div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-700">{entry.team}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            entry.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">November 2024</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-gray-500 font-medium py-1">{day}</div>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                    <div
                      key={day}
                      className={`py-1 rounded ${
                        day === 18 ? 'bg-teal-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-600">P - Present</span>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                  <span className="text-gray-600">A - Absent</span>
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                  <span className="text-gray-600">L - Leave</span>
                </div>
              </div>
            </div>
          </div>

          {/* My Focus & Notice Board Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Focus */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">My Focus</h2>
              
              <div className="space-y-3">
                {myTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-teal-500 rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {task.type && (
                          <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded font-semibold">
                            {task.type}
                          </span>
                        )}
                        {task.label && (
                          <span className="text-xs text-red-500 font-medium">{task.label}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-800">{task.text}</div>
                      {task.team && (
                        <div className="text-xs text-gray-500 mt-1">{task.team}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">My Tasks</h3>
                <div className="text-sm text-gray-500">No pending tasks</div>
              </div>
            </div>

            {/* Notice Board */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Notice Board</h2>
              
              <div className="space-y-3">
                {notices.map((notice, idx) => (
                  <div key={idx} className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded font-semibold">
                        {notice.type}
                      </span>
                      <span className="text-sm font-semibold text-red-700">{notice.text}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notice.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Holidays</h3>
                <div className="space-y-2">
                  {holidays.map((holiday, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{holiday.date}</span>
                      <span className="text-sm text-gray-600">{holiday.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
        active
          ? 'bg-slate-700 border-l-4 border-teal-500 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="text-center">
      <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-bold text-gray-800">{value}</div>
    </div>
  );
}
