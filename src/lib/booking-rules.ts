import type { Booking, Room, Slot } from "./types";

export const rooms: Array<{
  id: Room;
  name: string;
  shortName: string;
  category: string;
  imageSrc: string;
}> = [
  {
    id: "bilik_seminar",
    name: "Bilik Mentarang",
    shortName: "Mentarang",
    category: "Bilik Seminar",
    imageSrc: "/rooms/bilik-mentarang.png"
  },
  {
    id: "bilik_mesyuarat",
    name: "Bilik Remis",
    shortName: "Remis",
    category: "Bilik Mesyuarat",
    imageSrc: "/rooms/bilik-remis.png"
  },
  {
    id: "studio",
    name: "Studio 1002",
    shortName: "Studio 1002",
    category: "Studio",
    imageSrc: "/rooms/studio-1002.png"
  }
];

export const slots: Array<{ id: Slot; label: string; shortLabel: string }> = [
  { id: "am", label: "Pagi", shortLabel: "AM" },
  { id: "pm", label: "Petang", shortLabel: "PM" },
  { id: "full_day", label: "Sepanjang Hari", shortLabel: "Hari" }
];

export function slotsOverlap(existingSlot: Slot, requestedSlot: Slot) {
  return (
    existingSlot === requestedSlot ||
    existingSlot === "full_day" ||
    requestedSlot === "full_day"
  );
}

export function blocksSlot(booking: Booking) {
  return booking.status === "pending" || booking.status === "approved";
}

export function getConflictingBooking(
  bookings: Booking[],
  room: Room,
  date: string,
  slot: Slot
) {
  return bookings.find((booking) => {
    if (!blocksSlot(booking)) return false;
    if (booking.room !== room || booking.date !== date) return false;

    return slotsOverlap(booking.slot, slot);
  });
}

export function isSlotAvailable(
  bookings: Booking[],
  room: Room,
  date: string,
  slot: Slot
) {
  return !getConflictingBooking(bookings, room, date, slot);
}

export function getSlotBooking(bookings: Booking[], room: Room, date: string, slot: Slot) {
  return bookings.find((booking) => {
    if (!blocksSlot(booking)) return false;
    if (booking.room !== room || booking.date !== date) return false;

    if (booking.slot === "full_day") return true;
    return booking.slot === slot;
  });
}

export function formatSlot(slot: Slot) {
  return slots.find((item) => item.id === slot)?.label ?? slot;
}

export function formatRoom(room: Room) {
  return rooms.find((item) => item.id === room)?.name ?? room;
}

export function formatBookingStatus(status: Booking["status"]) {
  const labels: Record<Booking["status"], string> = {
    pending: "Menunggu kelulusan",
    approved: "Diluluskan",
    rejected: "Ditolak",
    cancelled: "Dibatalkan"
  };

  return labels[status];
}
