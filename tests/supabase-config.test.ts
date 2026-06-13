import { createClient } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabaseAdmin, isSupabaseConfigured } from "../src/lib/supabase";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ from: vi.fn() }))
}));

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.clearAllMocks();
});

describe("Supabase configuration detection", () => {
  it("treats example placeholder values as not configured", () => {
    process.env.SUPABASE_URL = "https://your-project.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key";

    expect(isSupabaseConfigured()).toBe(false);
  });

  it("accepts real-looking Supabase URL and service role key values", () => {
    process.env.SUPABASE_URL = "https://abcdefghijklmnop.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role";

    expect(isSupabaseConfigured()).toBe(true);
  });

  it("trims Supabase credentials before creating the admin client", () => {
    process.env.SUPABASE_URL = " https://abcdefghijklmnop.supabase.co\n";
    process.env.SUPABASE_SERVICE_ROLE_KEY = " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role\n";

    getSupabaseAdmin();

    expect(createClient).toHaveBeenCalledWith(
      "https://abcdefghijklmnop.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role",
      expect.any(Object)
    );
  });
});
