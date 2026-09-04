"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CarFront,
  CircleUserRound,
  Compass,
  Home,
  LogOut,
  MessageCircle,
  PlusCircle,
  Route,
  Settings,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Find a Ride",
    href: "/find-ride",
    icon: Compass,
  },
  {
    label: "Offer a Ride",
    href: "/offer-ride",
    icon: PlusCircle,
  },
  {
    label: "My Rides",
    href: "/my-rides",
    icon: Route,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageCircle,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: CircleUserRound,
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <CarFront size={20} />
            </div>

            <div>
              <p className="font-bold tracking-tight text-slate-950">
                RouteMate{" "}
                <span className="text-blue-600">
                  AI
                </span>
              </p>

              <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400">
                Smart Mobility
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />

                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-100 p-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={18} />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}