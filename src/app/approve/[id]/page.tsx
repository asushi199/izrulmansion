import Link from "next/link";
import { notFound } from "next/navigation";
import { approveByTokenAction } from "../actions";
import { verifyApprovalToken } from "../../../lib/approval-token";
import { formatBookingStatus, formatRoom, formatSlot } from "../../../lib/booking-rules";
import { formatMalayDate } from "../../../lib/date";
import { getBooking } from "../../../lib/repository";

export default async function ApprovalPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  const booking = await getBooking(params.id);
  if (!booking) notFound();

  const token = searchParams.token || "";
  const validToken = await verifyApprovalToken(booking.id, token, booking.approval_token_hash);

  return (
    <main className="authShell">
      <section className="authCard approvalCard">
        <p className="eyebrow">Kelulusan Tempahan</p>
        <h1>{validToken ? "Semak Permohonan" : "Pautan Tidak Sah"}</h1>
        {!validToken ? (
          <>
            <p>Pautan kelulusan ini tidak sah atau sudah tidak boleh digunakan.</p>
            <Link className="textLink" href="/">
              Kembali ke jadual
            </Link>
          </>
        ) : (
          <>
            <div className="approvalDetails">
              <p>
                <strong>Status:</strong> {formatBookingStatus(booking.status)}
              </p>
              <p>
                <strong>Pemohon:</strong> {booking.name}
              </p>
              <p>
                <strong>Sekolah / Unit:</strong> {booking.school_or_unit}
              </p>
              <p>
                <strong>Bilik:</strong> {formatRoom(booking.room)}
              </p>
              <p>
                <strong>Tarikh:</strong> {formatMalayDate(booking.date)}
              </p>
              <p>
                <strong>Slot:</strong> {formatSlot(booking.slot)}
              </p>
              <p>
                <strong>Tujuan:</strong> {booking.purpose}
              </p>
              <p>
                <strong>Telefon:</strong> {booking.contact}
              </p>
            </div>

            {booking.status === "pending" ? (
              <div className="approvalActions">
                <form action={approveByTokenAction}>
                  <input name="bookingId" type="hidden" value={booking.id} />
                  <input name="token" type="hidden" value={token} />
                  <input name="decision" type="hidden" value="approve" />
                  <button className="primaryButton fullWidth" type="submit">
                    Luluskan
                  </button>
                </form>
                <form action={approveByTokenAction}>
                  <input name="bookingId" type="hidden" value={booking.id} />
                  <input name="token" type="hidden" value={token} />
                  <input name="decision" type="hidden" value="reject" />
                  <button className="dangerButton fullWidth" type="submit">
                    Tolak
                  </button>
                </form>
              </div>
            ) : (
              <div className="notice success">Permohonan ini telah diproses.</div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
