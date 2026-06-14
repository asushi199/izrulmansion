import { describe, expect, it } from "vitest";
import { verifyAdminApprovalPassword } from "../src/lib/admin-approval-auth";

describe("admin approval password", () => {
  it("requires the submitted password to match the configured admin password", () => {
    expect(verifyAdminApprovalPassword("secret-admin", "secret-admin")).toBe(true);
    expect(verifyAdminApprovalPassword("wrong-password", "secret-admin")).toBe(false);
    expect(verifyAdminApprovalPassword("", "secret-admin")).toBe(false);
    expect(verifyAdminApprovalPassword("secret-admin", "")).toBe(false);
  });
});
