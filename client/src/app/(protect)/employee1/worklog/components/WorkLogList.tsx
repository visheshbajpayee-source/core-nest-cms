import WorkLogEntryCard from '../components/WorkLogEntry';

interface WorkLogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: number;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

interface WorkLogListProps {
  entries: WorkLogEntry[];
  onEdit: (entry: WorkLogEntry) => void;
  onDelete: (id: string) => void;
}

export default function WorkLogList({ entries, onEdit, onDelete }: WorkLogListProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {entries.map((entry) => (
        <WorkLogEntryCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
