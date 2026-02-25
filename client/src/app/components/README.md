# Dashboard Components

This directory contains modular, reusable components for the employee dashboard.

## Component Structure

### Individual Dashboard Components

All components are located in `client/src/app/components/dashboard/`:

#### 1. **GreetingCard.tsx**
Displays personalized greeting with attendance circle and daily focus.

**Props:**
- `userName?: string` - User's name (default: "Disha")
- `attendancePercentage?: number` - Attendance percentage (default: 92)
- `focusToday?: string` - User's focus for the day
- `quote?: string` - Motivational quote

#### 2. **StatsCard.tsx**
Shows leave statistics and timer.

**Props:**
- `leaveLeft?: string` - Leave balance (default: "5/12")
- `remaining?: string` - Remaining leaves (default: "3")
- `todayStatus?: string` - Today's check-in time (default: "08:30 AM")

#### 3. **DailyWorkLog.tsx**
Displays daily work log entries in a table format.

**Props:**
- `entries?: WorkLogEntry[]` - Array of work log entries
- `onAddLog?: () => void` - Callback for "Add Log" button

**WorkLogEntry Interface:**
```typescript
interface WorkLogEntry {
  time: string;
  task: string;
  team: string;
  status: 'Completed' | 'In Progress' | string;
}
```

#### 4. **CalendarWidget.tsx**
Mini calendar with attendance legend.

**Props:**
- `month?: string` - Month name (default: "November")
- `year?: number` - Year (default: 2024)
- `totalDays?: number` - Total days in month (default: 30)
- `currentDay?: number` - Highlighted day (default: 18)

#### 5. **MyFocus.tsx**
Displays user's focus tasks and priorities.

**Props:**
- `tasks?: Task[]` - Array of tasks

**Task Interface:**
```typescript
interface Task {
  text: string;
  type?: string;
  label?: string;
  team?: string;
  priority?: 'high' | 'normal' | 'low';
}
```

#### 6. **NoticeBoard.tsx**
Shows urgent notices and upcoming holidays.

**Props:**
- `notices?: Notice[]` - Array of notices
- `holidays?: Holiday[]` - Array of holidays

**Interfaces:**
```typescript
interface Notice {
  type: string;
  text: string;
  detail: string;
}

interface Holiday {
  date: string;
  event: string;
}
```

## Usage

Import individual components:
```typescript
import { GreetingCard, StatsCard, DailyWorkLog } from '@/components/dashboard';
```

Or import from the main components index:
```typescript
import { GreetingCard, StatsCard } from '@/components';
```

## Example

```typescript
'use client';

import React from 'react';
import { GreetingCard, StatsCard, DailyWorkLog } from './components/dashboard';

export default function MyPage() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6">
        <GreetingCard userName="John" attendancePercentage={95} />
        <StatsCard leaveLeft="10/15" />
      </div>
      <DailyWorkLog entries={myEntries} />
    </div>
  );
}
```

## Benefits

✅ **Modular** - Each component is independent and reusable  
✅ **Type-safe** - Full TypeScript support with interfaces  
✅ **Flexible** - Customizable through props with sensible defaults  
✅ **Maintainable** - Easy to update individual components  
✅ **Reusable** - Can be used in other pages or applications
