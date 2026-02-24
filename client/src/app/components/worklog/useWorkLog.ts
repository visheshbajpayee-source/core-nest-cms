import { useState } from 'react';

export interface WorkLogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: number;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

export function useWorkLog(initialEntries: WorkLogEntry[] = []) {
  const [entries, setEntries] = useState<WorkLogEntry[]>(initialEntries);

  const addEntry = (entry: Omit<WorkLogEntry, 'id'>) => {
    const newEntry: WorkLogEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<WorkLogEntry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
