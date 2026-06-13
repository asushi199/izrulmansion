import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase-types";

function isPlaceholder(value: string) {
  return value.includes("your-project") || value.includes("your-service-role-key");
}

export function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) return false;
  if (isPlaceholder(url) || isPlaceholder(serviceRoleKey)) return false;

  return url.startsWith("https://") && url.endsWith(".supabase.co");
}

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  );
}
