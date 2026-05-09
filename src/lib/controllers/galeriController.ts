import { createServerClient } from "@/lib/supabaseServer";

/*
  Jalankan SQL berikut di Supabase SQL Editor sebelum menggunakan fitur ini:

  CREATE TABLE IF NOT EXISTS galeri (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul       TEXT NOT NULL,
    deskripsi   TEXT DEFAULT '',
    image_url   TEXT NOT NULL,
    kategori    TEXT DEFAULT 'Kegiatan',
    tanggal     DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );

  Buat bucket Storage bernama "galeri" dengan akses public di Supabase Dashboard.
*/

export interface GaleriItem {
  id: string;
  judul: string;
  deskripsi: string;
  image_url: string;
  kategori: string;
  tanggal: string;
  created_at: string;
}

export const KATEGORI_GALERI = ["Kegiatan", "Kajian", "Renovasi", "Sosial", "Ramadan", "Lainnya"] as const;

export async function getAllGaleri(): Promise<GaleriItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("galeri")
    .select("*")
    .order("tanggal", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createGaleri(body: Omit<GaleriItem, "id" | "created_at">): Promise<GaleriItem> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("galeri")
    .insert([body])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGaleri(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("galeri").delete().eq("id", id);
  if (error) throw error;
}

export async function getGaleriById(id: string): Promise<GaleriItem | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("galeri").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}
