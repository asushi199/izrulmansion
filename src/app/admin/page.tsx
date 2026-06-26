import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminBookingTable } from "../../components/AdminBookingTable";
import { isAdminSession } from "../../lib/admin-session";
import { listAllBookings } from "../../lib/repository";
import type { Booking } from "../../lib/types";
import { logoutAction } from "./actions";

type SearchParams = {
  status?: string;
};

const messages: Record<string, string> = {
  updated: "Tempahan berjaya dikemas kini.",
  cancelled: "Tempahan berjaya dibatalkan.",
  approved: "Tempahan berjaya diluluskan.",
  rejected: "Tempahan berjaya ditolak.",
  conflict: "Tempahan tidak dikemas kini kerana slot tersebut sudah ditempah.",
  missing: "Sila lengkapkan semua maklumat."
};

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  if (!isAdminSession()) {
    redirect("/admin/login");
  }

  let bookings: Booking[] = [];
  let dataError = "";
  try {
    bookings = await listAllBookings();
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Gagal membaca data tempahan.";
  }
  const message = searchParams.status ? messages[searchParams.status] : "";

  return (
    <main className="shell">
      <section className="adminTop">
        <div>
          <p className="eyebrow">Panel Admin</p>
          <h1>Urus Tempahan Bilik</h1>
          <p>Kemas kini atau batalkan rekod tempahan untuk semua ruang PKG Pantai Remis.</p>
        </div>
        <div className="heroActions">
          <Link className="ghostButton" href="/">
            Jadual awam
          </Link>
          <form action={logoutAction}>
            <button className="dangerButton" type="submit">
              Log keluar
            </button>
          </form>
        </div>
      </section>

      {message ? <div className={searchParams.status === "conflict" ? "notice error" : "notice success"}>{message}</div> : null}
      {dataError ? (
        <div className="notice error">
          Data Supabase tidak dapat dibaca: {dataError}. Sila semak sambungan internet,
          service role key, dan migration Supabase.
        </div>
      ) : null}

      <AdminBookingTable bookings={bookings} />
    </main>
  );
}
