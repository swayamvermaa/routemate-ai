"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        <main>{children}</main>
      </div>
    </div>
  );
}