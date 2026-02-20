
import Leave from "../components/Leave";
import EmployeeLayout from "../components/EmployeeLayout";
export default function LeaveRoute() {
  return (
    // <div className="flex min-h-screen bg-slate-100">
    //   <Sidebar />
    //   <Leave />
    // </div>
     <div >
          
            <EmployeeLayout>
       <Leave />
             
              </EmployeeLayout> 
        </div>
  );
}