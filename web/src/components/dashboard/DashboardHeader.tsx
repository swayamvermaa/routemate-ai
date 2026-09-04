"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  Search,
  User,
} from "lucide-react";
import { getCurrentProfile, Profile } from "@/services/profileService";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();
  }, []);

  const firstName =
    profile?.full_name?.split(" ")[0] || "User";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="hidden max-w-md flex-1 lg:flex">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search rides, routes..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">

          <Link
            href="/notifications"
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </Link>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={18} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-slate-900">
                {firstName}
              </p>

              <p className="text-[11px] text-slate-400">
                View profile
              </p>
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
}