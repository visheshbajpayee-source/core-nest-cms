export interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: string | null;
  status: "Active" | "Present" | "Absent" | "Late";
}
export const dummyAttendanceData: AttendanceRecord[] = [
  {
    date: "Oct 24, 2023",
    checkIn: "09:00 AM",
    checkOut: null,
    workHours: null,
    status: "Active",
  },
  {
    date: "Oct 23, 2023",
    checkIn: "08:55 AM",
    checkOut: "06:05 PM",
    workHours: "09:10",
    status: "Present",
  },
  {
    date: "Oct 22, 2023",
    checkIn: null,
    checkOut: null,
    workHours: null,
    status: "Absent",
  },
  {
    date: "Oct 21, 2023",
    checkIn: "09:45 AM",
    checkOut: "06:30 PM",
    workHours: "08:45",
    status: "Late",
  },
  {
    date: "Oct 20, 2023",
    checkIn: "09:02 AM",
    checkOut: "05:58 PM",
    workHours: "08:56",
    status: "Present",
  },
];