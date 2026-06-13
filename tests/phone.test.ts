import { describe, expect, it } from "vitest";
import { normalizePhoneNumber } from "../src/lib/phone";

describe("phone number normalization", () => {
  it("keeps only digits from local phone formats", () => {
    expect(normalizePhoneNumber("012-345 6789")).toBe("0123456789");
    expect(normalizePhoneNumber(" 05 688-1234 ")).toBe("056881234");
  });
});
