'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "../EmployeeComponents/Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/Login') || pathname.includes('/signup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar />
      <main className="w-full pt-16 lg:ml-64 lg:pt-0 lg:w-[calc(100%-16rem)]">
        {children}
      </main>
    </div>
  );
}
