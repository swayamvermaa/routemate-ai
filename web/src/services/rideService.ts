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

  status: "active" | "full" | "completed" | "cancelled";

  created_at: string;
  updated_at: string;
};

export type CreateRideInput = {
  pickup_location: string;
  destination: string;

  pickup_lat?: number | null;
  pickup_lng?: number | null;

  destination_lat?: number | null;
  destination_lng?: number | null;

  ride_date: string;
  ride_time: string;

  available_seats: number;
  contribution: number;

  vehicle_name?: string;
  vehicle_number?: string;

  notes?: string;
};

export async function createRide(input: CreateRideInput) {
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
      destination_lat: input.destination_lat ?? null,
      destination_lng: input.destination_lng ?? null,

      ride_date: input.ride_date,
      ride_time: input.ride_time,

      available_seats: input.available_seats,
      contribution: input.contribution,

      vehicle_name: input.vehicle_name || null,
      vehicle_number: input.vehicle_number || null,

      notes: input.notes || null,

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

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("driver_id", user.id)
    .order("ride_date", { ascending: true })
    .order("ride_time", { ascending: true });

  if (error) {
    throw error;
  }

  return data as Ride[];
}

export async function cancelRide(rideId: string) {
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

export async function deleteRide(rideId: string) {
  const { error } = await supabase
    .from("rides")
    .delete()
    .eq("id", rideId);

  if (error) {
    throw error;
  }
}