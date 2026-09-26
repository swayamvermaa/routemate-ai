"use client";

import Link from "next/link";
import {
  CalendarDays,
  Car,
  Clock,
  Edit3,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";

import { Ride } from "@/services/rideService";

type RideCardProps = {
  ride: Ride;
  showActions?: boolean;
  cancelling?: boolean;
  onCancel?: () => void;
};

function formatRideDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatRideTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  full: "bg-amber-50 text-amber-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
};

const statusLabels = {
  active: "Active",
  full: "Full",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function RideCard({
  ride,
  showActions = true,
  cancelling = false,
  onCancel,
}: RideCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      {/* Top */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              statusStyles[ride.status]
            }`}
          >
            {statusLabels[ride.status]}
          </span>

          <span className="text-xs font-medium text-slate-400">
            {ride.available_seats}{" "}
            {ride.available_seats === 1
              ? "seat"
              : "seats"}{" "}
            available
          </span>
        </div>

        <div className="text-lg font-bold text-slate-950">
          ₹{Number(ride.contribution).toFixed(0)}
        </div>
      </div>

      {/* Route */}
      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex gap-3">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <MapPin size={17} />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pickup
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {ride.pickup_location}
            </p>
          </div>
        </div>

        <div className="hidden h-px w-12 bg-slate-200 md:block" />

        <div className="flex gap-3">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <MapPin size={17} />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Destination
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {ride.destination}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <Detail
          icon={<CalendarDays size={16} />}
          label="Date"
          value={formatRideDate(ride.ride_date)}
        />

        <Detail
          icon={<Clock size={16} />}
          label="Time"
          value={formatRideTime(ride.ride_time)}
        />

        <Detail
          icon={<Users size={16} />}
          label="Seats"
          value={`${ride.available_seats} available`}
        />

        <Detail
          icon={<Car size={16} />}
          label="Vehicle"
          value={ride.vehicle_name || "Not specified"}
        />
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          {ride.status === "active" && (
            <Link
              href={`/my-rides/${ride.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <Edit3 size={16} />
              Edit ride
            </Link>
          )}

          {ride.status === "active" && onCancel && (
            <button
              type="button"
              disabled={cancelling}
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={16} />

              {cancelling
                ? "Cancelling..."
                : "Cancel ride"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}