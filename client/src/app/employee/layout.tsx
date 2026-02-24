import Sidebar from "../EmployeeComponents/Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar />
      <main className="w-full pt-16 lg:ml-64 lg:pt-0 lg:w-[calc(100%-16rem)]">
        {children}
      </main>
    </div>
  );
}
