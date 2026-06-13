import { describe, expect, it } from "vitest";
import { buildWhatsAppShareUrl } from "../src/lib/whatsapp";

describe("WhatsApp manual share link", () => {
  it("builds a wa.me URL with booking details and approval link", () => {
    const url = buildWhatsAppShareUrl("+60 12-345 6789", {
      name: "Cikgu Aminah",
      room: "Bilik Mesyuarat",
      date: "15 Jun 2026",
      slot: "Pagi",
      purpose: "Mesyuarat kurikulum",
      approvalUrl: "https://example.com/approve/abc?token=def"
    });

    expect(url.startsWith("https://wa.me/60123456789?text=")).toBe(true);
    const message = decodeURIComponent(url.split("text=")[1]);
    expect(message).toContain("Permohonan tempahan bilik baharu");
    expect(message).toContain("Nama: Cikgu Aminah");
    expect(message).toContain("Bilik: Bilik Mesyuarat");
    expect(message).toContain("Pautan kelulusan: https://example.com/approve/abc?token=def");
  });
});
