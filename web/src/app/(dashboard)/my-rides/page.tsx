"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import RideCard from "@/components/dashboard/RideCard";
import PageHeader from "@/components/dashboard/PageHeader";

import {
  cancelRide,
  getMyRides,
  Ride,
} from "@/services/rideService";

type RideSection = {
  title: string;
  description: string;
  rides: Ride[];
};

export default function MyRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cancellingId, setCancellingId] =
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

                <div className="space-y-5">
                  {section.rides.map((ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      cancelling={
                        cancellingId === ride.id
                      }
                      onCancel={() =>
                        handleCancel(ride.id)
                      }
                    />
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
        You haven't offered any rides yet. Publish your
        first journey and start sharing your commute.
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