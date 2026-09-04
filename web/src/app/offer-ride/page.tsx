"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  MapPin,
  Users,
} from "lucide-react";

import { createRide } from "@/services/rideService";

export default function OfferRidePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    seats: "1",
    contribution: "",
    vehicleName: "",
    vehicleNumber: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!form.pickup.trim()) {
      setErrorMessage("Please enter your pickup location.");
      return;
    }

    if (!form.destination.trim()) {
      setErrorMessage("Please enter your destination.");
      return;
    }

    if (!form.date) {
      setErrorMessage("Please select a ride date.");
      return;
    }

    if (!form.time) {
      setErrorMessage("Please select a ride time.");
      return;
    }

    const seats = Number(form.seats);
    const contribution = Number(form.contribution || 0);

    if (seats < 1 || seats > 8) {
      setErrorMessage("Available seats must be between 1 and 8.");
      return;
    }

    if (contribution < 0) {
      setErrorMessage("Contribution cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      await createRide({
        pickup_location: form.pickup.trim(),
        destination: form.destination.trim(),

        ride_date: form.date,
        ride_time: form.time,

        available_seats: seats,
        contribution,

        vehicle_name: form.vehicleName.trim(),
        vehicle_number: form.vehicleNumber.trim(),

        notes: form.notes.trim(),
      });

      setSuccessMessage("Your ride has been published successfully.");

      setTimeout(() => {
        router.push("/my-rides");
      }, 800);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the ride."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Offer a Ride
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Share your journey
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Publish your route and let RouteMate find commuters
          travelling in the same direction.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-8">
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">
                    Route
                  </h2>
                  <p className="text-xs text-slate-500">
                    Where are you travelling?
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Pickup location"
                  placeholder="e.g. Sikandra"
                  value={form.pickup}
                  onChange={(value) =>
                    updateField("pickup", value)
                  }
                />

                <InputField
                  label="Destination"
                  placeholder="e.g. Sharda University"
                  value={form.destination}
                  onChange={(value) =>
                    updateField("destination", value)
                  }
                />
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">
                    Ride details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Set your schedule and available seats.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Date"
                  type="date"
                  value={form.date}
                  onChange={(value) =>
                    updateField("date", value)
                  }
                />

                <InputField
                  label="Time"
                  type="time"
                  value={form.time}
                  onChange={(value) =>
                    updateField("time", value)
                  }
                />

                <InputField
                  label="Available seats"
                  type="number"
                  min="1"
                  max="8"
                  value={form.seats}
                  onChange={(value) =>
                    updateField("seats", value)
                  }
                />

                <InputField
                  label="Contribution per passenger"
                  type="number"
                  min="0"
                  placeholder="e.g. 80"
                  value={form.contribution}
                  onChange={(value) =>
                    updateField("contribution", value)
                  }
                />
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Car size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">
                    Vehicle
                  </h2>
                  <p className="text-xs text-slate-500">
                    Help passengers recognize your vehicle.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Vehicle"
                  placeholder="e.g. Hyundai i20"
                  value={form.vehicleName}
                  onChange={(value) =>
                    updateField("vehicleName", value)
                  }
                />

                <InputField
                  label="Vehicle number"
                  placeholder="e.g. UP00XX0000"
                  value={form.vehicleNumber}
                  onChange={(value) =>
                    updateField("vehicleNumber", value)
                  }
                />
              </div>
            </section>

            <section>
              <label className="block text-sm font-medium text-slate-700">
                Additional notes
              </label>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField("notes", event.target.value)
                }
                placeholder="Anything passengers should know?"
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </section>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing ride..." : "Publish ride"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <Car size={21} />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Make your commute smarter
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your ride can help nearby commuters reduce their
            travel cost while you recover part of your journey
            expense.
          </p>

          <div className="mt-7 space-y-4 text-sm">
            <InfoRow text="Share only your planned journey." />
            <InfoRow text="Choose how many seats are available." />
            <InfoRow text="Set a transparent contribution." />
            <InfoRow text="AI matching comes next." />
          </div>
        </aside>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function InfoRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={17}
        className="mt-0.5 shrink-0 text-blue-400"
      />
      <span>{text}</span>
    </div>
  );
}