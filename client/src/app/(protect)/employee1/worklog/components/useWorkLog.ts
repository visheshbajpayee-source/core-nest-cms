import { useState, useCallback } from 'react';
import * as worklogService from '../services/worklogService';

export interface WorkLogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  // project comes back from the API as string or null; we
  // normalize it to empty string when missing.
  project: string;
  hoursSpent: number;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

export function useWorkLog(initialEntries: WorkLogEntry[] = []) {
  const [entries, setEntries] = useState<WorkLogEntry[]>(initialEntries);

  // helper to convert service payload into our WorkLogEntry type
  const mapToEntry = (w: any): WorkLogEntry => ({
    id: w.id || w._id,
    date: w.date,
    title: w.title || w.taskTitle,
    description: w.description || w.taskDescription,
    project: w.project || '',
    hoursSpent: w.hoursSpent,
    status: w.status as WorkLogEntry['status'],
  });

  const fetchEntries = useCallback(async () => {
    try {
      const data = await worklogService.getWorklogs();
      setEntries((data as any[]).map(mapToEntry));
    } catch (err) {
      console.error('Failed to fetch worklogs', err);
    }
  }, []);

  const addEntry = useCallback(async (entry: Omit<WorkLogEntry, 'id'>) => {
    try {
      const newEntryRaw = await worklogService.addWorklog({
        date: entry.date,
        taskTitle: entry.title,
        taskDescription: entry.description,
        project: entry.project,
        hoursSpent: entry.hoursSpent,
        status: entry.status.toLowerCase(),
      });
      const newEntry = mapToEntry(newEntryRaw);
      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      console.error('Failed to add worklog', err);
      throw err;
    }
  }, []);

  const updateEntry = useCallback(
    async (id: string, updates: Partial<WorkLogEntry>) => {
      try {
        const updatedRaw = await worklogService.editWorklog(id, {
          date: updates.date,
          taskTitle: updates.title,
          taskDescription: updates.description,
          project: updates.project,
          hoursSpent: updates.hoursSpent,
          status: updates.status
            ? (updates.status.toLowerCase() as
                | 'in progress'
                | 'in_progress'
                | 'completed'
                | 'blocked')
            : undefined,
        });
        const updated = mapToEntry(updatedRaw);
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? updated : entry))
        );
        return updated;
      } catch (err) {
        console.error('Failed to update worklog', err);
        throw err;
      }
    },
    []
  );

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await worklogService.deleteWorklog(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error('Failed to delete worklog', err);
      throw err;
    }
  }, []);

  const getSummary = useCallback(async (employeeId: string, date: string) => {
    try {
      return await worklogService.getSummary(employeeId, date);
    } catch (err) {
      console.error('Failed to fetch summary', err);
      throw err;
    }
  }, []);

  return {
    entries,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    getSummary,
  };
}
