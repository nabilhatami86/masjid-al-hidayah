import { createServerClient } from "@/lib/supabaseServer";

export async function getPengaturan(key: string): Promise<string | null> {
  const sb = createServerClient();
  const { data } = await sb
    .from("pengaturan")
    .select("value")
    .eq("key", key)
    .single();
  return (data?.value as string | null) ?? null;
}

export async function setPengaturan(key: string, value: string | null): Promise<void> {
  const sb = createServerClient();
  const { error } = await sb
    .from("pengaturan")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}
