"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createBookingAction } from "../app/actions";
import { initialBookingState } from "../lib/action-states";
import { formatRoom, formatSlot, getConflictingBooking, rooms, slots } from "../lib/booking-rules";
import type { Booking, Room, Slot } from "../lib/types";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button className="primaryButton fullWidth" disabled={disabled || pending} type="submit">
      {pending ? "Menghantar..." : "Hantar Tempahan"}
    </button>
  );
}

export function BookingForm({
  bookings,
  configured
}: {
  bookings: Booking[];
  configured: boolean;
}) {
  const [state, formAction] = useFormState(createBookingAction, initialBookingState);
  const [room, setRoom] = useState<Room>("bilik_mesyuarat");
  const [slot, setSlot] = useState<Slot>("am");
  const [date, setDate] = useState("");

  const conflict = useMemo(() => {
    if (!date) return undefined;
    return getConflictingBooking(bookings, room, date, slot);
  }, [bookings, date, room, slot]);

  return (
    <section className="bookingCard">
      <p className="eyebrow">Tempahan baharu</p>
      <h2>Isi Maklumat Tempahan</h2>
      <p>Pilih bilik, tarikh dan slot. Selepas dihantar, klik butang WhatsApp untuk maklumkan admin.</p>

      <form action={formAction} className="stackForm">
        <div className="twoColumn">
          <label>
            Nama
            <input name="name" placeholder="Nama pemohon" required />
          </label>
          <label>
            Sekolah / Unit
            <input name="school_or_unit" placeholder="Contoh: SK Pantai Remis" required />
          </label>
        </div>

        <label>
          Tujuan
          <input name="purpose" placeholder="Contoh: Mesyuarat kurikulum" required />
        </label>

        <label>
          Nombor telefon
          <input inputMode="numeric" name="contact" placeholder="Contoh: 0123456789" required />
        </label>

        <div className="twoColumn">
          <label>
            Tarikh
            <input name="date" onChange={(event) => setDate(event.target.value)} required type="date" />
          </label>
          <label>
            Bilik
            <select name="room" onChange={(event) => setRoom(event.target.value as Room)} value={room}>
              {rooms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Slot
          <select name="slot" onChange={(event) => setSlot(event.target.value as Slot)} value={slot}>
            {slots.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        {conflict ? (
          <div className="notice error">
            {formatRoom(room)} pada {date} untuk slot {formatSlot(slot)} sedang ditempah / menunggu kelulusan oleh{" "}
            <strong>{conflict.name}</strong>.
          </div>
        ) : null}

        {state.message ? (
          <div className={state.ok ? "notice success" : "notice error"}>{state.message}</div>
        ) : null}

        {state.ok && state.whatsappUrl ? (
          <a className="whatsappButton fullWidth" href={state.whatsappUrl} rel="noreferrer" target="_blank">
            Hantar WhatsApp kepada admin
          </a>
        ) : null}

        <SubmitButton disabled={!configured || Boolean(conflict)} />
      </form>
    </section>
  );
}
