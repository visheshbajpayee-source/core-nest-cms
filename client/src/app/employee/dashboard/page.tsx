
import DashboardContent from "@/app/components/DashboardContent";
import EmployeeLayout from "../layout";

export default function DashBoardRoute() {
  return (
    <div className="flex min-h-screen bg-slate-100">
        {/* <EmployeeLayout>
            <DashboardContent />
            
          </EmployeeLayout> */}
            <DashboardContent />

    </div>
  );
}