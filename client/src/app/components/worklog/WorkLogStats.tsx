interface WorkLogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: number;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

interface WorkLogStatsProps {
  entries: WorkLogEntry[];
}

export default function WorkLogStats({ entries }: WorkLogStatsProps) {
  const totalHours = entries.reduce((sum, entry) => sum + entry.hoursSpent, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Entries</p>
        <p className="text-2xl sm:text-3xl font-bold text-blue-600">{entries.length}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
        <p className="text-2xl sm:text-3xl font-bold text-green-600">{entries.filter((e) => e.status === 'Completed').length}</p>
      </div>
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">In Progress</p>
        <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{entries.filter((e) => e.status === 'In Progress').length}</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Hours</p>
        <p className="text-2xl sm:text-3xl font-bold text-purple-600">{totalHours.toFixed(1)}</p>
      </div>
    </div>
  );
}
