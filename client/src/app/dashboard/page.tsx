import Sidebar from "../components/Sidebar";
import Leave from "../components/Leave";
// import DashBoard from "../pages/Employee/DashBoard";
import DashboardContent from "../components/DashboardContent";
import EmployeeLayout from "../components/EmployeeLayout";
export default function DashBoardRoute() {
  return (
    <div className="flex min-h-screen bg-slate-100">
        <EmployeeLayout>
            <DashboardContent />
            
          </EmployeeLayout>
    </div>
  );
}