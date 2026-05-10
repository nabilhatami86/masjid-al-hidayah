import { createServerClient } from "@/lib/supabaseServer";

/*
  Jalankan SQL berikut di Supabase SQL Editor sebelum menggunakan fitur ini:

  CREATE TABLE IF NOT EXISTS berita (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug       TEXT UNIQUE NOT NULL,
    judul      TEXT NOT NULL,
    ringkasan  TEXT DEFAULT '',
    konten     TEXT DEFAULT '',
    kategori   TEXT DEFAULT 'Pengumuman',
    tanggal    DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
*/

export interface BeritaDB {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  tanggal: string;
  created_at: string;
}

export const KATEGORI_BERITA = [
  "Pengumuman", "Kajian", "Pendidikan", "Infrastruktur", "Sosial", "Renovasi",
] as const;

export function getBeritaColors(kategori: string) {
  const map: Record<string, { dotColor: string; labelColor: string; badgeBg: string }> = {
    Pendidikan:    { dotColor: "bg-blue-500",    labelColor: "text-blue-600",    badgeBg: "bg-blue-50 text-blue-700 border-blue-200"       },
    Kajian:        { dotColor: "bg-emerald-500", labelColor: "text-emerald-700", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    Infrastruktur: { dotColor: "bg-amber-500",   labelColor: "text-amber-700",   badgeBg: "bg-amber-50 text-amber-700 border-amber-200"     },
    Pengumuman:    { dotColor: "bg-orange-500",  labelColor: "text-orange-700",  badgeBg: "bg-orange-50 text-orange-700 border-orange-200"  },
    Sosial:        { dotColor: "bg-purple-500",  labelColor: "text-purple-700",  badgeBg: "bg-purple-50 text-purple-700 border-purple-200"  },
    Renovasi:      { dotColor: "bg-amber-500",   labelColor: "text-amber-700",   badgeBg: "bg-amber-50 text-amber-700 border-amber-200"     },
  };
  return map[kategori] ?? { dotColor: "bg-gray-400", labelColor: "text-gray-600", badgeBg: "bg-gray-50 text-gray-700 border-gray-200" };
}

export function formatTanggalBerita(isoDate: string): string {
  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export async function getAllBerita(): Promise<BeritaDB[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .order("tanggal", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Alias untuk admin panel */
export const getAllBeritaAdmin = getAllBerita;

export async function getBeritaBySlugDB(slug: string): Promise<BeritaDB | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function createBerita(body: Omit<BeritaDB, "id" | "created_at">): Promise<BeritaDB> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("berita")
    .insert([body])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBerita(id: string, body: Partial<Omit<BeritaDB, "id" | "created_at">>): Promise<BeritaDB> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("berita")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBerita(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("berita").delete().eq("id", id);
  if (error) throw error;
}
