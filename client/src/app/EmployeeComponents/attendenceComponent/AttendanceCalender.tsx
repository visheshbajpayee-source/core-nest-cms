import React, { useState, useEffect } from 'react'

const AttendanceCalender = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState<{[key: string]: 'present' | 'absent' | 'today'}>({});

    // Sample attendance data - replace with real data
    useEffect(() => {
        const sampleData: {[key: string]: 'present' | 'absent' | 'today'} = {};
        const today = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Generate sample attendance data for the current month
        for (let day = 1; day <= new Date(currentYear, currentMonth + 1, 0).getDate(); day++) {
            const dateKey = `${currentYear}-${currentMonth}-${day}`;
            
            // Mark today
            if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                sampleData[dateKey] = 'today';
            }
            // Sample pattern: present on weekdays, absent on some random days
            else if (Math.random() > 0.1) {
                sampleData[dateKey] = 'present';
            } else if (Math.random() > 0.8) {
                sampleData[dateKey] = 'absent';
            }
        }
        setAttendanceData(sampleData);
    }, [currentDate]);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const getCurrentMonthData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDate = new Date(firstDayOfMonth);
        
        // Adjust to start from Monday
        const startDay = (firstDayOfMonth.getDay() + 6) % 7;
        startDate.setDate(1 - startDay);

        const days = [];
        for (let i = 0; i < 42; i++) { // 6 rows × 7 days
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }

        return { days, month, year };
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else {
            newDate.setMonth(currentDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const getAttendanceStatus = (date: Date) => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        
        if (date.getMonth() !== month) return null; // Different month
        
        const dateKey = `${year}-${month}-${date.getDate()}`;
        return attendanceData[dateKey] || null;
    };

    const getDayClasses = (date: Date, status: string | null) => {
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
        let classes = "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center text-xs sm:text-sm md:text-base rounded-full transition-all duration-200 cursor-pointer touch-manipulation ";

        if (!isCurrentMonth) {
            classes += "text-slate-300 hover:text-slate-400 ";
        } else {
            switch (status) {
                case 'today':
                    classes += "bg-indigo-700 text-white shadow-lg ring-2 ring-indigo-200 transform scale-110 font-semibold ";
                    break;
                case 'present':
                    classes += "bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 hover:bg-green-200 hover:scale-105 active:scale-95 ";
                    break;
                case 'absent':
                    classes += "bg-gradient-to-br from-red-100 to-rose-100 text-red-700 hover:bg-red-200 hover:scale-105 active:scale-95 ";
                    break;
                default:
                    classes += "text-slate-600 hover:bg-slate-100 hover:scale-105 active:scale-95 ";
            }
        }

        return classes;
    };

    const { days, month, year } = getCurrentMonthData();

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 md:p-6 flex flex-col border border-gray-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {monthNames[month]} {year}
                </h3>
                <div className="flex gap-1 sm:gap-2">
                    <button 
                        onClick={() => navigateMonth('prev')}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => navigateMonth('next')}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
                {daysOfWeek.map((day) => (
                    <div key={day} className="text-slate-400 font-medium text-center text-xs sm:text-xs md:text-sm uppercase tracking-wide py-1 sm:py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                {days.map((date, index) => {
                    const status = getAttendanceStatus(date);
                    return (
                        <div 
                            key={index}
                            className={getDayClasses(date, status)}
                            title={`${date.getDate()} ${monthNames[date.getMonth()]} - ${status || 'No data'}`}
                        >
                            {date.getDate()}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-3 h-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full border border-green-200"></div>
                    <span className="text-slate-600">Present</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-3 h-3 bg-gradient-to-br from-red-100 to-rose-100 rounded-full border border-red-200"></div>
                    <span className="text-slate-600">Absent</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-3 h-3 bg-indigo-700 rounded-full"></div>
                    <span className="text-slate-600">Today</span>
                </div>
            </div>
        </div>
    )
}

export default AttendanceCalender