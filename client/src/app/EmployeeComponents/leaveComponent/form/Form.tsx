"use client";

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

interface LeaveForm {
    type: LeaveType;
    start: string;
    end: string;
    reason: string;
}

type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';
interface LeaveHistoryItem {
    type: LeaveType;
    from: string;
    to: string;
    days: number;
    status: LeaveStatus;
    applied: string;
}

interface FormProps {
    showModal: boolean;
    onClose: () => void;
    onSubmit: (newLeave: LeaveHistoryItem) => void;
}

const Form = ({ showModal, onClose, onSubmit }: FormProps) => {
    const [form, setForm] = useState<LeaveForm>({
        type: leaveTypes[0].value,
        start: '',
        end: '',
        reason: '',
    });

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
        
        onSubmit(newLeave);
        setForm({ type: leaveTypes[0].value, start: '', end: '', reason: '' });
        
        // TODO: Submit to API when backend is ready
        // submitLeaveRequest(newLeave);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto relative animate-in zoom-in duration-200">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    onClick={onClose}
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
    );
};

export default Form;