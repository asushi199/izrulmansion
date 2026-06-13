"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, setAdminSession } from "../../lib/admin-session";
import { getConflictingBooking } from "../../lib/booking-rules";
import { parseRoom, parseSlot, requiredText } from "../../lib/form";
import { approveBooking, cancelBooking, listActiveBookings, rejectBooking, updateBooking } from "../../lib/repository";
import type { LoginState } from "../../lib/types";

export async function loginAction(_previousState: LoginState, formData: FormData) {
  const password = requiredText(formData, "password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return {
      ok: false,
      message: "ADMIN_PASSWORD belum ditetapkan."
    };
  }

  if (password !== adminPassword) {
    return {
      ok: false,
      message: "Kata laluan tidak tepat."
    };
  }

  setAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  clearAdminSession();
  redirect("/admin/login");
}

export async function cancelBookingAction(formData: FormData) {
  const id = requiredText(formData, "id");
  if (id) {
    await cancelBooking(id);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  redirect("/admin?status=cancelled");
}

export async function approveBookingAction(formData: FormData) {
  const id = requiredText(formData, "id");
  if (id) {
    await approveBooking(id);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  redirect("/admin?status=approved");
}

export async function rejectBookingAction(formData: FormData) {
  const id = requiredText(formData, "id");
  if (id) {
    await rejectBooking(id);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  redirect("/admin?status=rejected");
}

export async function updateBookingAction(formData: FormData) {
  const id = requiredText(formData, "id");
  const room = parseRoom(formData.get("room"));
  const slot = parseSlot(formData.get("slot"));
  const date = requiredText(formData, "date");
  const name = requiredText(formData, "name");
  const schoolOrUnit = requiredText(formData, "school_or_unit");
  const purpose = requiredText(formData, "purpose");
  const contact = requiredText(formData, "contact");

  if (!id || !room || !slot || !date || !name || !schoolOrUnit || !purpose || !contact) {
    redirect("/admin?status=missing");
  }

  const activeBookings = (await listActiveBookings()).filter((booking) => booking.id !== id);
  const conflict = getConflictingBooking(activeBookings, room, date, slot);

  if (conflict) {
    redirect("/admin?status=conflict");
  }

  await updateBooking(id, {
    room,
    slot,
    date,
    name,
    school_or_unit: schoolOrUnit,
    purpose,
    contact
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=updated");
}
