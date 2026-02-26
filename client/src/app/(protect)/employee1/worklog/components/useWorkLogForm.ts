import { useState, useCallback } from 'react';
import type { WorkLogEntry } from '../components/useWorkLog';

interface FormData {
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: string;
  // internal status value matches database format (underscore)
  status: 'in_progress' | 'completed' | 'blocked';
}

const getDefaultFormData = (): FormData => ({
  date: new Date().toISOString().split('T')[0],
  title: '',
  description: '',
  project: '',
  hoursSpent: '',
  status: 'in_progress',
});

export function useWorkLogForm(
  onAddEntry: (data: Omit<WorkLogEntry, 'id'>) => Promise<any> | void,
  onUpdateEntry: (id: string, data: Omit<WorkLogEntry, 'id'>) => Promise<any> | void
) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hoursSpent' ? (value ? parseFloat(value) : '') : value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim() || !formData.project || !formData.hoursSpent) {
      alert('Please fill in all required fields');
      return;
    }

    // convert underscore status to human-readable label
    const humanStatus =
      formData.status === 'in_progress'
        ? 'In Progress'
        : formData.status === 'completed'
        ? 'Completed'
        : 'Blocked';

    const data: Omit<WorkLogEntry, 'id'> = {
      date: formData.date,
      title: formData.title,
      description: formData.description,
      project: formData.project,
      hoursSpent: Number(formData.hoursSpent),
      status: humanStatus,
    };

    try {
      if (editingId) {
        await onUpdateEntry(editingId, data);
      } else {
        await onAddEntry(data);
      }
    } catch (err) {
      alert('Failed to save work log entry');
      console.error(err);
      return;
    }

    setFormData(getDefaultFormData());
    setShowForm(false);
    setEditingId(null);
  }, [formData, editingId, onAddEntry, onUpdateEntry]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData(getDefaultFormData());
  }, []);

  const openEditForm = useCallback((entry: WorkLogEntry) => {
    setFormData({
      date: entry.date,
      title: entry.title,
      description: entry.description,
      project: entry.project,
      hoursSpent: entry.hoursSpent.toString(),
      // convert human label back to underscore form for select value
      status:
        entry.status.toLowerCase().replace(/\s+/g, '_') as FormData['status'],
    });
    setEditingId(entry.id);
    setShowForm(true);
  }, []);

  const toggleForm = useCallback(() => {
    if (showForm) {
      handleCancel();
    } else {
      setShowForm(true);
    }
  }, [showForm, handleCancel]);

  return {
    showForm,
    setShowForm,
    formData,
    editingId,
    handleInputChange,
    handleSubmit,
    handleCancel,
    openEditForm,
    toggleForm,
  };
}
