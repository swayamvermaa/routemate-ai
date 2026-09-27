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
  Banknote,
  Smartphone,
  X,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";

import {
  getRideWithDriver,
  getMyBookingForRide,
  requestToJoinRide,
  type Booking,
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

  accepts_cash: boolean;
  accepts_upi: boolean;
  upi_id: string | null;

  status:
    | "active"
    | "full"
    | "completed"
    | "cancelled";

  created_at: string;
  updated_at: string;

  profiles: DriverProfile | null;
};

type PaymentMethod = "cash" | "upi";

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

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [bookingError, setBookingError] =
    useState("");

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null);

  useEffect(() => {
    async function loadRide() {
      try {
        setLoading(true);
        setError("");

        const { id } = await params;

        const [rideData, bookingData] =
          await Promise.all([
            getRideWithDriver(id),
            getMyBookingForRide(id),
          ]);

        setRide(
          rideData as RideWithDriver
        );

        setBooking(
          bookingData as Booking | null
        );
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
    if (!ride) return;

    setBookingError("");

    if (!paymentMethod) {
      setBookingError(
        "Please select a payment method."
      );
      return;
    }

    if (
      paymentMethod === "cash" &&
      !ride.accepts_cash
    ) {
      setBookingError(
        "Cash payment is not available for this ride."
      );
      return;
    }

    if (
      paymentMethod === "upi" &&
      !ride.accepts_upi
    ) {
      setBookingError(
        "UPI payment is not available for this ride."
      );
      return;
    }

    if (
      paymentMethod === "upi" &&
      !ride.upi_id
    ) {
      setBookingError(
        "The driver's UPI ID is not available."
      );
      return;
    }

    try {
      setBookingLoading(true);

      const newBooking =
        await requestToJoinRide(
          ride.id,
          paymentMethod
        );

      setBooking(newBooking);

      setShowConfirmation(false);
      setPaymentMethod(null);
    } catch (err) {
      console.error(
        "Failed to request ride:",
        err
      );

      setBookingError(
        err instanceof Error
          ? err.message
          : "Unable to send your ride request."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  function openConfirmation() {
    setBookingError("");

    if (!ride) return;

    if (ride.available_seats <= 0) {
      setBookingError(
        "This ride is already full."
      );
      return;
    }

    if (
      !ride.accepts_cash &&
      !ride.accepts_upi
    ) {
      setBookingError(
        "This ride currently has no payment method available."
      );
      return;
    }

    if (ride.accepts_cash) {
      setPaymentMethod("cash");
    } else if (ride.accepts_upi) {
      setPaymentMethod("upi");
    }

    setShowConfirmation(true);
  }

  function closeConfirmation() {
    if (bookingLoading) return;

    setShowConfirmation(false);
    setBookingError("");
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
            We could not load this ride. Please go back and try
            again.
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

  const hasPendingBooking =
    booking?.status === "pending";

  const hasAcceptedBooking =
    booking?.status === "accepted";

  const hasRejectedBooking =
    booking?.status === "rejected";

  const hasCancelledBooking =
    booking?.status === "cancelled";

  return (
    <>
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

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                    ride.status === "active"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />

                  {ride.status === "active"
                    ? "Available"
                    : ride.status}
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
                <InfoCard
                  icon={
                    <CalendarDays className="h-5 w-5 text-blue-500" />
                  }
                  label="Date"
                  value={formattedDate}
                />

                <InfoCard
                  icon={
                    <Clock className="h-5 w-5 text-violet-500" />
                  }
                  label="Departure time"
                  value={ride.ride_time}
                />

                <InfoCard
                  icon={
                    <Users className="h-5 w-5 text-emerald-500" />
                  }
                  label="Available seats"
                  value={`${ride.available_seats} ${
                    ride.available_seats === 1
                      ? "seat"
                      : "seats"
                  }`}
                />

                <InfoCard
                  icon={
                    <IndianRupee className="h-5 w-5 text-amber-500" />
                  }
                  label="Contribution"
                  value={`₹${ride.contribution}`}
                />
              </div>
            </div>

            {/* Payment options */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Payment options
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Payment is made directly to the driver after the ride.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {ride.accepts_cash && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
                      <Banknote className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Cash after ride
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Pay the driver in cash.
                      </p>
                    </div>
                  </div>
                )}

                {ride.accepts_upi && (
                  <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-900/50 dark:bg-violet-950/20">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300">
                      <Smartphone className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        UPI after ride
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Pay using the driver's UPI ID.
                      </p>
                    </div>
                  </div>
                )}
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
                    Vehicle information provided by the driver
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vehicle
                  </p>

                  <p className="mt-1 font-medium text-slate-900 dark:text-white">
                    {ride.vehicle_name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vehicle number
                  </p>

                  <p className="mt-1 font-medium text-slate-900 dark:text-white">
                    {ride.vehicle_number || "Not provided"}
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

            {/* Booking status */}
            {hasAcceptedBooking && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Booking Confirmed 🎉
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Your seat has been reserved for this ride.
                </p>

                <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/50 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Payment method
                  </p>

                  <p className="mt-1 text-sm font-semibold capitalize text-slate-900 dark:text-white">
                    {booking?.payment_method === "upi"
                      ? "UPI after ride"
                      : "Cash after ride"}
                  </p>

                  {booking?.payment_method === "upi" &&
                    ride.upi_id && (
                      <p className="mt-2 text-xs text-violet-600 dark:text-violet-300">
                        UPI ID: {ride.upi_id}
                      </p>
                    )}
                </div>

                <Link
                  href="/my-rides"
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  View My Rides
                </Link>
              </div>
            )}

            {hasPendingBooking && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
                  <Clock className="h-6 w-6" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Request Pending
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Your request has been sent to the driver. Waiting for their response.
                </p>

                <div className="mt-4 rounded-xl bg-white p-4 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Selected payment
                  </p>

                  <p className="mt-1 text-sm font-semibold capitalize text-slate-900 dark:text-white">
                    {booking?.payment_method === "upi"
                      ? "UPI after ride"
                      : "Cash after ride"}
                  </p>
                </div>
              </div>
            )}

            {hasRejectedBooking && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Request Rejected
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300">
                  The driver has rejected your request for this ride.
                </p>
              </div>
            )}

            {hasCancelledBooking && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Booking Cancelled
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Your previous booking for this ride was cancelled.
                </p>
              </div>
            )}

            {/* Request card */}
            {!hasAcceptedBooking &&
              !hasPendingBooking && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/20">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Interested in this ride?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Choose your payment method and send a request to the driver.
                  </p>

                  {bookingError && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                      {bookingError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={openConfirmation}
                    disabled={
                      ride.available_seats <= 0 ||
                      ride.status !== "active"
                    }
                    className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {ride.available_seats > 0 &&
                    ride.status === "active"
                      ? "Request to Join"
                      : "Ride Full"}
                  </button>
                </div>
              )}

            <Link
              href="/find-ride"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Find Ride
            </Link>
          </aside>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl dark:bg-slate-900">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Confirm booking
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                  Confirm Your Ride
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select how you will pay after the ride.
                </p>
              </div>

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={bookingLoading}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Route summary */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {ride.pickup_location}
                    </p>

                    <div className="my-1 ml-1 h-3 border-l border-dashed border-slate-300 dark:border-slate-600" />

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {ride.destination}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {formattedDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {ride.ride_time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contribution */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Contribution
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                    ₹{ride.contribution}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300">
                  <IndianRupee className="h-5 w-5" />
                </div>
              </div>

              {/* Payment selection */}
              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select payment method
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    You will pay the driver after completing the ride.
                  </p>
                </div>

                <div className="space-y-3">
                  {ride.accepts_cash && (
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod("cash")
                      }
                      disabled={bookingLoading}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        paymentMethod === "cash"
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10 dark:border-emerald-500 dark:bg-emerald-950/20"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          paymentMethod === "cash"
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <Banknote className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Cash after ride
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Pay ₹{ride.contribution} directly to the driver.
                        </p>
                      </div>

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          paymentMethod === "cash"
                            ? "border-emerald-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {paymentMethod === "cash" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    </button>
                  )}

                  {ride.accepts_upi && (
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod("upi")
                      }
                      disabled={bookingLoading}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        paymentMethod === "upi"
                          ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/10 dark:border-violet-500 dark:bg-violet-950/20"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            paymentMethod === "upi"
                              ? "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          <Smartphone className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            UPI after ride
                          </p>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Pay ₹{ride.contribution} using UPI.
                          </p>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            paymentMethod === "upi"
                              ? "border-violet-500"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {paymentMethod === "upi" && (
                            <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                          )}
                        </div>
                      </div>

                      {/* UPI ID only in booking context */}
                      {paymentMethod === "upi" &&
                        ride.upi_id && (
                          <div className="mt-4 rounded-xl border border-violet-200 bg-white p-3 dark:border-violet-900/50 dark:bg-slate-900">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Driver UPI ID
                            </p>

                            <p className="mt-1 break-all text-sm font-bold text-violet-700 dark:text-violet-300">
                              {ride.upi_id}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Save this for payment after the ride.
                            </p>
                          </div>
                        )}
                    </button>
                  )}
                </div>
              </div>

              {/* Error */}
              {bookingError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                  {bookingError}
                </div>
              )}

              {/* Confirm */}
              <button
                type="button"
                onClick={handleRequestToJoin}
                disabled={
                  bookingLoading ||
                  !paymentMethod
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingLoading
                  ? "Sending request..."
                  : "Send Ride Request"}

                {!bookingLoading && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your booking is not confirmed until the driver accepts your request.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
      <div className="flex items-center gap-3">
        {icon}

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-1 font-medium text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}