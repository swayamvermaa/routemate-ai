"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Users,
} from "lucide-react";

import { getRideWithDriver } from "@/services/rideService";

type RideDetails = {
  id: string;
  driver_id: string;
  pickup_location: string;
  destination: string;
  ride_date: string;
  ride_time: string;
  available_seats: number;
  contribution: number;
  vehicle_name: string | null;
  vehicle_number: string | null;
  notes: string | null;
  status: string;
  profiles:
    | {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
        city: string | null;
        college_workplace: string | null;
      }
    | null;
};

export default function RideDetailsPage() {
  const params = useParams();

  const rideId = params.id as string;

  const [ride, setRide] = useState<RideDetails | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRide() {
      try {
        setLoading(true);

        const data = await getRideWithDriver(rideId);

        setRide(data as RideDetails);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load ride details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (rideId) {
      loadRide();
    }
  }, [rideId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

        <p className="mt-5 text-sm text-slate-500">
          Loading ride details...
        </p>
      </div>
    );
  }

  if (errorMessage || !ride) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <p className="font-semibold text-red-700">
            {errorMessage || "Ride not found."}
          </p>

          <Link
            href="/find-ride"
            className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to rides
          </Link>
        </div>
      </div>
    );
  }

  const rideDate = new Date(
    `${ride.ride_date}T${ride.ride_time}`
  );

  const formattedDate = rideDate.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formattedTime = rideDate.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  const driverName =
    ride.profiles?.full_name || "RouteMate member";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/find-ride"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
      >
        <ArrowLeft size={16} />
        Back to rides
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Ride details
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-950">
                {ride.pickup_location} →{" "}
                {ride.destination}
              </h1>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-600">
              {ride.status}
            </span>
          </div>

          {/* Route */}

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-blue-600" />

                <div className="h-14 border-l border-dashed border-slate-300" />

                <div className="h-3 w-3 rounded-full bg-slate-900" />
              </div>

              <div className="flex-1 space-y-8">
                <div>
                  <p className="text-xs text-slate-400">
                    Pickup
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {ride.pickup_location}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Destination
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {ride.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoBox
              icon={<CalendarDays size={18} />}
              label="Date"
              value={formattedDate}
            />

            <InfoBox
              icon={<Clock size={18} />}
              label="Departure"
              value={formattedTime}
            />

            <InfoBox
              icon={<Users size={18} />}
              label="Seats"
              value={`${ride.available_seats} available`}
            />
          </div>

          {/* Vehicle */}

          {(ride.vehicle_name || ride.vehicle_number) && (
            <div className="mt-6 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Car size={19} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Vehicle
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {ride.vehicle_name || "Vehicle"}
                  </p>

                  {ride.vehicle_number && (
                    <p className="mt-1 text-xs text-slate-500">
                      {ride.vehicle_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}

          {ride.notes && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-950">
                Driver notes
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {ride.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}

        <div className="space-y-5">
          {/* Driver */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">
              Your driver
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white">
                <User size={20} />
              </div>

              <div>
                <p className="font-semibold text-slate-950">
                  {driverName}
                </p>

                {ride.profiles?.college_workplace && (
                  <p className="mt-1 text-xs text-slate-500">
                    {ride.profiles.college_workplace}
                  </p>
                )}
              </div>
            </div>

            {ride.profiles?.city && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <MapPin size={14} />
                {ride.profiles.city}
              </div>
            )}
          </div>

          {/* Price */}

          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-400">
              Contribution
            </p>

            <div className="mt-2 flex items-end gap-2">
              <p className="text-3xl font-bold">
                ₹{ride.contribution}
              </p>

              <p className="pb-1 text-xs text-slate-400">
                per passenger
              </p>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <CheckCircle2
                size={17}
                className="mt-0.5 text-blue-400"
              />

              <p className="text-xs leading-5 text-slate-300">
                This is a cost-sharing contribution for the
                shared journey.
              </p>
            </div>

            <button
              disabled
              className="mt-6 w-full rounded-xl bg-white/10 px-5 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              Request to join
            </button>

            <p className="mt-3 text-center text-[11px] text-slate-500">
              Booking requests will be enabled in the next
              milestone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-blue-600">
        {icon}

        <span className="text-xs font-medium text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}