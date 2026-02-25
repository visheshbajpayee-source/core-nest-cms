"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import LeaveHistory from './LeaveHistory';
import { getLeaveHistory, LeaveRecord } from '@/services/EmployeeLeaves/leaves';


type LeaveType = 'Casual' | 'Sick' | 'Paid';
interface LeaveTypeOption {
    label: string;
    value: LeaveType;
}
const leaveTypes: LeaveTypeOption[] = [
    { label: 'Casual Leave', value: 'Casual' },
    { label: 'Sick Leave', value: 'Sick' },
    { label: 'Paid Leave', value: 'Paid' },
];


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
const leaveHistory: LeaveHistoryItem[] = [
    { type: 'Casual', from: '2026-02-01', to: '2026-02-03', days: 3, status: 'Approved', applied: '2026-01-25' },
    { type: 'Sick', from: '2026-01-15', to: '2026-01-16', days: 2, status: 'Pending', applied: '2026-01-14' },
    { type: 'Paid', from: '2025-12-20', to: '2025-12-22', days: 3, status: 'Rejected', applied: '2025-12-18' },
];


function statusBadge(status: LeaveStatus) {
    const color =
        status === 'Approved' ? 'bg-green-100 text-green-700' :
        status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700';
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
}


interface LeaveForm {
    type: LeaveType;
    start: string;
    end: string;
    reason: string;
}


const Leave = () => {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<LeaveForm>({
        type: leaveTypes[0].value,
        start: '',
        end: '',
        reason: '',
    });
    const [serviceHistory, setServiceHistory] = useState<LeaveRecord[]>([]);
    const [localHistory, setLocalHistory] = useState<LeaveHistoryItem[]>(leaveHistory);
    const [loading, setLoading] = useState(false);

    // Fetch leave data from service on component mount
    useEffect(() => {
        const fetchLeaveData = async () => {
            setLoading(true);
            try {
                const response = await getLeaveHistory("12"); // Using dummy employee ID
                if (response.success) {
                    setServiceHistory(response.data);
                }
            } catch (error) {
                console.error("Error fetching leave history:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLeaveData();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Add to local history for immediate UI update
        const newLeave: LeaveHistoryItem = {
            type: form.type,
            from: form.start,
            to: form.end,
            days: form.start && form.end ? Math.max(1, (new Date(form.end).getTime() - new Date(form.start).getTime()) / (1000 * 60 * 60 * 24) + 1) : 1,
            status: 'Pending',
            applied: new Date().toISOString().slice(0, 10),
        };
        
        setLocalHistory([newLeave, ...localHistory]);
        setShowModal(false);
        setForm({ type: leaveTypes[0].value, start: '', end: '', reason: '' });
        
        // TODO: Submit to API when backend is ready
        // submitLeaveRequest(newLeave);
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
                        <div className="bg-slate-100 rounded-full p-2 sm:p-3 flex-shrink-0">
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Apply for Leave</h2>
                <button
                    className="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
                    onClick={() => setShowModal(true)}
                >
                    Apply for Leave
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto relative animate-in zoom-in duration-200">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800">Apply for Leave</h3>
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Leave Type</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
                                    required
                                >
                                    {leaveTypes.map((lt) => (
                                        <option key={lt.value} value={lt.value}>{lt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        name="start"
                                        value={form.start}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">End Date</label>
                                    <input
                                        type="date"
                                        name="end"
                                        value={form.end}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Reason</label>
                                <textarea
                                    name="reason"
                                    value={form.reason}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 min-h-[80px] resize-none"
                                    placeholder="Please provide a reason for your leave request..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                Submit Leave Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
 
            {/* Leave History */}
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                        <span className="ml-2 text-gray-600">Loading leave history...</span>
                    </div>
                ) : (
                    <LeaveHistory 
                        history={localHistory.length > 0 ? localHistory : undefined} 
                    />
                )}
            </div>
        </div>
    );
};

export default Leave;