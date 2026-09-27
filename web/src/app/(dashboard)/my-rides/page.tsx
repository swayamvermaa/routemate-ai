"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Clock3,
  CreditCard,
  MapPin,
  PlusCircle,
  Star,
  User,
  X,
} from "lucide-react";

import RideCard from "@/components/dashboard/RideCard";
import PageHeader from "@/components/dashboard/PageHeader";

import {
  acceptBooking,
  cancelBooking,
  cancelRide,
  completeRide,
  createRideReview,
  getMyBookedRides,
  getMyReviewForBooking,
  getMyRides,
  getRideBookingRequests,
  rejectBooking,
  type MyBookedRide,
  type Ride,
  type RideReview,
} from "@/services/rideService";

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
  const [bookedRides, setBookedRides] =
    useState<MyBookedRide[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingBookedRides, setLoadingBookedRides] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [cancellingId, setCancellingId] =
    useState<string | null>(null);

  const [cancellingBookingId, setCancellingBookingId] =
    useState<string | null>(null);

  const [bookingRequests, setBookingRequests] =
    useState<Record<string, BookingRequest[]>>({});

  const [loadingRequests, setLoadingRequests] =
    useState<Record<string, boolean>>({});

  const [processingBookingId, setProcessingBookingId] =
    useState<string | null>(null);

  const [reviews, setReviews] =
    useState<Record<string, RideReview | null>>({});

  /* =========================================================
     RATING STATE
  ========================================================= */

  const [ratingBooking, setRatingBooking] =
    useState<MyBookedRide | null>(null);

  const [ratingValue, setRatingValue] =
    useState(0);

  const [reviewText, setReviewText] =
    useState("");

  const [submittingRating, setSubmittingRating] =
    useState(false);

  /* =========================================================
     COMPLETE RIDE STATE
  ========================================================= */

  const [completingRide, setCompletingRide] =
    useState<Ride | null>(null);

  const [completeForm, setCompleteForm] =
    useState({
      location: "",
      date: "",
      time: "",
    });

  const [completingId, setCompletingId] =
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

  async function loadBookedRides() {
    try {
      setLoadingBookedRides(true);

      const data = await getMyBookedRides();

      setBookedRides(data);

      const completedBookings = data.filter(
        (booking) =>
          booking.booking_status === "completed" ||
          booking.ride_status === "completed"
      );

      if (completedBookings.length > 0) {
        const reviewEntries = await Promise.all(
          completedBookings.map(async (booking) => {
            try {
              const review =
                await getMyReviewForBooking(
                  booking.booking_id
                );

              return [
                booking.booking_id,
                review,
              ] as const;
            } catch (error) {
              console.error(
                "Failed to load review:",
                error
              );

              return [
                booking.booking_id,
                null,
              ] as const;
            }
          })
        );

        setReviews(
          Object.fromEntries(reviewEntries)
        );
      }
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load your booked rides."
      );
    } finally {
      setLoadingBookedRides(false);
    }
  }

  async function loadAllData() {
    await Promise.all([
      loadRides(),
      loadBookedRides(),
    ]);
  }

  useEffect(() => {
    loadAllData();
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
        [rideId]:
          (data ?? []) as BookingRequest[],
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

  async function handleCancelBooking(
    bookingId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingBookingId(bookingId);
      setErrorMessage("");

      await cancelBooking(bookingId);

      await loadBookedRides();
      await loadRides();
    } catch (error) {
      console.error(
        "Failed to cancel booking:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to cancel booking."
      );
    } finally {
      setCancellingBookingId(null);
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

  /* =========================================================
     RATING MODAL
  ========================================================= */

  function openRatingModal(
    booking: MyBookedRide
  ) {
    setRatingBooking(booking);
    setRatingValue(0);
    setReviewText("");
    setErrorMessage("");
  }

  function closeRatingModal() {
    if (submittingRating) {
      return;
    }

    setRatingBooking(null);
    setRatingValue(0);
    setReviewText("");
  }

  async function handleSubmitRating(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!ratingBooking) {
      return;
    }

    if (ratingValue < 1 || ratingValue > 5) {
      setErrorMessage(
        "Please select a rating from 1 to 5 stars."
      );
      return;
    }

    try {
      setSubmittingRating(true);
      setErrorMessage("");

      const review = await createRideReview(
        ratingBooking.booking_id,
        ratingValue,
        reviewText
      );

      setReviews((current) => ({
        ...current,
        [ratingBooking.booking_id]: review,
      }));

      setRatingBooking(null);
      setRatingValue(0);
      setReviewText("");
    } catch (error) {
      console.error(
        "Failed to submit rating:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your rating."
      );
    } finally {
      setSubmittingRating(false);
    }
  }

  /* =========================================================
     OPEN COMPLETE RIDE MODAL
  ========================================================= */

  function openCompleteRideModal(ride: Ride) {
    const today = new Date();

    const defaultDate =
      ride.ride_date ||
      today.toISOString().split("T")[0];

    const defaultTime =
      ride.ride_time || "";

    setCompletingRide(ride);

    setCompleteForm({
      location: ride.destination || "",
      date: defaultDate,
      time: defaultTime,
    });

    setErrorMessage("");
  }

  /* =========================================================
     CLOSE COMPLETE RIDE MODAL
  ========================================================= */

  function closeCompleteRideModal() {
    if (completingId) {
      return;
    }

    setCompletingRide(null);

    setCompleteForm({
      location: "",
      date: "",
      time: "",
    });
  }

  /* =========================================================
     COMPLETE RIDE
  ========================================================= */

  async function handleCompleteRide(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!completingRide) {
      return;
    }

    const location =
      completeForm.location.trim();

    if (!location) {
      setErrorMessage(
        "Please enter where the ride ended."
      );
      return;
    }

    if (!completeForm.date) {
      setErrorMessage(
        "Please select the end date."
      );
      return;
    }

    if (!completeForm.time) {
      setErrorMessage(
        "Please select the end time."
      );
      return;
    }

    try {
      setCompletingId(completingRide.id);
      setErrorMessage("");

      await completeRide(
        completingRide.id,
        location,
        completeForm.date,
        completeForm.time
      );

      setCompletingRide(null);

      setCompleteForm({
        location: "",
        date: "",
        time: "",
      });

      await loadAllData();
    } catch (error) {
      console.error(
        "Failed to complete ride:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete the ride."
      );
    } finally {
      setCompletingId(null);
    }
  }

  const sections = useMemo(() => {
    const upcomingOffered = rides.filter(
      (ride) =>
        ride.status === "active" ||
        ride.status === "full"
    );

    const completedOffered = rides.filter(
      (ride) => ride.status === "completed"
    );

    const cancelledOffered = rides.filter(
      (ride) => ride.status === "cancelled"
    );

    const upcomingBooked = bookedRides.filter(
      (booking) =>
        booking.booking_status === "pending" ||
        booking.booking_status === "accepted"
    );

    const completedBooked = bookedRides.filter(
      (booking) =>
        booking.booking_status === "completed" ||
        booking.ride_status === "completed"
    );

    const cancelledBooked = bookedRides.filter(
      (booking) =>
        booking.booking_status === "cancelled" ||
        booking.booking_status === "rejected" ||
        booking.ride_status === "cancelled"
    );

    return {
      upcomingOffered,
      completedOffered,
      cancelledOffered,
      upcomingBooked,
      completedBooked,
      cancelledBooked,
    };
  }, [rides, bookedRides]);

  const isLoading =
    loading || loadingBookedRides;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="My Rides"
        title="Your shared journeys"
        description="Manage the rides you offer and the journeys you have joined."
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

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your rides...
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* ================= UPCOMING ================= */}

          {(sections.upcomingOffered.length > 0 ||
            sections.upcomingBooked.length > 0) && (
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-950">
                    Upcoming
                  </h2>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {sections.upcomingOffered.length +
                      sections.upcomingBooked.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Your upcoming offered and booked journeys.
                </p>
              </div>

              <div className="space-y-6">
                {sections.upcomingBooked.map(
                  (booking) => (
                    <PassengerRideCard
                      key={booking.booking_id}
                      booking={booking}
                      cancellingBookingId={
                        cancellingBookingId
                      }
                      onCancelBooking={
                        handleCancelBooking
                      }
                    />
                  )
                )}

                {sections.upcomingOffered.map(
                  (ride) => (
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

                      {/* Driver completion actions */}

                      <div className="flex flex-col gap-3 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/70 to-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                              <Check className="h-4 w-4" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                Finished this ride?
                              </p>

                              <p className="text-xs text-slate-500">
                                Mark it completed after the journey ends.
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            openCompleteRideModal(
                              ride
                            )
                          }
                          disabled={
                            completingId ===
                            ride.id
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Check className="h-4 w-4" />

                          Complete Ride
                        </button>
                      </div>

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
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* ================= COMPLETED ================= */}

          {(sections.completedBooked.length > 0 ||
            sections.completedOffered.length > 0) && (
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-950">
                    Completed
                  </h2>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {sections.completedBooked.length +
                      sections.completedOffered.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Journeys that have already ended.
                </p>
              </div>

              <div className="space-y-6">
                {sections.completedBooked.map(
                  (booking) => (
                    <PassengerRideCard
                      key={booking.booking_id}
                      booking={booking}
                      review={
                        reviews[
                          booking.booking_id
                        ] ?? null
                      }
                      cancellingBookingId={
                        cancellingBookingId
                      }
                      onCancelBooking={
                        handleCancelBooking
                      }
                      onRateRide={openRatingModal}
                    />
                  )
                )}

                {sections.completedOffered.map(
                  (ride) => (
                    <CompletedDriverRideCard
                      key={ride.id}
                      ride={ride}
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* ================= CANCELLED ================= */}

          {(sections.cancelledBooked.length > 0 ||
            sections.cancelledOffered.length > 0) && (
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-950">
                    Cancelled
                  </h2>

                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                    {sections.cancelledBooked.length +
                      sections.cancelledOffered.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Cancelled or rejected journeys.
                </p>
              </div>

              <div className="space-y-6">
                {sections.cancelledBooked.map(
                  (booking) => (
                    <PassengerRideCard
                      key={booking.booking_id}
                      booking={booking}
                      cancellingBookingId={
                        cancellingBookingId
                      }
                      onCancelBooking={
                        handleCancelBooking
                      }
                    />
                  )
                )}

                {sections.cancelledOffered.map(
                  (ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      cancelling={false}
                      onCancel={() => undefined}
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* ================= EMPTY ================= */}

          {sections.upcomingOffered.length === 0 &&
            sections.upcomingBooked.length === 0 &&
            sections.completedBooked.length === 0 &&
            sections.completedOffered.length === 0 &&
            sections.cancelledBooked.length === 0 &&
            sections.cancelledOffered.length === 0 && (
              <EmptyState />
            )}
        </div>
      )}

      {/* =====================================================
          RATE RIDE MODAL
      ===================================================== */}

      {ratingBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Star className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-950">
                        Rate Your Ride
                      </h2>

                      <p className="text-xs text-slate-500">
                        How was your experience with the driver?
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeRatingModal}
                  disabled={submittingRating}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmitRating}
              className="px-5 py-6 sm:px-6"
            >
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <p className="text-sm font-bold text-slate-900">
                  {ratingBooking.driver_name ||
                    "Your driver"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {ratingBooking.pickup_location}
                  {" → "}
                  {ratingBooking.destination}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold text-slate-800">
                  Your rating
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {Array.from(
                    { length: 5 },
                    (_, index) => {
                      const star = index + 1;
                      const active =
                        star <= ratingValue;

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setRatingValue(star)
                          }
                          disabled={submittingRating}
                          aria-label={`Rate ${star} out of 5`}
                          className="rounded-xl p-1 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Star
                            className={`h-9 w-9 ${
                              active
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {ratingValue === 0
                    ? "Select a rating"
                    : `${ratingValue} out of 5`}
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="ride-review"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Review{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="ride-review"
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(
                      event.target.value
                    )
                  }
                  disabled={submittingRating}
                  maxLength={500}
                  rows={4}
                  placeholder="Tell us about your ride..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 disabled:bg-slate-50"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {reviewText.length}/500
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeRatingModal}
                  disabled={submittingRating}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submittingRating ||
                    ratingValue === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Star className="h-4 w-4" />

                  {submittingRating
                    ? "Submitting..."
                    : "Submit Rating"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          COMPLETE RIDE MODAL
      ===================================================== */}

      {completingRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Check className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-950">
                        Complete Ride
                      </h2>

                      <p className="text-xs text-slate-500">
                        Confirm where and when the journey ended.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    closeCompleteRideModal
                  }
                  disabled={!!completingId}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Route summary */}

            <div className="px-5 pt-5 sm:px-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ride
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="truncate">
                    {completingRide.pickup_location}
                  </span>

                  <span className="text-slate-300">
                    →
                  </span>

                  <span className="truncate">
                    {completingRide.destination}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}

            <form
              onSubmit={handleCompleteRide}
              className="space-y-5 px-5 py-5 sm:px-6 sm:py-6"
            >
              {/* End Location */}

              <div>
                <label
                  htmlFor="complete-end-location"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  End Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="complete-end-location"
                    type="text"
                    value={
                      completeForm.location
                    }
                    onChange={(event) =>
                      setCompleteForm(
                        (current) => ({
                          ...current,
                          location:
                            event.target.value,
                        })
                      )
                    }
                    placeholder="Where did the ride end?"
                    disabled={!!completingId}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-500">
                  You can enter the destination or the actual drop-off point.
                </p>
              </div>

              {/* Date + Time */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="complete-end-date"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    End Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="complete-end-date"
                      type="date"
                      value={
                        completeForm.date
                      }
                      onChange={(event) =>
                        setCompleteForm(
                          (current) => ({
                            ...current,
                            date: event.target
                              .value,
                          })
                        )
                      }
                      disabled={!!completingId}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="complete-end-time"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    End Time
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="complete-end-time"
                      type="time"
                      value={
                        completeForm.time
                      }
                      onChange={(event) =>
                        setCompleteForm(
                          (current) => ({
                            ...current,
                            time: event.target
                              .value,
                          })
                        )
                      }
                      disabled={!!completingId}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Warning */}

              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-xs leading-5 text-amber-800">
                  Once you complete this ride, accepted passengers will also see the ride as completed and will be able to rate their experience.
                </p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeCompleteRideModal
                  }
                  disabled={!!completingId}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!!completingId}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />

                  {completingId
                    ? "Completing..."
                    : "Complete Ride"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPLETED DRIVER RIDE CARD
========================================================= */

function CompletedDriverRideCard({
  ride,
}: {
  ride: Ride;
}) {
  const completedDate = ride.completed_at
    ? new Date(
        ride.completed_at
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                Completed
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-950">
              {ride.pickup_location}
              <span className="mx-2 text-slate-300">
                →
              </span>
              {ride.destination}
            </h3>

            {completedDate && (
              <p className="mt-1 text-sm text-slate-500">
                Completed on {completedDate}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Contribution
            </p>

            <p className="mt-1 text-xl font-extrabold text-slate-950">
              ₹{Number(
                ride.contribution
              ).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
        <InfoItem
          icon={
            <MapPin className="h-4 w-4" />
          }
          label="End Location"
          value={
            ride.end_location ||
            ride.destination
          }
        />

        <InfoItem
          icon={
            <CalendarDays className="h-4 w-4" />
          }
          label="End Date"
          value={
            ride.end_date
              ? new Date(
                  `${ride.end_date}T00:00:00`
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "Not available"
          }
        />

        <InfoItem
          icon={
            <Clock3 className="h-4 w-4" />
          }
          label="End Time"
          value={
            ride.end_time
              ? ride.end_time.slice(
                  0,
                  5
                )
              : "Not available"
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   PASSENGER RIDE CARD
========================================================= */

type PassengerRideCardProps = {
  booking: MyBookedRide;
  review?: RideReview | null;

  cancellingBookingId: string | null;

  onCancelBooking: (
    bookingId: string
  ) => void;

  onRateRide?: (
    booking: MyBookedRide
  ) => void;
};

function PassengerRideCard({
  booking,
  review,
  cancellingBookingId,
  onCancelBooking,
  onRateRide,
}: PassengerRideCardProps) {
  const isCompleted =
    booking.booking_status === "completed" ||
    booking.ride_status === "completed";

  const isPending =
    booking.booking_status === "pending";

  const isAccepted =
    booking.booking_status === "accepted";

  const isCancelled =
    booking.booking_status === "cancelled" ||
    booking.booking_status === "rejected" ||
    booking.ride_status === "cancelled";

  const rideDateTime = new Date(
    `${booking.ride_date}T${booking.ride_time}`
  );

  const formattedDate =
    rideDateTime.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  const formattedTime =
    rideDateTime.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  const isCancelling =
    cancellingBookingId === booking.booking_id;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
              Joined Ride
            </span>

            {isPending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                <Clock3 className="h-3.5 w-3.5" />
                Request Pending
              </span>
            )}

            {isAccepted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                Booking Confirmed
              </span>
            )}

            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                Completed
              </span>
            )}

            {isCancelled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700">
                <X className="h-3.5 w-3.5" />
                {booking.booking_status ===
                "rejected"
                  ? "Request Rejected"
                  : "Cancelled"}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-950">
            Your booked journey
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {formattedDate} at {formattedTime}
          </p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 text-left shadow-sm sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Contribution
          </p>

          <p className="mt-1 text-xl font-extrabold text-slate-950">
            ₹{Number(
              booking.contribution
            ).toFixed(0)}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Route */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex gap-3">
            <div className="mt-1 flex flex-col items-center">
              <span className="h-3 w-3 rounded-full border-2 border-blue-600 bg-white" />

              <span className="my-1 h-10 w-px border-l border-dashed border-slate-300" />

              <span className="h-3 w-3 rounded-full bg-blue-600" />
            </div>

            <div className="min-w-0 flex-1 space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Pickup
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {booking.pickup_location}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Destination
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {booking.destination}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver */}

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {booking.driver_avatar_url ? (
              <img
                src={booking.driver_avatar_url}
                alt={
                  booking.driver_name ||
                  "Driver"
                }
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                <User className="h-5 w-5" />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Driver
              </p>

              <p className="truncate font-bold text-slate-900">
                {booking.driver_name ||
                  "RouteMate Driver"}
              </p>

              {booking.driver_college_workplace && (
                <p className="truncate text-xs text-slate-500">
                  {booking.driver_college_workplace}
                </p>
              )}

              {booking.driver_city && (
                <p className="truncate text-xs text-slate-400">
                  {booking.driver_city}
                </p>
              )}
            </div>
          </div>

          {booking.vehicle_name && (
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vehicle
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {booking.vehicle_name}
              </p>

              {booking.vehicle_number && (
                <p className="text-xs text-slate-500">
                  {booking.vehicle_number}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Payment */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoItem
            icon={
              <CreditCard className="h-4 w-4" />
            }
            label="Payment"
            value={
              booking.payment_method === "upi"
                ? "UPI"
                : booking.payment_method ===
                  "cash"
                ? "Cash"
                : "Not selected"
            }
          />

          <InfoItem
            icon={
              <Check className="h-4 w-4" />
            }
            label="Payment Status"
            value={
              booking.payment_status ===
              "confirmed"
                ? "Confirmed"
                : booking.payment_status ===
                  "paid"
                ? "Paid"
                : "Pending"
            }
          />
        </div>

        {/* Cancel Booking */}

        {(isPending || isAccepted) && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() =>
                onCancelBooking(
                  booking.booking_id
                )
              }
              disabled={isCancelling}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" />

              {isCancelling
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>
          </div>
        )}

        {/* Completed rating area */}

        {isCompleted && (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            {review ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-bold text-amber-700">
                      <Check className="h-4 w-4" />
                      Rated
                    </span>

                    <div className="flex items-center gap-0.5">
                      {Array.from(
                        { length: 5 },
                        (_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index <
                              review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {review.review_text && (
                    <p className="mt-2 text-sm text-slate-600">
                      “{review.review_text}”
                    </p>
                  )}
                </div>

                <span className="text-xs font-semibold text-amber-700">
                  Thank you for your feedback!
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />

                    <p className="font-bold text-slate-900">
                      How was your ride?
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    Share your experience with the driver.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onRateRide?.(booking)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                >
                  <Star className="h-4 w-4" />
                  Rate Ride
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ride details */}

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <MapPin className="h-3.5 w-3.5" />
            {booking.available_seats} seat
            {booking.available_seats !== 1
              ? "s"
              : ""} available
          </span>

          {booking.vehicle_number && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {booking.vehicle_number}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DRIVER BOOKING REQUESTS
========================================================= */

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
                processingBookingId ===
                request.id
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
                {processedRequests.map(
                  (request) => (
                    <ProcessedBookingCard
                      key={request.id}
                      request={request}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PENDING REQUEST CARD
========================================================= */

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

/* =========================================================
   PROCESSED BOOKING CARD
========================================================= */

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

/* =========================================================
   EMPTY STATE
========================================================= */

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
        You haven&apos;t offered or joined any rides yet.
        Publish your first journey or find a ride
        going your way.
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/offer-ride"
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
        >
          Offer your first ride
        </Link>

        <Link
          href="/find-ride"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Find a ride
        </Link>
      </div>
    </div>
  );
}