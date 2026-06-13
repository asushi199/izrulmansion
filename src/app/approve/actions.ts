"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyApprovalToken } from "../../lib/approval-token";
import { requiredText } from "../../lib/form";
import { approveBooking, getBooking, rejectBooking } from "../../lib/repository";

export async function approveByTokenAction(formData: FormData) {
  const bookingId = requiredText(formData, "bookingId");
  const token = requiredText(formData, "token");
  const decision = requiredText(formData, "decision");
  const booking = bookingId ? await getBooking(bookingId) : null;

  if (!booking || !(await verifyApprovalToken(booking.id, token, booking.approval_token_hash))) {
    redirect(`/approve/result?status=invalid`);
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
