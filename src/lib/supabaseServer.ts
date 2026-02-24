/**
 * supabaseServer.ts
 * Client Supabase khusus untuk server-side (API Route Handlers).
 * Menggunakan SERVICE_ROLE_KEY agar bisa bypass RLS saat write.
 * JANGAN diimpor dari komponen client ("use client").
 */
import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Prioritaskan service role key (bypass RLS), fallback ke anon key
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
            ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
