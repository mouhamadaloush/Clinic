import React from "react";
import NavbarDoctor from "@/components/bars/NavbarDoctor";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata = {
  title: "Clinic Dashboard",
  description: "this is dashboard for website",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <NavbarDoctor />
      <div className="flex gap-4">
        <Sidebar />
        <main className="flex-1 max-w-full">{children}</main>
      </div>
    </div>
  );
}
