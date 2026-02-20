
import Attendance from "@/app/components/Attendance";
import { EmployeeLayout } from "@/app/components";
export default function AttendanceRoute() {
  return (  
    <div className="flex min-h-screen bg-slate-100">
        <EmployeeLayout>
       
            <Attendance />
          </EmployeeLayout>
    </div>
  );
}