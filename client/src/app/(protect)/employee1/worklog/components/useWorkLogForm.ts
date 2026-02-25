import { useState, useCallback } from 'react';
import type { WorkLogEntry } from '../components/useWorkLog';

interface FormData {
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: string;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

const getDefaultFormData = (): FormData => ({
  date: new Date().toISOString().split('T')[0],
  title: '',
  description: '',
  project: '',
  hoursSpent: '',
  status: 'In Progress',
});

export function useWorkLogForm(
  onAddEntry: (data: Omit<WorkLogEntry, 'id'>) => void,
  onUpdateEntry: (id: string, data: Omit<WorkLogEntry, 'id'>) => void
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

  const handleSubmit = useCallback(() => {
    if (!formData.title.trim() || !formData.project || !formData.hoursSpent) {
      alert('Please fill in all required fields');
      return;
    }

    const data = {
      date: formData.date,
      title: formData.title,
      description: formData.description,
      project: formData.project,
      hoursSpent: Number(formData.hoursSpent),
      status: formData.status,
    };

    if (editingId) {
      onUpdateEntry(editingId, data);
    } else {
      onAddEntry(data);
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
      status: entry.status,
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
