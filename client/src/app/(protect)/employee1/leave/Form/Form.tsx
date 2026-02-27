"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { submitLeave } from '../services/EmployeeLeaves/leaves';
import { getLeaveTypes, LeaveTypeRecord } from '../services/EmployeeLeaves/leaveTypes';

interface LeaveForm {
    leaveTypeId: string;
    start: string;
    end: string;
    reason: string;
}

type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';
interface LeaveHistoryItem {
    type: string;
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
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeRecord[]>([]);
    const [loadingLeaveTypes, setLoadingLeaveTypes] = useState<boolean>(true);
    const [form, setForm] = useState<LeaveForm>({
        leaveTypeId: '',
        start: '',
        end: '',
        reason: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch leave types when modal opens
    useEffect(() => {
        if (showModal) {
            fetchLeaveTypes();
        }
    }, [showModal]);

    const fetchLeaveTypes = async () => {
        setLoadingLeaveTypes(true);
        try {
            const response = await getLeaveTypes();
            if (response.success && response.data.length > 0) {
                const activeTypes = response.data.filter(lt => lt.isActive);
                setLeaveTypes(activeTypes);
                // Set first leave type as default
                setForm(prev => ({
                    ...prev,
                    leaveTypeId: activeTypes[0]?._id || ''
                }));
            } else {
                setError('No leave types available. Please contact admin.');
            }
        } catch (err) {
            console.error('Error fetching leave types:', err);
            setError('Failed to load leave types.');
        } finally {
            setLoadingLeaveTypes(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!form.leaveTypeId) {
                setError('Please select a leave type');
                setIsSubmitting(false);
                return;
            }

            const leaveData = {
                leaveType: form.leaveTypeId, // Send the leave type ID
                startDate: form.start,
                endDate: form.end,
                reason: form.reason,
            };
            
            console.log("📤 Submitting leave request:", leaveData);
            
            const response = await submitLeave(leaveData);

            if (response.success) {
                const selectedLeaveType = leaveTypes.find(lt => lt._id === form.leaveTypeId);
                const newLeave: LeaveHistoryItem = {
                    type: selectedLeaveType?.name || 'Leave',
                    from: form.start,
                    to: form.end,
                    days: form.start && form.end ? Math.max(1, Math.ceil((new Date(form.end).getTime() - new Date(form.start).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 1,
                    status: 'Pending',
                    applied: new Date().toISOString().slice(0, 10),
                };
                
                onSubmit(newLeave);
                setForm({ 
                    leaveTypeId: leaveTypes[0]?._id || '', 
                    start: '', 
                    end: '', 
                    reason: '' 
                });
                onClose();
            } else {
                setError(response.message || 'Failed to submit leave request');
            }
        } catch (err: any) {
            console.error('Error submitting leave:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Leave Type</label>
                        {loadingLeaveTypes ? (
                            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 text-gray-500">
                                Loading leave types...
                            </div>
                        ) : leaveTypes.length === 0 ? (
                            <div className="w-full border border-red-300 rounded-lg px-3 py-2 sm:py-3 text-red-600 text-sm">
                                No leave types available
                            </div>
                        ) : (
                            <select
                                name="leaveTypeId"
                                value={form.leaveTypeId}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
                                required
                            >
                                {leaveTypes.map((lt) => (
                                    <option key={lt._id} value={lt._id}>
                                        {lt.name} ({lt.maxDaysPerYear} days/year)
                                    </option>
                                ))}
                            </select>
                        )}
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 min-h-20 resize-none"
                            placeholder="Please provide a reason for your leave request..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Form;