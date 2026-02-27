'use client';

import React, { useCallback, useEffect } from 'react';
import WorkLogForm from './WorkLogForm';
import WorkLogList from './WorkLogList';
import WorkLogStats from './WorkLogStats';
import WorkLogEmpty from './WorkLogEmpty';
import { useWorkLog, type WorkLogEntry } from './useWorkLog';
import { useWorkLogForm } from './useWorkLogForm';

interface DailyWorkLogProps {
  initialEntries?: WorkLogEntry[];
}

export default function DailyWorkLog({ initialEntries = [] }: DailyWorkLogProps) {
  const { entries, fetchEntries, addEntry, updateEntry, deleteEntry } = useWorkLog(initialEntries);
  const {
    showForm,
    setShowForm,
    formData,
    editingId,
    handleInputChange,
    handleSubmit,
    handleCancel,
    openEditForm,
    toggleForm,
  } = useWorkLogForm(addEntry, updateEntry);

  // load entries on mount
  React.useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm('Are you sure you want to delete this work log entry?')) {
        try {
          await deleteEntry(id);
        } catch {
          alert('Failed to delete entry');
        }
      }
    },
    [deleteEntry]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Daily Work Log</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your daily tasks and progress</p>
        </div>
        <button
          onClick={toggleForm}
          className="w-full sm:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition text-sm sm:text-base"
        >
          {showForm ? 'Cancel' : '+ Add Work Log'}
        </button>
      </div>

      {/* Form */}
      {showForm && <WorkLogForm formData={formData} editingId={editingId} onInputChange={handleInputChange} onSubmit={handleSubmit} onCancel={handleCancel} />}

      {/* Stats */}
      {entries.length > 0 && <WorkLogStats entries={entries} />}

      {/* List or Empty */}
      {entries.length === 0 ? <WorkLogEmpty onCreateClick={() => setShowForm(true)} /> : <WorkLogList entries={entries} onEdit={openEditForm} onDelete={handleDelete} />}
    </div>
  );
}