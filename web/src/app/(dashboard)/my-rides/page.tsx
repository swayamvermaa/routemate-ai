"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock3,
  PlusCircle,
  User,
  X,
} from "lucide-react";

import RideCard from "@/components/dashboard/RideCard";
import PageHeader from "@/components/dashboard/PageHeader";

import {
  acceptBooking,
  cancelRide,
  getMyRides,
  getRideBookingRequests,
  rejectBooking,
  Ride,
} from "@/services/rideService";

type RideSection = {
  title: string;
  description: string;
  rides: Ride[];
};

type BookingRequest = {
  id: string;
  ride_id: string;
  passenger_id: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "cancelled"
    | "completed";
  requested_at: string;
  responded_at: string | null;
  created_at: string;
  updated_at: string;

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

export default function MyRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [cancellingId, setCancellingId] =
    useState<string | null>(null);

  const [bookingRequests, setBookingRequests] =
    useState<Record<string, BookingRequest[]>>({});

  const [loadingRequests, setLoadingRequests] =
    useState<Record<string, boolean>>({});

  const [processingBookingId, setProcessingBookingId] =
    useState<string | null>(null);

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

  async function loadBookingRequests(
    rideId: string
  ) {
    try {
      setLoadingRequests((current) => ({
        ...current,
        [rideId]: true,
      }));

      const data =
        await getRideBookingRequests(rideId);

      setBookingRequests((current) => ({
        ...current,
        [rideId]: (data ?? []) as BookingRequest[],
      }));
    } catch (error) {
      console.error(
        "Failed to load booking requests:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load booking requests."
      );
    } finally {
      setLoadingRequests((current) => ({
        ...current,
        [rideId]: false,
      }));
    }
  }

  useEffect(() => {
    if (rides.length === 0) {
      return;
    }

    const activeRides = rides.filter(
      (ride) =>
        ride.status === "active" ||
        ride.status === "full"
    );

    activeRides.forEach((ride) => {
      loadBookingRequests(ride.id);
    });
  }, [rides]);

  async function handleCancel(rideId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this ride?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(rideId);
      setErrorMessage("");

      await cancelRide(rideId);

      setRides((current) =>
        current.map((ride) =>
          ride.id === rideId
            ? {
                ...ride,
                status: "cancelled",
              }
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

  async function handleAcceptBooking(
    bookingId: string,
    rideId: string
  ) {
    try {
      setProcessingBookingId(bookingId);
      setErrorMessage("");

      await acceptBooking(bookingId);

      await loadBookingRequests(rideId);

      await loadRides();
    } catch (error) {
      console.error(
        "Failed to accept booking:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to accept this request."
      );
    } finally {
      setProcessingBookingId(null);
    }
  }

  async function handleRejectBooking(
    bookingId: string,
    rideId: string
  ) {
    try {
      setProcessingBookingId(bookingId);
      setErrorMessage("");

      await rejectBooking(bookingId);

      await loadBookingRequests(rideId);
    } catch (error) {
      console.error(
        "Failed to reject booking:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to reject this request."
      );
    } finally {
      setProcessingBookingId(null);
    }
  }

  const sections = useMemo<RideSection[]>(
    () => [
      {
        title: "Upcoming",
        description:
          "Rides you have scheduled for the future.",
        rides: rides.filter(
          (ride) =>
            ride.status === "active" ||
            ride.status === "full"
        ),
      },
      {
        title: "Completed",
        description:
          "Journeys that have already ended.",
        rides: rides.filter(
          (ride) => ride.status === "completed"
        ),
      },
      {
        title: "Cancelled",
        description:
          "Rides that you cancelled.",
        rides: rides.filter(
          (ride) => ride.status === "cancelled"
        ),
      },
    ],
    [rides]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="My Rides"
        title="Your shared journeys"
        description="Manage the rides you offer to the RouteMate community."
        action={
          <Link
            href="/offer-ride"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            <PlusCircle size={17} />
            Offer a ride
          </Link>
        }
      />

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your rides...
          </p>
        </div>
      ) : rides.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          {sections.map((section) => {
            if (section.rides.length === 0) {
              return null;
            }

            return (
              <section key={section.title}>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-950">
                    {section.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {section.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {section.rides.map((ride) => (
                    <div
                      key={ride.id}
                      className="space-y-4"
                    >
                      <RideCard
                        ride={ride}
                        cancelling={
                          cancellingId === ride.id
                        }
                        onCancel={() =>
                          handleCancel(ride.id)
                        }
                      />

                      {(ride.status === "active" ||
                        ride.status === "full") && (
                        <BookingRequests
                          ride={ride}
                          requests={
                            bookingRequests[
                              ride.id
                            ] ?? []
                          }
                          loading={
                            loadingRequests[
                              ride.id
                            ] ?? false
                          }
                          processingBookingId={
                            processingBookingId
                          }
                          onAccept={
                            handleAcceptBooking
                          }
                          onReject={
                            handleRejectBooking
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

type BookingRequestsProps = {
  ride: Ride;
  requests: BookingRequest[];
  loading: boolean;
  processingBookingId: string | null;
  onAccept: (
    bookingId: string,
    rideId: string
  ) => void;
  onReject: (
    bookingId: string,
    rideId: string
  ) => void;
};

function BookingRequests({
  ride,
  requests,
  loading,
  processingBookingId,
  onAccept,
  onReject,
}: BookingRequestsProps) {
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  const processedRequests = requests.filter(
    (request) =>
      request.status === "accepted" ||
      request.status === "rejected"
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            Booking Requests
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Passengers who want to join this ride.
          </p>
        </div>

        {pendingRequests.length > 0 && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Clock3 className="h-3.5 w-3.5" />
            {pendingRequests.length} pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-8 text-center">
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading booking requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <User className="h-5 w-5" />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            No booking requests yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Passenger requests will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {pendingRequests.map((request) => (
            <BookingRequestCard
              key={request.id}
              request={request}
              rideId={ride.id}
              processing={
                processingBookingId === request.id
              }
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}

          {processedRequests.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Previous requests
              </p>

              <div className="space-y-3">
                {processedRequests.map((request) => (
                  <ProcessedBookingCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type BookingRequestCardProps = {
  request: BookingRequest;
  rideId: string;
  processing: boolean;
  onAccept: (
    bookingId: string,
    rideId: string
  ) => void;
  onReject: (
    bookingId: string,
    rideId: string
  ) => void;
};

function BookingRequestCard({
  request,
  rideId,
  processing,
  onAccept,
  onReject,
}: BookingRequestCardProps) {
  const passenger = request.profiles;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {passenger?.avatar_url ? (
            <img
              src={passenger.avatar_url}
              alt={
                passenger.full_name ||
                "Passenger"
              }
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
              <User className="h-5 w-5" />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {passenger?.full_name ||
                "Passenger"}
            </p>

            {passenger?.college_workplace && (
              <p className="mt-0.5 truncate text-sm text-slate-500">
                {passenger.college_workplace}
              </p>
            )}

            {passenger?.city && (
              <p className="mt-0.5 text-xs text-slate-400">
                {passenger.city}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 sm:shrink-0">
          <button
            type="button"
            onClick={() =>
              onAccept(request.id, rideId)
            }
            disabled={processing}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            <Check className="h-4 w-4" />

            {processing
              ? "Processing..."
              : "Accept"}
          </button>

          <button
            type="button"
            onClick={() =>
              onReject(request.id, rideId)
            }
            disabled={processing}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            <X className="h-4 w-4" />

            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

type ProcessedBookingCardProps = {
  request: BookingRequest;
};

function ProcessedBookingCard({
  request,
}: ProcessedBookingCardProps) {
  const passenger = request.profiles;

  const isAccepted =
    request.status === "accepted";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {passenger?.avatar_url ? (
          <img
            src={passenger.avatar_url}
            alt={
              passenger.full_name ||
              "Passenger"
            }
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-400">
            <User className="h-4 w-4" />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {passenger?.full_name ||
              "Passenger"}
          </p>

          {passenger?.college_workplace && (
            <p className="truncate text-xs text-slate-500">
              {passenger.college_workplace}
            </p>
          )}
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isAccepted
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {isAccepted
          ? "Accepted"
          : "Rejected"}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <PlusCircle size={25} />
      </div>

      <h2 className="mt-5 text-lg font-bold text-slate-950">
        No rides yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        You haven&apos;t offered any rides yet.
        Publish your first journey and start
        sharing your commute.
      </p>

      <Link
        href="/offer-ride"
        className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
      >
        Offer your first ride
      </Link>
    </div>
  );
}