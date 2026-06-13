import Link from "next/link";
import { BookingForm } from "../components/BookingForm";
import { CalendarBoard } from "../components/CalendarBoard";
import { getSlotBooking, rooms } from "../lib/booking-rules";
import {
  addDays,
  addMonths,
  formatMalayDate,
  listDateRange,
  startOfMonth,
  startOfWeek,
  toIsoDate
} from "../lib/date";
import { listActiveBookings } from "../lib/repository";
import { isSupabaseConfigured } from "../lib/supabase";
import type { Booking } from "../lib/types";

type SearchParams = {
  view?: string;
  start?: string;
};

function buildRoomSummaries(bookings: Booking[], dates: string[]) {
  return rooms.map((room) => {
    let pending = 0;
    let approved = 0;

    for (const date of dates) {
      for (const slot of ["am", "pm"] as const) {
        const booking = getSlotBooking(bookings, room.id, date, slot);

        if (booking?.status === "pending") pending += 1;
        if (booking?.status === "approved") approved += 1;
      }
    }

    const totalSlots = dates.length * 2;

    return {
      ...room,
      approved,
      available: Math.max(totalSlots - pending - approved, 0),
      pending
    };
  });
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const today = toIsoDate(new Date());
  const view = searchParams.view === "month" ? "month" : "week";
  const baseStart = searchParams.start || today;
  const start = view === "month" ? startOfMonth(baseStart) : startOfWeek(baseStart);
  const dates = listDateRange(start, view === "month" ? 30 : 7);
  const previousStart = view === "month" ? addMonths(start, -1) : addDays(start, -7);
  const nextStart = view === "month" ? addMonths(start, 1) : addDays(start, 7);
  const configured = isSupabaseConfigured();
  let bookingError = "";
  let bookings: Booking[] = [];

  if (configured) {
    try {
      bookings = await listActiveBookings();
    } catch (error) {
      bookingError = error instanceof Error ? error.message : "Gagal membaca data tempahan.";
    }
  }

  const roomSummaries = buildRoomSummaries(bookings, dates);

  return (
    <main className="shell">
      <nav className="topNav">
        <Link className="brandMark" href="/">
          <span>PKG</span>
          <strong>Tempahan Bilik</strong>
        </Link>
        <div className="topNavLinks">
          <Link href="/semak">Semak Status</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>

      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">PKG Pantai Remis</p>
          <h1>Tempahan Bilik PKG Pantai Remis</h1>
          <p className="heroText">
            Pilih bilik, semak slot kosong dan hantar permohonan untuk kelulusan admin.
          </p>
        </div>
        <div className="heroActions compactActions">
          <Link className="ghostButton" href="/semak">
            Semak Permohonan
          </Link>
          <Link className="primaryButton" href="#tempah">
            Permohonan Baharu
          </Link>
        </div>
      </section>

      {!configured ? (
        <div className="notice warning">
          Supabase belum dikonfigurasi. Jadual boleh dipratonton, tetapi penghantaran tempahan
          memerlukan tetapan dalam <code>.env.local</code>.
        </div>
      ) : null}

      {bookingError ? (
        <div className="notice error">
          Data Supabase tidak dapat dibaca: {bookingError}. Sila semak sambungan internet,
          service role key, dan pastikan <code>supabase/schema.sql</code> sudah dijalankan.
        </div>
      ) : null}

      <section className="roomSummaryGrid" aria-label="Ringkasan status bilik">
        {roomSummaries.map((room) => (
          <article className="roomSummaryCard" key={room.id}>
            <div>
              <p className="eyebrow">Paparan {view === "month" ? "bulan" : "minggu"} ini</p>
              <h2>{room.name}</h2>
            </div>
            <div className="summaryMetrics">
              <span>
                <strong>{room.available}</strong>
                Kosong
              </span>
              <span>
                <strong>{room.pending}</strong>
                Menunggu
              </span>
              <span>
                <strong>{room.approved}</strong>
                Diluluskan
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="schedulePanel" id="jadual">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Status tempahan</p>
              <h2>{view === "month" ? "Paparan Bulanan" : "Paparan Mingguan"}</h2>
              <p>
                {formatMalayDate(dates[0])} - {formatMalayDate(dates[dates.length - 1])}
              </p>
            </div>
            <div className="viewControls">
              <Link className={view === "week" ? "activePill" : "pill"} href={`/?view=week&start=${start}`}>
                Minggu
              </Link>
              <Link className={view === "month" ? "activePill" : "pill"} href={`/?view=month&start=${start}`}>
                Bulan
              </Link>
            </div>
          </div>
          <div className="statusLegend" aria-label="Petunjuk status">
            <span>
              <i className="legendDot availableDot" /> Kosong
            </span>
            <span>
              <i className="legendDot pendingDot" /> Menunggu Kelulusan
            </span>
            <span>
              <i className="legendDot bookedDot" /> Diluluskan
            </span>
          </div>
          <div className="navRow">
            <Link className="ghostButton" href={`/?view=${view}&start=${previousStart}`}>
              Sebelum
            </Link>
            <Link className="ghostButton" href={`/?view=${view}&start=${today}`}>
              Hari ini
            </Link>
            <Link className="ghostButton" href={`/?view=${view}&start=${nextStart}`}>
              Seterusnya
            </Link>
          </div>
          <CalendarBoard bookings={bookings} dates={dates} />
        </div>
        <BookingForm bookings={bookings} configured={configured && !bookingError} />
      </section>
    </main>
  );
}
