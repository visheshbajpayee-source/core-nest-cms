interface WorkLogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: number;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

interface WorkLogEntryProps {
  entry: WorkLogEntry;
  onEdit: (entry: WorkLogEntry) => void;
  onDelete: (id: string) => void;
}

export default function WorkLogEntryCard({ entry, onEdit, onDelete }: WorkLogEntryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Blocked':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{entry.title}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit ${getStatusColor(entry.status)}`}>
              {entry.status}
            </span>
          </div>

          {entry.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entry.description}</p>}

          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(entry.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {entry.hoursSpent}h
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0A5 5 0 017 12z" />
              </svg>
              {entry.project}
            </span>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => onEdit(entry)}
            className="flex-1 sm:flex-none px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="flex-1 sm:flex-none px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold rounded transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
