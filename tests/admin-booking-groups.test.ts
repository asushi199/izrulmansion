import { describe, expect, it } from "vitest";
import { groupAdminBookings } from "../src/lib/admin-booking-groups";
import type { Booking, BookingStatus, Room, Slot } from "../src/lib/types";

const booking = (
  id: string,
  date: string,
  status: BookingStatus = "approved",
  room: Room = "bilik_mesyuarat",
  slot: Slot = "am"
): Booking => ({
  id,
  room,
  date,
  slot,
  name: "Cikgu Aminah",
  school_or_unit: "PKG Pantai Remis",
  purpose: `Tujuan ${id}`,
  contact: "0123456789",
  contact_normalized: "0123456789",
  created_at: `${date}T08:00:00.000Z`,
  status,
  approval_token_hash: null,
  approved_at: status === "approved" ? `${date}T08:10:00.000Z` : null,
  rejected_at: status === "rejected" ? `${date}T08:10:00.000Z` : null,
  notified_at: null,
  notification_error: null,
  cancelled_at: status === "cancelled" ? `${date}T08:10:00.000Z` : null
});

describe("admin booking grouping", () => {
  it("groups bookings by descending year and month, with bookings ordered by date", () => {
    const groups = groupAdminBookings([
      booking("old-may", "2025-05-20"),
      booking("jun-later", "2026-06-18", "pending", "studio", "pm"),
      booking("jan-new", "2027-01-04"),
      booking("jun-earlier", "2026-06-15"),
      booking("apr", "2026-04-02", "cancelled")
    ]);

    expect(groups.map((group) => group.year)).toEqual(["2027", "2026", "2025"]);
    expect(groups.map((group) => group.total)).toEqual([1, 3, 1]);
    expect(groups[1].months.map((month) => month.key)).toEqual(["2026-06", "2026-04"]);
    expect(groups[1].months[0].total).toBe(2);
    expect(groups[1].months[0].bookings.map((item) => item.id)).toEqual(["jun-earlier", "jun-later"]);
  });
});
