"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// components/Sidebar.tsx
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-100 min-h-[93vh]">
      <ul className="text-[#515151] mt-5">
        <Link className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-full cursor-pointer ${pathname === "/dashboard" ? "bg-[#f2f3ff] border-r-4 border-mainColor" : ""}`} href="/dashboard">
          <p>Dashboard</p>
        </Link>
        <Link className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-full cursor-pointer ${pathname === "/dashboard/all-appointments" ? "bg-[#f2f3ff] border-r-4 border-mainColor" : ""}`} href="/dashboard/all-appointments">All Appointments</Link>
        <Link className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-full cursor-pointer ${pathname === "/dashboard/all-users" ? "bg-[#f2f3ff] border-r-4 border-mainColor" : ""}`}  href="/dashboard/all-users">All Users</Link>
        <Link className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-full cursor-pointer ${pathname === "/dashboard/all-materials" ? "bg-[#f2f3ff] border-r-4 border-mainColor" : ""}`}  href="/dashboard/all-materials">All Materials</Link>
      </ul>
    </aside>
  );
}
