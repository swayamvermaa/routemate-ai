"use client";

import { useEffect, useState } from "react";
import {
  CarFront,
  Clock3,
  IndianRupee,
  PlusCircle,
  Search,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  getCurrentProfile,
  Profile,
} from "@/services/profileService";

import {
  getMyRides,
  Ride,
} from "@/services/rideService";

import StatCard from "@/components/dashboard/StatCard";
import QuickAction from "@/components/dashboard/QuickAction";
import UpcomingRide from "@/components/dashboard/UpcomingRide";
import AIRecommendation from "@/components/dashboard/AIRecommendation";

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [upcomingRide, setUpcomingRide] = useState<Ride | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Load current user profile
        const data = await getCurrentProfile();

        setProfile(data);

        // Fetch user's rides
        const rides = await getMyRides();

        const now = new Date();

        const upcoming = rides
          .filter((ride) => ride.status === "active")
          .filter(
            (ride) =>
              new Date(
                `${ride.ride_date}T${ride.ride_time}`
              ) >= now
          )
          .sort(
            (a, b) =>
              new Date(
                `${a.ride_date}T${a.ride_time}`
              ).getTime() -
              new Date(
                `${b.ride_date}T${b.ride_time}`
              ).getTime()
          );

        setUpcomingRide(upcoming[0] ?? null);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const firstName =
    profile.full_name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Greeting */}
      <section>
        <p className="text-sm font-semibold text-blue-600">
          Your commute dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">
          Good to see you, {firstName}. 👋
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Find your next ride, offer an empty seat, and make
          your everyday commute more efficient.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">

        <QuickAction
          title="Find a Ride"
          description="Discover compatible commuters travelling your way."
          href="/find-ride"
          icon={Search}
        />

        <QuickAction
          title="Offer a Ride"
          description="Share your empty seats and split travel costs."
          href="/offer-ride"
          icon={PlusCircle}
        />

      </section>

      {/* Stats */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-950">
            Your commute overview
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total rides"
            value="12"
            description="Completed rides"
            icon={CarFront}
          />

          <StatCard
            label="Money saved"
            value="₹840"
            description="Estimated savings"
            icon={IndianRupee}
          />

          <StatCard
            label="Time saved"
            value="6.5h"
            description="Across your rides"
            icon={Clock3}
          />

          <StatCard
            label="Your rating"
            value="4.8"
            description="From 9 reviews"
            icon={Star}
          />

        </div>
      </section>

      {/* Lower Content */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

        <UpcomingRide ride={upcomingRide} />

        <AIRecommendation />

      </section>

    </div>
  );
}