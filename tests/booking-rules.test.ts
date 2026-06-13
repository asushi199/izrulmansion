import { describe, expect, it } from "vitest";
import { getConflictingBooking, isSlotAvailable } from "../src/lib/booking-rules";
import type { Booking, BookingStatus, Slot } from "../src/lib/types";

const booking = (slot: Slot, status: BookingStatus = "approved"): Booking => ({
  id: `booking-${slot}`,
  room: "bilik_mesyuarat",
  date: "2026-06-15",
  slot,
  name: "Cikgu Aminah",
  school_or_unit: "PKG Pantai Remis",
  purpose: "Mesyuarat",
  contact: "0123456789",
  contact_normalized: "0123456789",
  created_at: "2026-06-13T08:00:00.000Z",
  status,
  approval_token_hash: null,
  approved_at: status === "approved" ? "2026-06-13T08:10:00.000Z" : null,
  rejected_at: status === "rejected" ? "2026-06-13T08:10:00.000Z" : null,
  notified_at: null,
  notification_error: null,
  cancelled_at: null
});

describe("booking slot conflict rules", () => {
  it("blocks AM when the same room/date already has AM or full-day booking", () => {
    expect(isSlotAvailable([booking("am")], "bilik_mesyuarat", "2026-06-15", "am")).toBe(false);
    expect(isSlotAvailable([booking("full_day")], "bilik_mesyuarat", "2026-06-15", "am")).toBe(false);
  });

  it("blocks PM when the same room/date already has PM or full-day booking", () => {
    expect(isSlotAvailable([booking("pm")], "bilik_mesyuarat", "2026-06-15", "pm")).toBe(false);
    expect(isSlotAvailable([booking("full_day")], "bilik_mesyuarat", "2026-06-15", "pm")).toBe(false);
  });

  it("allows AM and PM to be booked separately when neither is full-day", () => {
    expect(isSlotAvailable([booking("am")], "bilik_mesyuarat", "2026-06-15", "pm")).toBe(true);
    expect(isSlotAvailable([booking("pm")], "bilik_mesyuarat", "2026-06-15", "am")).toBe(true);
  });

  it("blocks full-day when either AM, PM, or full-day already exists", () => {
    expect(isSlotAvailable([booking("am")], "bilik_mesyuarat", "2026-06-15", "full_day")).toBe(false);
    expect(isSlotAvailable([booking("pm")], "bilik_mesyuarat", "2026-06-15", "full_day")).toBe(false);
    expect(isSlotAvailable([booking("full_day")], "bilik_mesyuarat", "2026-06-15", "full_day")).toBe(false);
  });

  it("holds pending bookings until admin approves or rejects them", () => {
    expect(isSlotAvailable([booking("am", "pending")], "bilik_mesyuarat", "2026-06-15", "am")).toBe(false);
    expect(isSlotAvailable([booking("full_day", "pending")], "bilik_mesyuarat", "2026-06-15", "pm")).toBe(false);
  });

  it("ignores rejected, cancelled, other rooms, and other dates", () => {
    const rejected = booking("full_day", "rejected");
    const cancelled = { ...booking("full_day", "cancelled"), cancelled_at: "2026-06-14T08:00:00.000Z" };
    const otherRoom = { ...booking("full_day"), room: "studio" as const };
    const otherDate = { ...booking("full_day"), date: "2026-06-16" };

    expect(isSlotAvailable([rejected, cancelled, otherRoom, otherDate], "bilik_mesyuarat", "2026-06-15", "full_day")).toBe(true);
  });

  it("returns the booking that causes a conflict", () => {
    const conflict = booking("full_day");

    expect(getConflictingBooking([conflict], "bilik_mesyuarat", "2026-06-15", "pm")).toEqual(conflict);
  });
});
