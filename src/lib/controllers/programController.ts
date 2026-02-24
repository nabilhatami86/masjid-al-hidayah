import { createServerClient } from "@/lib/supabaseServer";

export interface ProgramImage {
  key: string;
  imageUrl: string | null;
}

export async function getAllProgramImages(): Promise<ProgramImage[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("program_images")
    .select("key, image_url");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    key:      r.key      as string,
    imageUrl: (r.image_url as string | null) ?? null,
  }));
}

export async function upsertProgramImage(
  key: string,
  imageUrl: string,
): Promise<void> {
  const sb = createServerClient();
  const { error } = await sb
    .from("program_images")
    .upsert({ key, image_url: imageUrl });
  if (error) throw error;
}
