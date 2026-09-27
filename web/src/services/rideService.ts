import { supabase } from "@/lib/supabase";

export type Ride = {
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

  status: "active" | "full" | "completed" | "cancelled";

  created_at: string;
  updated_at: string;
};

export type CreateRideInput = {
  pickup_location: string;
  pickup_lat?: number | null;
  pickup_lng?: number | null;

  destination: string;
  destination_lat?: number | null;
  destination_lng?: number | null;

  ride_date: string;
  ride_time: string;

  available_seats: number;
  contribution: number;

  vehicle_name?: string | null;
  vehicle_number?: string | null;
  notes?: string | null;

  accepts_cash: boolean;
  accepts_upi: boolean;
  upi_id?: string | null;
};

export async function createRide(
  input: CreateRideInput
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("rides")
    .insert({
      driver_id: user.id,

      pickup_location: input.pickup_location,
      pickup_lat: input.pickup_lat ?? null,
      pickup_lng: input.pickup_lng ?? null,

      destination: input.destination,
      destination_lat:
        input.destination_lat ?? null,
      destination_lng:
        input.destination_lng ?? null,

      ride_date: input.ride_date,
      ride_time: input.ride_time,

      available_seats: input.available_seats,
      contribution: input.contribution,

      vehicle_name:
        input.vehicle_name?.trim() || null,

      vehicle_number:
        input.vehicle_number?.trim() || null,

      notes: input.notes?.trim() || null,

      accepts_cash: input.accepts_cash,
      accepts_upi: input.accepts_upi,

      upi_id: input.accepts_upi
        ? input.upi_id?.trim() || null
        : null,

      status: "active",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Ride;
}

export async function getMyRides() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  await syncExpiredMyRides();

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("driver_id", user.id)
    .order("ride_date", {
      ascending: true,
    })
    .order("ride_time", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data as Ride[];
}

export type RideSearchInput = {
  pickup: string;
  destination: string;
  date: string;
  time: string;
};

export async function searchRides(
  input: RideSearchInput
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  let query = supabase
    .from("rides")
    .select("*")
    .eq("status", "active")
    .eq("ride_date", input.date)
    .gt("available_seats", 0)
    .order("ride_time", {
      ascending: true,
    });

  if (input.pickup.trim()) {
    query = query.ilike(
      "pickup_location",
      `%${input.pickup.trim()}%`
    );
  }

  if (input.destination.trim()) {
    query = query.ilike(
      "destination",
      `%${input.destination.trim()}%`
    );
  }

  if (input.time) {
    query = query.gte(
      "ride_time",
      input.time
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as Ride[];
}

export async function cancelRide(
  rideId: string
) {
  const { data, error } = await supabase
    .from("rides")
    .update({
      status: "cancelled",
    })
    .eq("id", rideId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Ride;
}

export async function deleteRide(
  rideId: string
) {
  const { error } = await supabase
    .from("rides")
    .delete()
    .eq("id", rideId);

  if (error) {
    throw error;
  }
}

export async function getRideWithDriver(
  rideId: string
) {
  const { data, error } = await supabase
    .from("rides")
    .select(`
      *,
      profiles:driver_id (
        id,
        full_name,
        avatar_url,
        city,
        college_workplace
      )
    `)
    .eq("id", rideId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export type UpdateRideInput = Partial<
  Pick<
    Ride,
    | "pickup_location"
    | "pickup_lat"
    | "pickup_lng"
    | "destination"
    | "destination_lat"
    | "destination_lng"
    | "ride_date"
    | "ride_time"
    | "available_seats"
    | "contribution"
    | "vehicle_name"
    | "vehicle_number"
    | "notes"
    | "accepts_cash"
    | "accepts_upi"
    | "upi_id"
  >
>;

export async function updateRide(
  rideId: string,
  updates: UpdateRideInput
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("rides")
    .update(updates)
    .eq("id", rideId)
    .eq("driver_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Ride;
}

export async function syncExpiredMyRides() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("rides")
    .select(
      "id, ride_date, ride_time, status"
    )
    .eq("driver_id", user.id)
    .in("status", ["active", "full"]);

  if (error) {
    throw error;
  }

  const now = new Date();

  const expiredIds = (data ?? [])
    .filter((ride) => {
      const rideDateTime = new Date(
        `${ride.ride_date}T${ride.ride_time}`
      );

      return rideDateTime < now;
    })
    .map((ride) => ride.id);

  if (expiredIds.length === 0) {
    return;
  }

  const { error: updateError } =
    await supabase
      .from("rides")
      .update({
        status: "completed",
      })
      .in("id", expiredIds)
      .eq("driver_id", user.id);

  if (updateError) {
    throw updateError;
  }
}

export async function getMyRide(
  rideId: string
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("id", rideId)
    .eq("driver_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data as Ride;
}

/* =========================================================
   BOOKINGS
   ========================================================= */

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export type Booking = {
  id: string;
  ride_id: string;
  passenger_id: string;

  status: BookingStatus;

  payment_method: "cash" | "upi" | null;
  payment_status:
    | "pending"
    | "paid"
    | "confirmed";
  payment_amount: number | null;

  requested_at: string;
  responded_at: string | null;

  created_at: string;
  updated_at: string;
};

export async function requestToJoinRide(
  rideId: string,
  paymentMethod: "cash" | "upi"
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Auth error:", userError);
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  /*
   * Get ride/payment information before
   * creating the booking.
   */
  const { data: ride, error: rideError } =
    await supabase
      .from("rides")
      .select(
        `
          id,
          contribution,
          accepts_cash,
          accepts_upi,
          upi_id,
          available_seats,
          status,
          driver_id
        `
      )
      .eq("id", rideId)
      .single();

  if (rideError) {
    throw rideError;
  }

  /*
   * Driver cannot request their own ride.
   */
  if (ride.driver_id === user.id) {
    throw new Error(
      "You cannot request to join your own ride."
    );
  }

  /*
   * Check seat availability.
   */
  if (ride.available_seats <= 0) {
    throw new Error("This ride is full.");
  }

  /*
   * Check ride status.
   */
  if (ride.status !== "active") {
    throw new Error(
      "This ride is no longer accepting requests."
    );
  }

  /*
   * Validate selected payment method.
   */
  if (
    paymentMethod === "cash" &&
    !ride.accepts_cash
  ) {
    throw new Error(
      "Cash payment is not available for this ride."
    );
  }

  if (
    paymentMethod === "upi" &&
    !ride.accepts_upi
  ) {
    throw new Error(
      "UPI payment is not available for this ride."
    );
  }

  /*
   * Create booking using the secure RPC.
   */
  const { data, error } = await supabase.rpc(
    "request_to_join_ride",
    {
      p_ride_id: rideId,
    }
  );

  if (error) {
    console.error(
      "Supabase request_to_join_ride error:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      error.message ||
        error.details ||
        "Unable to send your request."
    );
  }

  const booking = data as Booking;

  /*
   * Save payment preference and amount.
   */
  const {
    data: updatedBooking,
    error: updateError,
  } = await supabase
    .from("bookings")
    .update({
      payment_method: paymentMethod,
      payment_status: "pending",
      payment_amount: ride.contribution,
    })
    .eq("id", booking.id)
    .eq("passenger_id", user.id)
    .select()
    .single();

  if (updateError) {
    console.error(
      "Failed to save payment preference:",
      updateError
    );

    throw updateError;
  }

  return updatedBooking as Booking;
}

export async function getMyBookingForRide(
  rideId: string
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("ride_id", rideId)
    .eq("passenger_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Booking | null;
}

export async function getRideBookingRequests(
  rideId: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      profiles:passenger_id (
        id,
        full_name,
        avatar_url,
        city,
        college_workplace
      )
    `)
    .eq("ride_id", rideId)
    .order("requested_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function acceptBooking(
  bookingId: string
) {
  const {
    data,
    error,
  } = await supabase.rpc(
    "accept_booking",
    {
      p_booking_id: bookingId,
    }
  );

  if (error) {
    throw error;
  }

  return data as Booking;
}

export async function rejectBooking(
  bookingId: string
) {
  const {
    data,
    error,
  } = await supabase.rpc(
    "reject_booking",
    {
      p_booking_id: bookingId,
    }
  );

  if (error) {
    throw error;
  }

  return data as Booking;
}