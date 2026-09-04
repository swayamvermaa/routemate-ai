"use client";

import Link from "next/link";
import {
  CarFront,
  Search,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import {
  getCurrentProfile,
  Profile,
} from "@/services/profileService";

export default function DashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Load current user profile
  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getCurrentProfile();

        setProfile(data);
        setCheckingAuth(false);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      }
    }

    loadDashboard();
  }, [router]);

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  // Loading screen
  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500">
          Loading your dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <CarFront size={20} />
            </div>

            <div>
              <p className="font-bold text-slate-950">
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

          {/* Header Actions */}
          <div className="flex items-center gap-4">

            {/* Profile */}
            <Link
              href="/profile"
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              Profile
            </Link>

            {/* Home */}
            <Link
              href="/"
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              Home
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Dashboard Introduction */}
        <div>
          <p className="text-sm font-semibold text-blue-600">
            RouteMate Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {profile?.full_name
              ? `Welcome back, ${profile.full_name.split(" ")[0]}.`
              : "Your smarter commute starts here."}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Find a ride or offer an empty seat to someone going your way.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">

          {/* Find Ride */}
          <Link
            href="/find-ride"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Search size={22} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Find a Ride
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Discover compatible rides based on your route and travel time.
            </p>

            <p className="mt-5 text-sm font-bold text-blue-600">
              Find a ride →
            </p>
          </Link>

          {/* Offer Ride */}
          <Link
            href="/offer-ride"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <PlusCircle size={22} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Offer a Ride
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Share your empty seats with people travelling along your route.
            </p>

            <p className="mt-5 text-sm font-bold text-blue-600">
              Offer a ride →
            </p>
          </Link>

        </div>
      </section>
    </main>
  );
}
