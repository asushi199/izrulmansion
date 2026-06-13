import { formatSlot, getSlotBooking, rooms } from "../lib/booking-rules";
import { formatDayName, formatMalayDate } from "../lib/date";
import type { Booking } from "../lib/types";

export function CalendarBoard({ bookings, dates }: { bookings: Booking[]; dates: string[] }) {
  return (
    <div className="calendarWrap">
      <div className="calendarGrid headerGrid">
        <div className="dateHeader">Tarikh</div>
        {rooms.map((room) => (
          <div className="roomHeader" key={room.id}>
            {room.name}
          </div>
        ))}
      </div>

      <div className="calendarGrid slotHeaderGrid">
        <div />
        {rooms.map((room) => (
          <div className="slotHeaderPair" key={room.id}>
            <span>Pagi</span>
            <span>Petang</span>
          </div>
        ))}
      </div>

      {dates.map((date) => (
        <div className="calendarGrid dayRow" key={date}>
          <div className="dateCell">
            <strong>{formatDayName(date)}</strong>
            <span>{formatMalayDate(date, { year: undefined })}</span>
          </div>
          {rooms.map((room) => (
            <div className="slotPair" key={`${date}-${room.id}`}>
              <div className="mobileRoomLabel">{room.name}</div>
              {(["am", "pm"] as const).map((slot) => {
                const booking = getSlotBooking(bookings, room.id, date, slot);
                const isFullDay = booking?.slot === "full_day";
                const statusLabel = booking?.status === "pending" ? "Menunggu Kelulusan" : "Diluluskan";

                return (
                  <div
                    className={
                      booking
                        ? booking.status === "pending"
                          ? "slotCell pending"
                          : "slotCell booked"
                        : "slotCell available"
                    }
                    key={slot}
                  >
                    {booking ? (
                      <>
                        <span
                          className={
                            booking.status === "pending"
                              ? "statusBadge pendingBadge"
                              : isFullDay
                                ? "statusBadge fullDay"
                                : "statusBadge bookedBadge"
                          }
                        >
                          {booking.status === "pending"
                            ? "Menunggu"
                            : isFullDay
                              ? "Penuh hari"
                              : formatSlot(booking.slot)}
                        </span>
                        <strong>{booking.purpose}</strong>
                        <small>
                          {booking.name} - {statusLabel}
                        </small>
                      </>
                    ) : (
                      <>
                        <span className="statusBadge openBadge">Kosong</span>
                        <strong>{slot === "am" ? "Pagi" : "Petang"}</strong>
                        <small>Sedia ditempah</small>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
