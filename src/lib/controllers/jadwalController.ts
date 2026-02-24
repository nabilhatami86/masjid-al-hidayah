/**
 * jadwalController.ts
 * Business logic layer untuk data Jadwal.
 * Dipanggil oleh API Route Handlers — BUKAN dari komponen client.
 */
import { createServerClient } from "@/lib/supabaseServer";
import type { Jadwal } from "@/lib/adminTypes";

// ─── Row mapper ──────────────────────────────────────────────
function toJadwal(r: Record<string, unknown>): Jadwal {
  return {
    id:            r.id              as string,
    tanggal:       r.tanggal         as string,
    jenisKegiatan: r.jenis_kegiatan  as string,
    khatibId:      (r.khatib_id      as string) ?? "",
    khatibNama:    (r.khatib         as Record<string, string>)?.nama ?? "",
    topik:         r.topik           as string,
    waktu:         r.waktu           as string,
    keterangan:    r.keterangan      as string,
  };
}

// ─── Controller functions ─────────────────────────────────────

/** GET semua jadwal, join nama khatib, urut tanggal asc */
export async function getAllJadwal(): Promise<Jadwal[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("jadwal")
    .select("*, khatib(nama)")
    .order("tanggal");
  if (error) throw error;
  return (data ?? []).map(toJadwal);
}

/** GET jadwal mendatang (>= hari ini), max N item */
export async function getJadwalMendatang(limit = 6): Promise<Jadwal[]> {
  const today = new Date().toISOString().slice(0, 10);
  const sb = createServerClient();
  const { data, error } = await sb
    .from("jadwal")
    .select("*, khatib(nama)")
    .gte("tanggal", today)
    .order("tanggal")
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(toJadwal);
}

/** POST — buat jadwal baru */
export async function createJadwal(
  body: Omit<Jadwal, "id" | "khatibNama">,
): Promise<Jadwal> {
  if (!body.tanggal)        throw new Error("Tanggal wajib diisi.");
  if (!body.topik?.trim())  throw new Error("Topik wajib diisi.");

  const sb = createServerClient();
  const { data, error } = await sb
    .from("jadwal")
    .insert({
      tanggal:        body.tanggal,
      jenis_kegiatan: body.jenisKegiatan,
      khatib_id:      body.khatibId || null,
      topik:          body.topik.trim(),
      waktu:          body.waktu,
      keterangan:     body.keterangan?.trim() ?? "",
    })
    .select("*, khatib(nama)")
    .single();
  if (error) throw error;
  return toJadwal(data);
}

/** PUT — update jadwal */
export async function updateJadwal(
  id: string,
  body: Partial<Omit<Jadwal, "id" | "khatibNama">>,
): Promise<Jadwal> {
  const payload: Record<string, unknown> = {};
  if (body.tanggal        !== undefined) payload.tanggal        = body.tanggal;
  if (body.jenisKegiatan  !== undefined) payload.jenis_kegiatan = body.jenisKegiatan;
  if (body.khatibId       !== undefined) payload.khatib_id      = body.khatibId || null;
  if (body.topik          !== undefined) payload.topik          = body.topik.trim();
  if (body.waktu          !== undefined) payload.waktu          = body.waktu;
  if (body.keterangan     !== undefined) payload.keterangan     = body.keterangan;

  const sb = createServerClient();
  const { data, error } = await sb
    .from("jadwal").update(payload).eq("id", id)
    .select("*, khatib(nama)").single();
  if (error) throw error;
  return toJadwal(data);
}

/** DELETE — hapus jadwal */
export async function deleteJadwal(id: string): Promise<void> {
  const sb = createServerClient();
  const { error } = await sb.from("jadwal").delete().eq("id", id);
  if (error) throw error;
}
