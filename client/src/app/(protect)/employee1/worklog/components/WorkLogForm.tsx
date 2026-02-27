interface FormData {
  date: string;
  title: string;
  description: string;
  project: string;
  hoursSpent: string | number;
  // select value is stored in underscore format to match service
  status: 'in_progress' | 'completed' | 'blocked';
}

interface WorkLogFormProps {
  formData: FormData;
  editingId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const PROJECTS = ['Alpha Project', 'Beta Project', 'Marketing Campaign', 'Development', 'Design', 'QA Testing'];

export default function WorkLogForm({ formData, editingId, onInputChange, onSubmit, onCancel }: WorkLogFormProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 mb-8 border border-teal-200">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Work Log Entry' : 'New Work Log Entry'}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
          <input type="date" name="date" value={formData.date} onChange={onInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
          <input type="text" name="title" value={formData.title} onChange={onInputChange} placeholder="e.g., Login Page Design" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project *</label>
          <select name="project" value={formData.project} onChange={onInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
            <option value="">Select a project</option>
            {PROJECTS.map((proj) => (
              <option key={proj} value={proj}>
                {proj}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Spent *</label>
          <input type="number" name="hoursSpent" value={formData.hoursSpent} onChange={onInputChange} placeholder="e.g., 2.5" min="0.5" step="0.5" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
          <select name="status" value={formData.status} onChange={onInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Task Description</label>
        <textarea name="description" value={formData.description} onChange={onInputChange} placeholder="Add details about what you worked on..." rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button onClick={onSubmit} className="flex-1 px-6 py-2 sm:py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition text-sm sm:text-base">
          {editingId ? 'Update Entry' : 'Add to Log'}
        </button>
        <button onClick={onCancel} className="flex-1 px-6 py-2 sm:py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition text-sm sm:text-base">
          Cancel
        </button>
      </div>
    </div>
  );
}
