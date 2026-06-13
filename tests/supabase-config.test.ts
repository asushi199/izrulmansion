import { afterEach, describe, expect, it } from "vitest";
import { isSupabaseConfigured } from "../src/lib/supabase";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
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
});
