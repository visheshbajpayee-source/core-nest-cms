// ── Employee-facing components ─────────────────────────────────────────────
export { default as Sidebar } from './Sidebar';
export { default as DashboardContent } from './DashboardContent';
export { default as GreetingCard } from './GreetingCard';
export { default as StatsCard } from './StatsCard';
export { default as DailyWorkLog } from './DailyWorkLog';
export { default as CalendarWidget } from './CalendarWidget';
export { default as MyFocus } from './MyFocus';
export { default as NoticeBoard } from './NoticeBoard';

// ── Admin components (from AdminComponents/) ───────────────────────────────
export { AdminSidebar, AdminEmployeeForm, AdminEmployeeTable } from '../AdminComponents';

// ── Reusable UI primitives (from ReusableComponents/) ─────────────────────
export { AttendanceCircle } from '../ReusableComponents';
export type { AttendanceCircleProps } from '../ReusableComponents';


