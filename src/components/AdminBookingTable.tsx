import {
  approveBookingAction,
  cancelBookingAction,
  rejectBookingAction,
  updateBookingAction
} from "../app/admin/actions";
import { formatBookingStatus, formatRoom, formatSlot, rooms, slots } from "../lib/booking-rules";
import { formatMalayDate } from "../lib/date";
import type { Booking } from "../lib/types";

export function AdminBookingTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <section className="emptyState">
        <h2>Belum ada tempahan</h2>
        <p>Rekod akan dipaparkan di sini selepas pengguna menghantar tempahan.</p>
      </section>
    );
  }

  return (
    <section className="adminList">
      {bookings.map((booking) => {
        const inactive = booking.status === "cancelled" || booking.status === "rejected";

        return (
          <article className={inactive ? "adminItem cancelled" : "adminItem"} key={booking.id}>
            <div className="adminItemMain">
              <div>
                <span
                  className={`statusBadge ${
                    booking.status === "pending"
                      ? "pendingBadge"
                      : booking.status === "approved"
                        ? "bookedBadge"
                        : "mutedBadge"
                  }`}
                >
                  {formatBookingStatus(booking.status)}
                </span>
                <h2>{booking.purpose}</h2>
                <p>
                  {formatMalayDate(booking.date)} - {formatRoom(booking.room)} -{" "}
                  {formatSlot(booking.slot)}
                </p>
                <p>
                  {booking.name} - {booking.school_or_unit} - {booking.contact}
                </p>
                {booking.notification_error ? (
                  <p className="inlineError">WhatsApp: {booking.notification_error}</p>
                ) : null}
              </div>

              <div className="adminActions">
                {booking.status === "pending" ? (
                  <>
                    <form action={approveBookingAction}>
                      <input name="id" type="hidden" value={booking.id} />
                      <button className="primaryButton" type="submit">
                        Luluskan
                      </button>
                    </form>
                    <form action={rejectBookingAction}>
                      <input name="id" type="hidden" value={booking.id} />
                      <button className="dangerButton" type="submit">
                        Tolak
                      </button>
                    </form>
                  </>
                ) : null}

                {booking.status === "approved" ? (
                  <form action={cancelBookingAction}>
                    <input name="id" type="hidden" value={booking.id} />
                    <button className="dangerButton" type="submit">
                      Batal
                    </button>
                  </form>
                ) : null}
              </div>
            </div>

            {booking.status === "pending" || booking.status === "approved" ? (
              <details className="editPanel">
                <summary>Kemaskini tempahan</summary>
                <form action={updateBookingAction} className="adminEditForm">
                  <input name="id" type="hidden" value={booking.id} />
                  <label>
                    Tarikh
                    <input defaultValue={booking.date} name="date" required type="date" />
                  </label>
                  <label>
                    Bilik
                    <select defaultValue={booking.room} name="room">
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Slot
                    <select defaultValue={booking.slot} name="slot">
                      {slots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Nama
                    <input defaultValue={booking.name} name="name" required />
                  </label>
                  <label>
                    Sekolah / Unit
                    <input defaultValue={booking.school_or_unit} name="school_or_unit" required />
                  </label>
                  <label>
                    Tujuan
                    <input defaultValue={booking.purpose} name="purpose" required />
                  </label>
                  <label>
                    Telefon
                    <input defaultValue={booking.contact} name="contact" required />
                  </label>
                  <button className="primaryButton" type="submit">
                    Simpan perubahan
                  </button>
                </form>
              </details>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
