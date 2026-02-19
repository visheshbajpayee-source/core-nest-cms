'use client';

import React from 'react';
import EmployeeLayout from '../../components/EmployeeLayout';
import DashboardContent from '../../components/DashboardContent';

export default function Dashboard() {
  return (
    <EmployeeLayout>
      <DashboardContent />
    </EmployeeLayout>
  );
}
