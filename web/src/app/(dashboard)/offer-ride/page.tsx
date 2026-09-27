"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  Car,
  CheckCircle2,
  MapPin,
  Smartphone,
  Users,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import LocationPicker, {
  SelectedLocation,
} from "@/components/dashboard/LocationPicker";

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

  const [pickupLocation, setPickupLocation] =
    useState<SelectedLocation | null>(null);

  const [destinationLocation, setDestinationLocation] =
    useState<SelectedLocation | null>(null);

  const [acceptsCash, setAcceptsCash] =
    useState(true);

  const [acceptsUpi, setAcceptsUpi] =
    useState(false);

  const [upiId, setUpiId] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!form.pickup.trim()) {
      setErrorMessage(
        "Please enter your pickup location."
      );
      return;
    }

    if (!pickupLocation) {
      setErrorMessage(
        "Please select a pickup location from the suggestions."
      );
      return;
    }

    if (!destinationLocation) {
      setErrorMessage(
        "Please select a destination from the suggestions."
      );
      return;
    }

    if (!form.destination.trim()) {
      setErrorMessage(
        "Please enter your destination."
      );
      return;
    }

    if (!form.date) {
      setErrorMessage(
        "Please select a ride date."
      );
      return;
    }

    if (!form.time) {
      setErrorMessage(
        "Please select a ride time."
      );
      return;
    }

    const seats = Number(form.seats);
    const contribution = Number(
      form.contribution || 0
    );

    if (seats < 1 || seats > 8) {
      setErrorMessage(
        "Available seats must be between 1 and 8."
      );
      return;
    }

    if (contribution < 0) {
      setErrorMessage(
        "Contribution cannot be negative."
      );
      return;
    }

    if (!acceptsCash && !acceptsUpi) {
      setErrorMessage(
        "Please select at least one payment method."
      );
      return;
    }

    if (acceptsUpi && !upiId.trim()) {
      setErrorMessage(
        "Please enter your UPI ID."
      );
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

        vehicle_name:
          form.vehicleName.trim(),
        vehicle_number:
          form.vehicleNumber.trim(),

        notes: form.notes.trim(),

        accepts_cash: acceptsCash,
        accepts_upi: acceptsUpi,
        upi_id: acceptsUpi
          ? upiId.trim()
          : null,
      });

      setSuccessMessage(
        "Your ride has been published successfully."
      );

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
      <PageHeader
        eyebrow="Share your commute"
        title="Offer a ride"
        description="Publish your route and let RouteMate find suitable passengers."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-8">
            {/* Route */}
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
                <LocationPicker
                  label="Pickup location"
                  placeholder="Search pickup place..."
                  value={form.pickup}
                  onChange={(location) => {
                    setPickupLocation(location);

                    updateField(
                      "pickup",
                      location?.address || ""
                    );
                  }}
                />

                <LocationPicker
                  label="Destination"
                  placeholder="Search destination..."
                  value={form.destination}
                  onChange={(location) => {
                    setDestinationLocation(location);

                    updateField(
                      "destination",
                      location?.address || ""
                    );
                  }}
                />
              </div>
            </section>

            {/* Ride details */}
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
                    updateField(
                      "date",
                      value
                    )
                  }
                />

                <InputField
                  label="Time"
                  type="time"
                  value={form.time}
                  onChange={(value) =>
                    updateField(
                      "time",
                      value
                    )
                  }
                />

                <InputField
                  label="Available seats"
                  type="number"
                  min="1"
                  max="8"
                  value={form.seats}
                  onChange={(value) =>
                    updateField(
                      "seats",
                      value
                    )
                  }
                />

                <InputField
                  label="Contribution per passenger"
                  type="number"
                  min="0"
                  placeholder="e.g. 80"
                  value={form.contribution}
                  onChange={(value) =>
                    updateField(
                      "contribution",
                      value
                    )
                  }
                />
              </div>
            </section>

            {/* Payment options */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Payment Options
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Passengers will pay you after the ride.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {/* Cash */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    acceptsCash
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={acceptsCash}
                    onChange={(event) =>
                      setAcceptsCash(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Banknote size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Cash after ride
                    </p>

                    <p className="text-xs text-slate-500">
                      Passenger pays you in cash after the ride.
                    </p>
                  </div>
                </label>

                {/* UPI */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    acceptsUpi
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={acceptsUpi}
                    onChange={(event) =>
                      setAcceptsUpi(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Smartphone size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      UPI after ride
                    </p>

                    <p className="text-xs text-slate-500">
                      Passenger pays your UPI after the ride.
                    </p>
                  </div>
                </label>
              </div>

              {/* UPI ID */}
              {acceptsUpi && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Your UPI ID
                  </label>

                  <input
                    type="text"
                    value={upiId}
                    onChange={(event) =>
                      setUpiId(
                        event.target.value
                      )
                    }
                    placeholder="example@upi"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Your UPI ID will only be shown to
                    passengers who select UPI for this booking.
                  </p>
                </div>
              )}
            </section>

            {/* Vehicle */}
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
                    updateField(
                      "vehicleName",
                      value
                    )
                  }
                />

                <InputField
                  label="Vehicle number"
                  placeholder="e.g. UP00XX0000"
                  value={form.vehicleNumber}
                  onChange={(value) =>
                    updateField(
                      "vehicleNumber",
                      value
                    )
                  }
                />
              </div>
            </section>

            {/* Notes */}
            <section>
              <label className="block text-sm font-medium text-slate-700">
                Additional notes
              </label>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value
                  )
                }
                placeholder="Anything passengers should know?"
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </section>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Publishing ride..."
                : "Publish ride"}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>
          </div>
        </form>

        {/* Sidebar */}
        <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <Car size={21} />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Make your commute smarter
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your ride can help nearby commuters reduce
            their travel cost while you recover part of
            your journey expense.
          </p>

          <div className="mt-7 space-y-4 text-sm">
            <InfoRow text="Share only your planned journey." />

            <InfoRow text="Choose how many seats are available." />

            <InfoRow text="Set a transparent contribution." />

            <InfoRow text="Choose your preferred payment methods." />

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
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function InfoRow({
  text,
}: {
  text: string;
}) {
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

