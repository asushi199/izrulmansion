import { describe, expect, it } from "vitest";
import { createApprovalToken, verifyApprovalToken } from "../src/lib/approval-token";

describe("approval tokens", () => {
  it("verifies only the original token for the matching booking", async () => {
    const { token, hash } = await createApprovalToken("booking-123");

    await expect(verifyApprovalToken("booking-123", token, hash)).resolves.toBe(true);
    await expect(verifyApprovalToken("booking-123", "wrong-token", hash)).resolves.toBe(false);
    await expect(verifyApprovalToken("booking-456", token, hash)).resolves.toBe(false);
  });
});
