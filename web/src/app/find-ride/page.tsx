"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Search,
  Users,
} from "lucide-react";

import { Ride, searchRides } from "@/services/rideService";

type SearchForm = {
  pickup: string;
  destination: string;
  date: string;
  time: string;
};

export default function FindRidePage() {
  const [form, setForm] = useState<SearchForm>({
    pickup: "",
    destination: "",
    date: "",
    time: "",
  });

  const [rides, setRides] = useState<Ride[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(
    field: keyof SearchForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!form.pickup.trim()) {
      setErrorMessage("Please enter your pickup location.");
      return;
    }

    if (!form.destination.trim()) {
      setErrorMessage("Please enter your destination.");
      return;
    }

    if (!form.date) {
      setErrorMessage("Please select a date.");
      return;
    }

    if (!form.time) {
      setErrorMessage("Please select a time.");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const results = await searchRides(form);

      setRides(results);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to search rides."
      );

      setRides([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Find a Ride
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Find your next ride
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Search for commuters already travelling your way
          and share the journey instead of travelling alone.
        </p>
      </div>

      {/* Search box */}

      <form
        onSubmit={handleSearch}
        className="rounded-3xl bg-slate-950 p-5 shadow-xl sm:p-7"
      >
        <div className="mb-5 flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Search size={20} />
          </div>

          <div>
            <h2 className="font-semibold">
              Search available rides
            </h2>

            <p className="text-xs text-slate-400">
              Tell us where and when you want to travel.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_170px_150px_auto]">
          <SearchInput
            label="Pickup"
            placeholder="e.g. Sikandra"
            value={form.pickup}
            onChange={(value) =>
              updateField("pickup", value)
            }
          />

          <SearchInput
            label="Destination"
            placeholder="e.g. Sharda University"
            value={form.destination}
            onChange={(value) =>
              updateField("destination", value)
            }
          />

          <SearchInput
            label="Date"
            type="date"
            value={form.date}
            onChange={(value) =>
              updateField("date", value)
            }
          />

          <SearchInput
            label="Time"
            type="time"
            value={form.time}
            onChange={(value) =>
              updateField("time", value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-auto flex h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={17} />

            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}
      </form>

      {/* Results */}

      <div className="mt-10">
        {!searched ? (
          <EmptySearchState />
        ) : loading ? (
          <LoadingState />
        ) : rides.length === 0 ? (
          <NoResultsState />
        ) : (
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Available rides
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {rides.length} ride
                  {rides.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-[46px] w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function RideCard({ ride }: { ride: Ride }) {
  const rideDate = new Date(
    `${ride.ride_date}T${ride.ride_time}`
  );

  const formattedDate = rideDate.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );

  const formattedTime = rideDate.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Route */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Pickup
                  </p>

                  <p className="mt-1 truncate font-semibold text-slate-950">
                    {ride.pickup_location}
                  </p>
                </div>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="hidden shrink-0 text-slate-300 sm:block"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-900" />

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Destination
                  </p>

                  <p className="mt-1 truncate font-semibold text-slate-950">
                    {ride.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formattedDate}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {formattedTime}
            </span>

            <span className="flex items-center gap-1.5">
              <Users size={14} />
              {ride.available_seats} seat
              {ride.available_seats !== 1 ? "s" : ""}
            </span>

            {ride.vehicle_name && (
              <span className="flex items-center gap-1.5">
                <Car size={14} />
                {ride.vehicle_name}
              </span>
            )}
          </div>
        </div>

        {/* Price + CTA */}

        <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-5 lg:block lg:w-40 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div>
            <p className="text-xs text-slate-400">
              Contribution
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-950">
              ₹{ride.contribution}
            </p>

            <p className="text-xs text-slate-400">
              per passenger
            </p>
          </div>

          <Link
            href={`/find-ride/${ride.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-600 lg:mt-4"
          >
            View ride
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Search size={24} />
      </div>

      <h2 className="mt-5 font-semibold text-slate-950">
        Where are you heading?
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Enter your pickup, destination, date and preferred
        time to discover available rides.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

      <p className="mt-5 text-sm font-medium text-slate-700">
        Finding rides for you...
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Checking available journeys.
      </p>
    </div>
  );
}

function NoResultsState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <MapPin size={24} />
      </div>

      <h2 className="mt-5 font-semibold text-slate-950">
        No matching rides found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try another time, date, pickup location or destination.
        RouteMate AI matching will make this even smarter later.
      </p>

      <Link
        href="/offer-ride"
        className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
      >
        Offer your own ride
      </Link>
    </div>
  );
}