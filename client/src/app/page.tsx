// import Dashboard from "./pages/Employee/DashBoard"
import Leave from "./components/Leave";
import EmployeeLayout from "./components/EmployeeLayout";
import DashboardContent from "./components/DashboardContent";
export default function Home() {
  return (
    <>
    
       <EmployeeLayout>
               <DashboardContent />
               
             </EmployeeLayout>
    {/* <Leave /> */}
    </>
  );
}
