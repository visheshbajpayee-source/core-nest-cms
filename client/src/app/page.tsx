
import DashboardContent from "@/app/components/DashboardContent";
import EmployeeLayout from "./employee/layout";
import EmployeeDirectoryPage from "./Admin/EmployeeDirectory/page";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-100">
        {/* <EmployeeLayout>
            <DashboardContent />
            
          </EmployeeLayout>
          */}
          <EmployeeDirectoryPage />
    </div>
  );
}