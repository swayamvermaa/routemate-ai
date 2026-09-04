"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import { Ride } from "@/services/rideService";

export default function UpcomingRide({
  ride,
}: {
  ride: Ride | null;
}) {
  if (!ride) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              Upcoming ride
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Your next shared journey will appear here.
            </p>
          </div>

          <Link
            href="/offer-ride"
            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
          >
            Offer ride
          </Link>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">
            No upcoming rides found.
          </p>
        </div>
      </div>
    );
  }

  const rideDate = new Date(
    `${ride.ride_date}T${ride.ride_time}`
  );

  const formattedDate = rideDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const formattedTime = rideDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Upcoming ride
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your next scheduled journey.
          </p>
        </div>

        <Link
          href="/my-rides"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View rides
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />

              <p className="text-sm font-semibold text-slate-950">
                {ride.pickup_location}
              </p>
            </div>

            <div className="ml-1 mt-1 h-7 border-l border-dashed border-slate-300" />

            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />

              <p className="text-sm font-semibold text-slate-950">
                {ride.destination}
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-xs text-slate-500 sm:text-right">
            <span className="flex items-center gap-2 sm:justify-end">
              <CalendarDays size={15} />
              {formattedDate}
            </span>

            <span className="flex items-center gap-2 sm:justify-end">
              <Clock size={15} />
              {formattedTime}
            </span>

            <span className="flex items-center gap-2 sm:justify-end">
              <MapPin size={15} />
              {ride.available_seats} seat
              {ride.available_seats !== 1 ? "s" : ""} available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}