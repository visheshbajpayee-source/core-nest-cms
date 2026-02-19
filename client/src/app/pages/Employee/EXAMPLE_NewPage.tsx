/* 
 * EXAMPLE: How to create a new Employee page with persistent sidebar
 * 
 * This file demonstrates how to create new pages that will use the
 * same sidebar layout, ensuring the sidebar persists across route changes.
 * 
 * Simply create a new page component and wrap it with EmployeeLayout.
 */

'use client';

import React from 'react';
import { EmployeeLayout } from '../../components';

// Example: Employee Directory Page
export default function EmployeeDirectory() {
  return (
    <EmployeeLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Directory</h1>
        {/* Your page content goes here */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600">Employee directory content...</p>
        </div>
      </div>
    </EmployeeLayout>
  );
}

/*
 * To use this pattern for other pages (Attendance, Projects, etc.):
 * 
 * 1. Create a new file (e.g., Attendance.tsx)
 * 2. Import EmployeeLayout
 * 3. Wrap your page content with <EmployeeLayout>
 * 
 * Example structure:
 * 
 * 'use client';
 * 
 * import React from 'react';
 * import EmployeeLayout from './components/EmployeeLayout';
 * 
 * export default function YourPage() {
 *   return (
 *     <EmployeeLayout>
 *       <div className="p-8">
 *         {/* Your page content *\/}
 *       </div>
 *     </EmployeeLayout>
 *   );
 * }
 */
