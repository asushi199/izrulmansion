import Link from "next/link";
import { BookingForm } from "../components/BookingForm";
import { CalendarBoard } from "../components/CalendarBoard";
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

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">PKG Pantai Remis</p>
          <h1>Tempahan Bilik Mesyuarat & Studio</h1>
          <p className="heroText">
            Semak kekosongan bilik secara langsung dan rekod tempahan untuk slot pagi, petang
            atau sepanjang hari.
          </p>
        </div>
        <div className="heroActions">
          <Link className="ghostButton" href="/admin">
            Admin
          </Link>
          <Link className="ghostButton" href="/semak">
            Semak permohonan
          </Link>
          <Link className="primaryButton" href="#jadual">
            Jadual Online
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

      <section className="workspace">
        <BookingForm bookings={bookings} configured={configured && !bookingError} />
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
      </section>
    </main>
  );
}
