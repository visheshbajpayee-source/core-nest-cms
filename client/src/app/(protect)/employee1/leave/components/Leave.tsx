"use client";

import { useState, useEffect } from 'react';
import LeaveHistory from './LeaveHistory';
import Form from '../Form/Form';
import { getLeaveHistory } from '../services/EmployeeLeaves/leaves';

type LeaveType = 'Casual' | 'Sick' | 'Paid';


interface LeaveBalance {
    type: string;
    count: number;
    icon: JSX.Element;
}
const leaveBalances: LeaveBalance[] = [
    { type: 'Casual Leave', count: 8, icon: (
        <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v1a3 3 0 006 0v-1c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>
    ) },
    { type: 'Sick Leave', count: 5, icon: (
        <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    ) },
    { type: 'Paid Leave', count: 12, icon: (
        <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><rect x="3" y="4" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    ) },
];


type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';
interface LeaveHistoryItem {
    type: LeaveType;
    from: string;
    to: string;
    days: number;
    status: LeaveStatus;
    applied: string;
}

const Leave = () => {
    const [showModal, setShowModal] = useState(false);
    const [localHistory, setLocalHistory] = useState<LeaveHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch leave data from service on component mount
    useEffect(() => {
        const fetchLeaveData = async () => {
            setLoading(true);
            try {
                const response = await getLeaveHistory({
                    month: String(new Date().getMonth() + 1),
                    year: String(new Date().getFullYear())
                }); // Using dummy employee ID with current month/year
                console.log("Leave data fetched:", response);
            } catch (error) {
                console.error("Error fetching leave history:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLeaveData();
    }, []);

    const handleFormSubmit = (newLeave: LeaveHistoryItem) => {
        setLocalHistory([newLeave, ...localHistory]);
        setShowModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="flex-1 w-full h-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                    Leave Management
                </h1>
                <p className="text-sm sm:text-base text-gray-500">
                    Manage and track your leave requests
                </p>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {leaveBalances.map((bal) => (
                    <div key={bal.type} className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 sm:p-6 flex items-center gap-3 sm:gap-4 border border-gray-100 transition-all duration-200 hover:scale-105">
                        <div className="bg-slate-100 rounded-full p-2 sm:p-3 shrink-0">
                            {bal.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-xl sm:text-2xl font-bold text-slate-800">{bal.count}</div>
                            <div className="text-gray-500 text-sm truncate">{bal.type}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Apply Leave Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              
                <button
                    className="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
                    onClick={() => setShowModal(true)}
                >
                    Apply for Leave
                </button>
            </div>

            {/* Form Modal */}
            <Form 
                showModal={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleFormSubmit}
            />
 
            {/* Leave History */}
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                        <span className="ml-2 text-gray-600">Loading leave history...</span>
                    </div>
                ) : (
                    <LeaveHistory refreshTrigger={refreshTrigger} />
                )}
            </div>
        </div>
    );
};

export default Leave;