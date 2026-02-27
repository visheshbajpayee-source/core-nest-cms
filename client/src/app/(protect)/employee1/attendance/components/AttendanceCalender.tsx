import React, { useState, useEffect } from 'react';
import { getAttendanceHistory, AttendanceRecord } from '../services/attendence';
import { getLeaveHistory, LeaveRecord } from '../../leave/services/EmployeeLeaves/leaves';
import { getHolidays, Holiday, formatHolidayDate } from '../services/holiday';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Active' | 'Leave' | 'Holiday';

interface AttendanceDataMap {
    [key: string]: AttendanceStatus;
}

interface HolidayNameMap {
    [key: string]: string;
}

const AttendanceCalender: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [attendanceData, setAttendanceData] = useState<AttendanceDataMap>({});
    const [holidayNames, setHolidayNames] = useState<HolidayNameMap>({});
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch real attendance data, leave data, and holiday data from API
    useEffect(() => {
        const fetchAttendanceData = async () => {
            setLoading(true);
            try {
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const year = String(currentDate.getFullYear());
                
                // Fetch attendance, leave, and holiday data in parallel
                const [attendanceResponse, leaveResponse, holidayResponse] = await Promise.all([
                    getAttendanceHistory({ month, year }),
                    getLeaveHistory({ month, year }),
                    getHolidays({ year })
                ]);
                
                const dataMap: AttendanceDataMap = {};
                const holidayNameMap: HolidayNameMap = {};
                
                // First, populate attendance data
                if (attendanceResponse.success && attendanceResponse.data) {
                    attendanceResponse.data.forEach((record: AttendanceRecord) => {
                        // Parse date from "DD/MM/YYYY" format
                        const [day, recordMonth, recordYear] = record.date.split('/');
                        const dateKey = `${recordYear}-${recordMonth}-${day}`;
                        dataMap[dateKey] = record.status;
                    });
                }
                
                // Then, overlay approved leave data (approved leaves override absence)
                if (leaveResponse.success && leaveResponse.data) {
                    leaveResponse.data.forEach((leave: LeaveRecord) => {
                        // Only show approved leaves on calendar
                        if (leave.status === 'approved') {
                            const startDate = new Date(leave.startDate);
                            const endDate = new Date(leave.endDate);
                            
                            // Mark all days in the leave range
                            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                dataMap[dateKey] = 'Leave';
                            }
                        }
                    });
                }
                
                // Finally, add holiday data (holidays override everything)
                if (holidayResponse.success && holidayResponse.data) {
                    holidayResponse.data.forEach((holiday: Holiday) => {
                        const dateKey = formatHolidayDate(holiday.date);
                        dataMap[dateKey] = 'Holiday';
                        holidayNameMap[dateKey] = holiday.name;
                    });
                }
                
                setAttendanceData(dataMap);
                setHolidayNames(holidayNameMap);
                
                console.log('📅 Calendar data loaded:', {
                    attendanceRecords: Object.keys(dataMap).length,
                    holidays: Object.keys(holidayNameMap).length
                });
            } catch (error) {
                console.error('❌ Error fetching calendar data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAttendanceData();
    }, [currentDate]);

    const monthNames: readonly string[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek: readonly string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const getCurrentMonthData = (): { days: Date[]; month: number; year: number } => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDate = new Date(firstDayOfMonth);
        
        // Adjust to start from Monday
        const startDay = (firstDayOfMonth.getDay() + 6) % 7;
        startDate.setDate(1 - startDay);

        const days: Date[] = [];
        for (let i = 0; i < 42; i++) { // 6 rows × 7 days
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }

        return { days, month, year };
    };

    const navigateMonth = (direction: 'prev' | 'next'): void => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else {
            newDate.setMonth(currentDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const getAttendanceStatus = (date: Date): string | null => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        
        if (date.getMonth() !== month) return null; // Different month
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const status = attendanceData[dateKey];
        
        // Check if it's today
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
        
        if (isToday && status) {
            return `today-${status}`; // e.g., 'today-Present', 'today-Absent'
        }
        
        return status || null;
    };

    const getDayClasses = (date: Date, status: string | null): string => {
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
        let classes = "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center text-xs sm:text-sm md:text-base rounded-full transition-all duration-200 cursor-pointer touch-manipulation ";

        if (!isCurrentMonth) {
            classes += "text-slate-300 hover:text-slate-400 ";
        } else {
            // Handle today with status
            if (status?.startsWith('today-')) {
                const actualStatus = status.replace('today-', '');
                classes += "ring-2 ring-indigo-400 transform scale-110 font-semibold shadow-lg ";
                
                switch (actualStatus) {
                    case 'Present':
                        classes += "bg-gradient-to-br from-green-500 to-emerald-500 text-white ";
                        break;
                    case 'Absent':
                        classes += "bg-gradient-to-br from-red-500 to-rose-500 text-white ";
                        break;
                    case 'Late':
                        classes += "bg-gradient-to-br from-orange-500 to-amber-500 text-white ";
                        break;
                    case 'Active':
                        classes += "bg-gradient-to-br from-blue-500 to-cyan-500 text-white ";
                        break;
                    case 'Leave':
                        classes += "bg-gradient-to-br from-red-500 to-red-500 text-white ";
                        break;
                    case 'Holiday':
                        classes += "bg-gradient-to-br from-purple-500 to-violet-500 text-white ";
                        break;
                    default:
                        classes += "bg-indigo-700 text-white ";
                }
            } else {
                // Regular status (not today)
                switch (status) {
                    case 'Present':
                        classes += "bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 hover:bg-green-200 hover:scale-105 active:scale-95 ";
                        break;
                    case 'Absent':
                        classes += "bg-gradient-to-br from-red-100 to-rose-100 text-red-700 hover:bg-red-200 hover:scale-105 active:scale-95 ";
                        break;
                    case 'Late':
                        classes += "bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 hover:bg-orange-200 hover:scale-105 active:scale-95 ";
                        break;
                    case 'Active':
                        classes += "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 hover:bg-blue-200 hover:scale-105 active:scale-95 ";
                        break;
                    case 'Leave':
                        classes += "bg-gradient-to-br from-red-100 to-red-100 text-red-700 hover:bg-red-200 hover:scale-105 active:scale-95 ";
                        break;
                    case 'Holiday':
                        classes += "bg-gradient-to-br from-purple-100 to-violet-100 text-purple-700 hover:bg-purple-200 hover:scale-105 active:scale-95 ";
                        break;
                    default:
                        classes += "text-slate-600 hover:bg-slate-100 hover:scale-105 active:scale-95 ";
                }
            }
        }

        return classes;
    };

    const { days, month, year } = getCurrentMonthData();

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 md:p-6 flex flex-col border border-gray-100 transition-all duration-300 relative">
            {loading && (
                <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-slate-500">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-500"></div>
                    <span>Loading...</span>
                </div>
            )}
            
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
                    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    const holidayName = holidayNames[dateKey];
                    const actualStatus = status?.startsWith('today-') ? status.replace('today-', '') : status;
                    const isHoliday = actualStatus === 'Holiday';
                    
                    return (
                        <div 
                            key={index}
                            className="flex flex-col items-center justify-center"
                        >
                            <div 
                                className={getDayClasses(date, status)}
                                title={`${date.getDate()} ${monthNames[date.getMonth()]} - ${isHoliday && holidayName ? holidayName : status || 'No data'}`}
                            >
                                {date.getDate()}
                            </div>
                            {isHoliday && holidayName && date.getMonth() === currentDate.getMonth() && (
                                <div className="text-[8px] sm:text-[9px] md:text-[10px] text-purple-600 font-medium mt-0.5 truncate max-w-full px-0.5">
                                    {holidayName}
                                </div>
                            )}
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
                    <div className="w-3 h-3 bg-gradient-to-br from-red-100 to-red-100 rounded-full border border-red-200"></div>
                    <span className="text-slate-600">On Leave</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-3 h-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full border border-purple-200"></div>
                    <span className="text-slate-600">Holiday</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-3 h-3 bg-indigo-700 rounded-full ring-2 ring-indigo-400"></div>
                    <span className="text-slate-600">Today</span>
                </div>
            </div>
            </div>
        
    )
}

export default AttendanceCalender