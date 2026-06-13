"use server";

import { createApprovalToken } from "../../lib/approval-token";
import { formatRoom, formatSlot } from "../../lib/booking-rules";
import { formatMalayDate } from "../../lib/date";
import { requiredText } from "../../lib/form";
import { normalizePhoneNumber } from "../../lib/phone";
import { listPendingBookingsByContact, updateApprovalTokenHash } from "../../lib/repository";
import type { CheckBookingState } from "../../lib/types";
import { buildWhatsAppShareUrl, getWhatsAppAdminPhone } from "../../lib/whatsapp";

function getAppBaseUrl() {
  return process.env.APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export async function checkBookingAction(
  _previousState: CheckBookingState,
  formData: FormData
): Promise<CheckBookingState> {
  const contact = normalizePhoneNumber(requiredText(formData, "contact"));

  if (!contact) {
    return {
      ok: false,
      message: "Sila masukkan nombor telefon.",
      bookings: []
    };
  }

  try {
    const bookings = await listPendingBookingsByContact(contact);
    const adminPhone = getWhatsAppAdminPhone();

    if (bookings.length === 0) {
      return {
        ok: true,
        message: "Tiada permohonan yang masih menunggu kelulusan untuk nombor ini.",
        bookings: []
      };
    }

    const results = await Promise.all(
      bookings.map(async (booking) => {
        const { token, hash } = await createApprovalToken(booking.id);
        await updateApprovalTokenHash(booking.id, hash);
        const approvalUrl = `${getAppBaseUrl()}/approve/${booking.id}?token=${encodeURIComponent(token)}`;

        return {
          id: booking.id,
          date: formatMalayDate(booking.date),
          room: formatRoom(booking.room),
          slot: formatSlot(booking.slot),
          purpose: booking.purpose,
          status: "Menunggu kelulusan",
          whatsappUrl: adminPhone
            ? buildWhatsAppShareUrl(adminPhone, {
                name: booking.name,
                room: formatRoom(booking.room),
                date: formatMalayDate(booking.date),
                slot: formatSlot(booking.slot),
                purpose: booking.purpose,
                approvalUrl
              })
            : ""
        };
      })
    );

    return {
      ok: true,
      message: adminPhone
        ? "Permohonan dijumpai. Klik butang WhatsApp untuk hantar semula kepada admin."
        : "Permohonan dijumpai, tetapi nombor WhatsApp admin belum ditetapkan.",
      bookings: results
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Permohonan tidak dapat disemak.",
      bookings: []
    };
  }
}
