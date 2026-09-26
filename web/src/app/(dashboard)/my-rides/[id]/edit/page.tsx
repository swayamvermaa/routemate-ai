"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/dashboard/PageHeader";

import {
  getRideWithDriver,
  updateRide,
  Ride,
} from "@/services/rideService";

export default function EditRidePage() {
  const params = useParams();
  const router = useRouter();

  const rideId = params.id as string;

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [form, setForm] = useState({
    pickup_location: "",
    destination: "",
    ride_date: "",
    ride_time: "",
    available_seats: "1",
    contribution: "0",
    vehicle_name: "",
    vehicle_number: "",
    notes: "",
  });

  useEffect(() => {
    async function loadRide() {
      try {
        setLoading(true);

        const data = await getRideWithDriver(
          rideId
        );

        if (!data) {
          throw new Error("Ride not found.");
        }

        const currentRide = data as Ride;

        setRide(currentRide);

        setForm({
          pickup_location:
            currentRide.pickup_location,
          destination:
            currentRide.destination,
          ride_date: currentRide.ride_date,
          ride_time:
            currentRide.ride_time.slice(0, 5),
          available_seats: String(
            currentRide.available_seats
          ),
          contribution: String(
            currentRide.contribution
          ),
          vehicle_name:
            currentRide.vehicle_name || "",
          vehicle_number:
            currentRide.vehicle_number || "",
          notes: currentRide.notes || "",
        });
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load ride."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRide();
  }, [rideId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");

      await updateRide(rideId, {
        pickup_location:
          form.pickup_location.trim(),
        destination:
          form.destination.trim(),
        ride_date: form.ride_date,
        ride_time: form.ride_time,
        available_seats: Number(
          form.available_seats
        ),
        contribution: Number(
          form.contribution
        ),
        vehicle_name:
          form.vehicle_name.trim() || null,
        vehicle_number:
          form.vehicle_number.trim() || null,
        notes: form.notes.trim() || null,
      });

      router.push("/my-rides");
      router.refresh();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update ride."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          Loading ride...
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Ride"
          title="Ride not found"
          backHref="/my-rides"
          backLabel="Back to My Rides"
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage ||
            "This ride could not be found."}
        </div>
      </div>
    );
  }

  if (ride.status !== "active") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Ride management"
          title="This ride cannot be edited"
          description="Only active rides can currently be edited."
          backHref="/my-rides"
          backLabel="Back to My Rides"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Ride management"
        title="Edit your ride"
        description="Update the details of your upcoming journey."
        backHref="/my-rides"
        backLabel="Back to My Rides"
      />

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Route
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="Pickup location"
              value={form.pickup_location}
              onChange={(value) =>
                setForm({
                  ...form,
                  pickup_location: value,
                })
              }
              required
            />

            <Field
              label="Destination"
              value={form.destination}
              onChange={(value) =>
                setForm({
                  ...form,
                  destination: value,
                })
              }
              required
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Schedule & seats
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field
              label="Date"
              type="date"
              value={form.ride_date}
              onChange={(value) =>
                setForm({
                  ...form,
                  ride_date: value,
                })
              }
              required
            />

            <Field
              label="Time"
              type="time"
              value={form.ride_time}
              onChange={(value) =>
                setForm({
                  ...form,
                  ride_time: value,
                })
              }
              required
            />

            <Field
              label="Available seats"
              type="number"
              min="1"
              max="8"
              value={form.available_seats}
              onChange={(value) =>
                setForm({
                  ...form,
                  available_seats: value,
                })
              }
              required
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Vehicle & contribution
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field
              label="Contribution"
              type="number"
              min="0"
              value={form.contribution}
              onChange={(value) =>
                setForm({
                  ...form,
                  contribution: value,
                })
              }
              required
            />

            <Field
              label="Vehicle"
              value={form.vehicle_name}
              onChange={(value) =>
                setForm({
                  ...form,
                  vehicle_name: value,
                })
              }
            />

            <Field
              label="Vehicle number"
              value={form.vehicle_number}
              onChange={(value) =>
                setForm({
                  ...form,
                  vehicle_number: value,
                })
              }
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-bold text-slate-700">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(event) =>
                setForm({
                  ...form,
                  notes: event.target.value,
                })
              }
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              placeholder="Any additional information..."
            />
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              router.push("/my-rides")
            }
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving changes..."
              : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        min={min}
        max={max}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}