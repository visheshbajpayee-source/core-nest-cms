"use client";
import { Sidebar } from '@/app/components';

import { useState, ChangeEvent, FormEvent } from 'react';


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
    const [history, setHistory] = useState<LeaveHistoryItem[]>(leaveHistory);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setHistory([
            {
                type: form.type,
                from: form.start,
                to: form.end,
                days: form.start && form.end ? Math.max(1, (new Date(form.end).getTime() - new Date(form.start).getTime()) / (1000 * 60 * 60 * 24) + 1) : 1,
                status: 'Pending',
                applied: new Date().toISOString().slice(0, 10),
            },
            ...history,
        ]);
        setShowModal(false);
        setForm({ type: leaveTypes[0].value, start: '', end: '', reason: '' });
    };

    return (
        <div className="flex-1 w-full h-full px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Leave Management</h1>
                <p className="text-gray-500">Manage and track your leave requests</p>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {leaveBalances.map((bal) => (
                    <div key={bal.type} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
                        <div className="bg-slate-100 rounded-full p-3">
                            {bal.icon}
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{bal.count}</div>
                            <div className="text-gray-500 text-sm">{bal.type}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Apply Leave Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Apply for Leave</h2>
                <button
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                    onClick={() => setShowModal(true)}
                >
                    Apply for Leave
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Apply for Leave</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    required
                                >
                                    {leaveTypes.map((lt) => (
                                        <option key={lt.value} value={lt.value}>{lt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="start"
                                        value={form.start}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="end"
                                        value={form.end}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                    name="reason"
                                    value={form.reason}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[60px]"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg shadow transition"
                            >
                                Submit Leave Request
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Leave History Table */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8 border border-gray-100 overflow-x-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave History</h2>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-700">
                            <th className="py-2 px-4 text-left font-semibold">Leave Type</th>
                            <th className="py-2 px-4 text-left font-semibold">From</th>
                            <th className="py-2 px-4 text-left font-semibold">To</th>
                            <th className="py-2 px-4 text-left font-semibold">Days</th>
                            <th className="py-2 px-4 text-left font-semibold">Status</th>
                            <th className="py-2 px-4 text-left font-semibold">Applied Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-400 py-6">No leave history found.</td>
                            </tr>
                        ) : (
                            history.map((item, idx) => (
                                <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/40">
                                    <td className="py-2 px-4">{item.type}</td>
                                    <td className="py-2 px-4">{item.from}</td>
                                    <td className="py-2 px-4">{item.to}</td>
                                    <td className="py-2 px-4">{item.days}</td>
                                    <td className="py-2 px-4">{statusBadge(item.status)}</td>
                                    <td className="py-2 px-4">{item.applied}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leave;
