"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Checking your session...
        </div>
      </div>
    );
  }

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

        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}