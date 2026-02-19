import Sidebar from "../components/Sidebar";
import Leave from "../components/Leave";

export default function LeaveRoute() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <Leave />
    </div>
  );
}