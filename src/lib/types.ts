export type Room = "bilik_mesyuarat" | "studio";

export type Slot = "am" | "pm" | "full_day";

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

export type Booking = {
  id: string;
  room: Room;
  date: string;
  slot: Slot;
  name: string;
  school_or_unit: string;
  purpose: string;
  contact: string;
  contact_normalized: string;
  created_at: string;
  status: BookingStatus;
  approval_token_hash: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  notified_at: string | null;
  notification_error: string | null;
  cancelled_at: string | null;
};

export type BookingFormState = {
  ok: boolean;
  message: string;
  whatsappUrl?: string;
};

export type LoginState = {
  ok: boolean;
  message: string;
};

export type CheckBookingResult = {
  id: string;
  date: string;
  room: string;
  slot: string;
  purpose: string;
  status: string;
  whatsappUrl: string;
};

export type CheckBookingState = {
  ok: boolean;
  message: string;
  bookings: CheckBookingResult[];
};
