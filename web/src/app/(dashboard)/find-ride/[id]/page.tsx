"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  User,
  Users,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";

import {
  getMyBookingForRide,
  getRideWithDriver,
  requestToJoinRide,
} from "@/services/rideService";

type DriverProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  college_workplace: string | null;
};

type RideWithDriver = {
  id: string;
  driver_id: string;

  pickup_location: string;
  pickup_lat: number | null;
  pickup_lng: number | null;

  destination: string;
  destination_lat: number | null;
  destination_lng: number | null;

  ride_date: string;
  ride_time: string;

  available_seats: number;
  contribution: number;

  vehicle_name: string | null;
  vehicle_number: string | null;

  notes: string | null;

  status:
    | "active"
    | "full"
    | "completed"
    | "cancelled";

  created_at: string;
  updated_at: string;

  profiles: DriverProfile | null;
};

type RideDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function RideDetailsPage({
  params,
}: RideDetailsPageProps) {
  const [ride, setRide] =
    useState<RideWithDriver | null>(null);

  const [booking, setBooking] = useState<
    Awaited<ReturnType<typeof getMyBookingForRide>>
  >(null);

  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] =
    useState("");

  useEffect(() => {
    async function loadRide() {
      try {
        setLoading(true);
        setError("");
        setRequestMessage("");

        const { id } = await params;

        const data = await getRideWithDriver(id);

        setRide(data as RideWithDriver);

        const existingBooking =
          await getMyBookingForRide(id);

        setBooking(existingBooking);
      } catch (err) {
        console.error(
          "Failed to load ride:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load ride details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRide();
  }, [params]);

  async function handleRequestToJoin() {
    if (!ride) {
      return;
    }

    if (ride.available_seats <= 0) {
      setRequestMessage("This ride is full.");
      return;
    }

    if (booking) {
      setRequestMessage(
        `You already have a ${booking.status} booking for this ride.`
      );
      return;
    }

    try {
      setRequesting(true);
      setRequestMessage("");

      const createdBooking =
        await requestToJoinRide(ride.id);

      setBooking(createdBooking);

      setRequestMessage(
        "Your request has been sent to the driver."
      );
    } catch (err) {
  console.error("Failed to request ride:", err);
  setRequestMessage(
    err instanceof Error
      ? err.message
      : "Unable to send your request."
  );

      setRequestMessage(
        err instanceof Error
          ? err.message
          : "Unable to send your request. Please try again."
      );
    } finally {
      setRequesting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Ride details"
          title="Loading ride..."
          description="Please wait while we load the ride details."
          backHref="/find-ride"
          backLabel="Back to Find Ride"
        />

        <div className="mt-6 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-4 h-4 w-72 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !ride) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Ride details"
          title="Ride not found"
          description={
            error ||
            "The ride you are looking for is no longer available."
          }
          backHref="/find-ride"
          backLabel="Back to Find Ride"
        />

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <p className="text-sm text-red-700 dark:text-red-300">
            We could not load this ride. Please go
            back and try again.
          </p>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(
    `${ride.ride_date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const driver = ride.profiles;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Ride details"
        title={`${ride.pickup_location} → ${ride.destination}`}
        description="View the complete ride information before requesting to join."
        backHref="/find-ride"
        backLabel="Back to Find Ride"
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main ride information */}
        <section className="space-y-6">
          {/* Route card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Ride route
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Complete journey information
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium capitalize text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {ride.status}
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Pickup
                  </p>

                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                    {ride.pickup_location}
                  </p>
                </div>
              </div>

              <div className="ml-5 h-6 border-l border-dashed border-slate-300 dark:border-slate-700" />

              <div className="flex gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Destination
                  </p>

                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                    {ride.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ride information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Ride information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Date */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-500" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-violet-500" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Departure time
                    </p>

                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      {ride.ride_time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available seats */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-emerald-500" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Available seats
                    </p>

                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      {ride.available_seats}{" "}
                      {ride.available_seats === 1
                        ? "seat"
                        : "seats"}
                    </p>

                    {ride.available_seats === 1 && (
                      <p className="mt-1 text-xs font-semibold text-amber-600">
                        Almost full · Book fast
                      </p>
                    )}

                    {ride.available_seats <= 0 && (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        Fully booked
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contribution */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-amber-500" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Contribution
                    </p>

                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      ₹{ride.contribution}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Car className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Vehicle
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Vehicle information provided by the
                  driver
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Vehicle
                </p>

                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {ride.vehicle_name ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Vehicle number
                </p>

                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {ride.vehicle_number ||
                    "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {ride.notes && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Driver notes
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                {ride.notes}
              </p>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Driver */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Driver
            </h2>

            <div className="mt-5 flex items-center gap-4">
              {driver?.avatar_url ? (
                <img
                  src={driver.avatar_url}
                  alt={
                    driver.full_name || "Driver"
                  }
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  <User className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-white">
                  {driver?.full_name || "Driver"}
                </p>

                {driver?.city && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {driver.city}
                  </p>
                )}

                {driver?.college_workplace && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {driver.college_workplace}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Request card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Interested in this ride?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Send a request to the driver to join this
              ride.
            </p>

            {/* STEP 10 - Request status / button */}
            <div className="mt-5">
              {booking?.status === "accepted" ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                    You&apos;re in! 🎉
                  </p>

                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                    Your seat has been reserved.
                  </p>
                </div>
              ) : booking?.status === "pending" ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center dark:border-amber-900/50 dark:bg-amber-950/20">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">
                    Request pending
                  </p>

                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Waiting for the driver to accept your
                    request.
                  </p>
                </div>
              ) : booking?.status === "rejected" ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center dark:border-red-900/50 dark:bg-red-950/20">
                  <p className="font-semibold text-red-700 dark:text-red-300">
                    Request rejected
                  </p>

                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    The driver rejected your request.
                  </p>
                </div>
              ) : booking?.status === "cancelled" ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Booking cancelled
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    This booking has been cancelled.
                  </p>
                </div>
              ) : ride.available_seats <= 0 ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl bg-slate-400 px-4 py-3 text-sm font-semibold text-white"
                >
                  Ride Full
                </button>
              ) : ride.status !== "active" ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl bg-slate-400 px-4 py-3 text-sm font-semibold text-white"
                >
                  Ride Unavailable
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestToJoin}
                  disabled={requesting}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {requesting
                    ? "Sending request..."
                    : "Request to Join"}
                </button>
              )}
            </div>

            {/* Request message */}
            {requestMessage && (
              <p className="mt-3 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                {requestMessage}
              </p>
            )}

            <Link
              href="/find-ride"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Find Ride
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}