import type { Room, Slot } from "./types";

export function parseRoom(value: FormDataEntryValue | null): Room | null {
  if (value === "bilik_seminar" || value === "bilik_mesyuarat" || value === "studio") return value;
  return null;
}

export function parseSlot(value: FormDataEntryValue | null): Slot | null {
  if (value === "am" || value === "pm" || value === "full_day") return value;
  return null;
}

export function requiredText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
