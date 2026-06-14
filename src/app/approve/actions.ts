"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdminApprovalPassword } from "../../lib/admin-approval-auth";
import { verifyApprovalToken } from "../../lib/approval-token";
import { requiredText } from "../../lib/form";
import { approveBooking, getBooking, rejectBooking } from "../../lib/repository";

export async function approveByTokenAction(formData: FormData) {
  const bookingId = requiredText(formData, "bookingId");
  const token = requiredText(formData, "token");
  const decision = requiredText(formData, "decision");
  const adminPassword = requiredText(formData, "adminPassword");
  const booking = bookingId ? await getBooking(bookingId) : null;

  if (!booking || !(await verifyApprovalToken(booking.id, token, booking.approval_token_hash))) {
    redirect(`/approve/result?status=invalid`);
  }

  if (!verifyAdminApprovalPassword(adminPassword, process.env.ADMIN_PASSWORD)) {
    redirect(`/approve/result?status=unauthorized`);
  }

  if (booking.status !== "pending") {
    redirect(`/approve/result?status=processed`);
  }

  if (decision === "approve") {
    await approveBooking(booking.id);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect(`/approve/result?status=approved`);
  }

  if (decision === "reject") {
    await rejectBooking(booking.id);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect(`/approve/result?status=rejected`);
  }

  redirect(`/approve/result?status=invalid`);
}
