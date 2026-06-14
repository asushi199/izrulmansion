import { getSlotBooking, rooms } from "../lib/booking-rules";
import { formatDayName, formatMalayDate } from "../lib/date";
import type { Booking, Room } from "../lib/types";

export function CalendarBoard({
  activeMobileRoom,
  bookings,
  dates
}: {
  activeMobileRoom: Room;
  bookings: Booking[];
  dates: string[];
}) {
  return (
    <div className="calendarWrap">
      <div className="calendarGrid headerGrid calendarDesktopOnly">
        <div className="dateHeader">Tarikh</div>
        {rooms.map((room) => (
          <div className="roomHeader" key={room.id}>
            {room.name}
          </div>
        ))}
      </div>

      <div className="calendarGrid slotHeaderGrid calendarDesktopOnly">
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
            <div
              className={room.id === activeMobileRoom ? "slotPair" : "slotPair inactiveMobileRoom"}
              key={`${date}-${room.id}`}
            >
              <div className="mobileRoomLabel">{room.name}</div>
              {(["am", "pm"] as const).map((slot) => {
                const booking = getSlotBooking(bookings, room.id, date, slot);
                const isFullDay = booking?.slot === "full_day";
                const statusLabel = booking?.status === "pending" ? "Menunggu Kelulusan" : "Diluluskan";

                const cellTone = booking
                  ? booking.status === "pending"
                    ? "pending"
                    : "booked"
                  : "available";

                return (
                  <div className={`slotCell slotCell--${cellTone}`} key={slot}>
                    <span className="slotTime">{slot === "am" ? "Pagi" : "Petang"}</span>
                    {booking ? (
                      <>
                        <p className="slotPurpose" title={booking.purpose}>
                          {booking.purpose}
                        </p>
                        <p className="slotMeta">
                          {booking.name}
                          <span className="slotMetaDivider">·</span>
                          {statusLabel}
                        </p>
                        {isFullDay ? <span className="slotTag slotTag--fullDay">Penuh hari</span> : null}
                      </>
                    ) : (
                      <span className="slotEmpty">Kosong</span>
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
