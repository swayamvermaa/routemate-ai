"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";

import {
  cancelRide,
  getMyRides,
  Ride,
} from "@/services/rideService";

export default function MyRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(
    null
  );

  async function loadRides() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getMyRides();

      setRides(data);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load your rides."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRides();
  }, []);

  async function handleCancel(rideId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this ride?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(rideId);

      await cancelRide(rideId);

      setRides((current) =>
        current.map((ride) =>
          ride.id === rideId
            ? { ...ride, status: "cancelled" }
            : ride
        )
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to cancel the ride."
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          My Rides
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Your shared journeys
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage rides you have offered to the RouteMate community.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading your rides...
          </p>
        </div>
      ) : rides.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Car size={25} />
          </div>

          <h2 className="mt-5 font-semibold text-slate-950">
            No rides yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            You haven't offered any rides yet. Publish your
            first journey and start sharing your commute.
          </p>

          <a
            href="/offer-ride"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Offer a ride
          </a>
        </div>
      ) : (
        <div className="space-y-5">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              cancelling={cancellingId === ride.id}
              onCancel={() => handleCancel(ride.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RideCard({
  ride,
  cancelling,
  onCancel,
}: {
  ride: Ride;
  cancelling: boolean;
  onCancel: () => void;
}) {
  const formattedDate = new Date(
    `${ride.ride_date}T${ride.ride_time}`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(
    `${ride.ride_date}T${ride.ride_time}`
  ).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isCancelled = ride.status === "cancelled";

  return (
    <div
      className={`rounded-3xl border bg-white p-6 shadow-sm ${
        isCancelled
          ? "border-slate-200 opacity-70"
          : "border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isCancelled
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {ride.status}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              ₹{ride.contribution} / passenger
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Location
              icon={<MapPin size={17} />}
              label="Pickup"
              value={ride.pickup_location}
            />

            <Location
              icon={<MapPin size={17} />}
              label="Destination"
              value={ride.destination}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              {formattedDate}
            </span>

            <span className="flex items-center gap-2">
              <Clock size={16} />
              {formattedTime}
            </span>

            <span className="flex items-center gap-2">
              <Users size={16} />
              {ride.available_seats} seat
              {ride.available_seats !== 1 ? "s" : ""}
            </span>

            {ride.vehicle_name && (
              <span className="flex items-center gap-2">
                <Car size={16} />
                {ride.vehicle_name}
              </span>
            )}
          </div>
        </div>

        {!isCancelled && (
          <button
            onClick={onCancel}
            disabled={cancelling}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle size={17} />

            {cancelling ? "Cancelling..." : "Cancel ride"}
          </button>
        )}
      </div>
    </div>
  );
}

function Location({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-blue-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}