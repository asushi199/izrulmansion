"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createApprovalToken } from "../lib/approval-token";
import { formatRoom, formatSlot, getConflictingBooking } from "../lib/booking-rules";
import { formatMalayDate } from "../lib/date";
import { parseRoom, parseSlot, requiredText } from "../lib/form";
import { normalizePhoneNumber } from "../lib/phone";
import { createBooking, listActiveBookings } from "../lib/repository";
import type { BookingFormState } from "../lib/types";
import { buildWhatsAppShareUrl, getWhatsAppAdminPhone } from "../lib/whatsapp";

function getAppBaseUrl() {
  return process.env.APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export async function createBookingAction(
  _previousState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const room = parseRoom(formData.get("room"));
  const slot = parseSlot(formData.get("slot"));
  const date = requiredText(formData, "date");
  const name = requiredText(formData, "name");
  const schoolOrUnit = requiredText(formData, "school_or_unit");
  const purpose = requiredText(formData, "purpose");
  const contact = requiredText(formData, "contact");
  const normalizedContact = normalizePhoneNumber(contact);

  if (!room || !slot || !date || !name || !schoolOrUnit || !purpose || !normalizedContact) {
    return {
      ok: false,
      message: "Sila lengkapkan semua maklumat tempahan."
    };
  }

  try {
    const activeBookings = await listActiveBookings();
    const conflict = getConflictingBooking(activeBookings, room, date, slot);

    if (conflict) {
      return {
        ok: false,
        message: `Slot ini telah ditempah atau menunggu kelulusan oleh ${conflict.name} untuk ${conflict.purpose}. Sila pilih masa lain.`
      };
    }

    const bookingId = randomUUID();
    const { token, hash } = await createApprovalToken(bookingId);
    const booking = await createBooking({
      id: bookingId,
      room,
      slot,
      date,
      name,
      school_or_unit: schoolOrUnit,
      purpose,
      contact: normalizedContact,
      status: "pending",
      approval_token_hash: hash
    });

    const approvalUrl = `${getAppBaseUrl()}/approve/${booking.id}?token=${encodeURIComponent(token)}`;
    const adminPhone = getWhatsAppAdminPhone();
    const whatsappUrl = adminPhone
      ? buildWhatsAppShareUrl(adminPhone, {
          name,
          room: formatRoom(room),
          date: formatMalayDate(date),
          slot: formatSlot(slot),
          purpose,
          approvalUrl
        })
      : "";

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      ok: true,
      message: adminPhone
        ? "Permohonan diterima. Sila hantar mesej WhatsApp kepada admin untuk kelulusan."
        : "Permohonan diterima. Nombor WhatsApp admin belum ditetapkan.",
      whatsappUrl
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Tempahan tidak berjaya dihantar."
    };
  }
}
