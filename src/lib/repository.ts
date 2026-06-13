import { getSupabaseAdmin } from "./supabase";
import { normalizePhoneNumber } from "./phone";
import type { Booking, BookingStatus, Room, Slot } from "./types";

const notConfiguredMessage =
  "Supabase belum dikonfigurasi. Sila isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.";

export type BookingInput = {
  room: Room;
  date: string;
  slot: Slot;
  name: string;
  school_or_unit: string;
  purpose: string;
  contact: string;
};

export type CreateBookingInput = BookingInput & {
  id?: string;
  status?: BookingStatus;
  approval_token_hash?: string | null;
};

export async function listActiveBookings(): Promise<Booking[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .in("status", ["pending", "approved"])
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAllBookings(): Promise<Booking[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createBooking(input: CreateBookingInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error(notConfiguredMessage);

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...input,
      contact: normalizePhoneNumber(input.contact),
      contact_normalized: normalizePhoneNumber(input.contact)
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateBooking(id: string, input: BookingInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error(notConfiguredMessage);

  const { error } = await supabase
    .from("bookings")
    .update({
      ...input,
      contact: normalizePhoneNumber(input.contact),
      contact_normalized: normalizePhoneNumber(input.contact)
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function cancelBooking(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error(notConfiguredMessage);

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function approveBooking(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error(notConfiguredMessage);

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      rejected_at: null
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function rejectBooking(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error(notConfiguredMessage);

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "rejected",
      rejected_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function getBooking(id: string): Promise<Booking | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.from("bookings").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function listPendingBookingsByContact(contact: string): Promise<Booking[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("status", "pending")
    .eq("contact_normalized", normalizePhoneNumber(contact))
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateApprovalTokenHash(id: string, approvalTokenHash: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error(notConfiguredMessage);

  const { error } = await supabase
    .from("bookings")
    .update({ approval_token_hash: approvalTokenHash })
    .eq("id", id)
    .eq("status", "pending");

  if (error) throw new Error(error.message);
}

export async function recordNotificationResult(id: string, errorMessage?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error(notConfiguredMessage);

  const { error } = await supabase
    .from("bookings")
    .update({
      notified_at: errorMessage ? null : new Date().toISOString(),
      notification_error: errorMessage ?? null
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
