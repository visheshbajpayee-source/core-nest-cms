"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import// type { RootState } from "@/redux/store";
import Sidebar from "./Sidebar";


interface Props {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  const router = useRouter();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Prevent flicker before redirect
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar role={user?.role} />

      {/* Right Section */}
      <div className="flex flex-col flex-1">
       
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}