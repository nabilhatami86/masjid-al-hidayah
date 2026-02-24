/**
 * transaksiController.ts
 * Business logic layer untuk data Transaksi Keuangan.
 * Dipanggil oleh API Route Handlers — BUKAN dari komponen client.
 */
import { createServerClient } from "@/lib/supabaseServer";
import type { TransaksiAdmin } from "@/lib/adminTypes";
import { KATEGORI_MASUK, KATEGORI_KELUAR } from "@/lib/adminTypes";

// ─── Row mapper ──────────────────────────────────────────────
function toTransaksi(r: Record<string, unknown>): TransaksiAdmin {
  return {
    id:         r.id          as string,
    tanggal:    r.tanggal     as string,
    keterangan: r.keterangan  as string,
    kategori:   r.kategori    as string,
    jenis:      r.jenis       as "masuk" | "keluar",
    jumlah:     r.jumlah      as number,
  };
}

// ─── Controller functions ─────────────────────────────────────

/** GET semua transaksi, urut tanggal terbaru dulu */
export async function getAllTransaksi(): Promise<TransaksiAdmin[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("transaksi")
    .select("*")
    .order("tanggal", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toTransaksi);
}

/** GET ringkasan: total masuk, keluar, saldo */
export async function getSummaryTransaksi() {
  const sb = createServerClient();
  const { data, error } = await sb.from("transaksi").select("jenis, jumlah");
  if (error) throw error;

  let masuk = 0, keluar = 0;
  for (const r of data ?? []) {
    if (r.jenis === "masuk") masuk  += r.jumlah;
    else                     keluar += r.jumlah;
  }
  return { masuk, keluar, saldo: masuk - keluar };
}

/** POST — buat transaksi baru */
export async function createTransaksi(
  body: Omit<TransaksiAdmin, "id">,
): Promise<TransaksiAdmin> {
  if (!body.keterangan?.trim())  throw new Error("Keterangan wajib diisi.");
  if (!body.tanggal)             throw new Error("Tanggal wajib diisi.");
  if (!body.jumlah || body.jumlah <= 0) throw new Error("Jumlah harus lebih dari 0.");
  if (!["masuk", "keluar"].includes(body.jenis)) throw new Error("Jenis tidak valid.");

  const validKategori = body.jenis === "masuk" ? KATEGORI_MASUK : KATEGORI_KELUAR;
  if (!validKategori.includes(body.kategori)) throw new Error("Kategori tidak valid.");

  const sb = createServerClient();
  const { data, error } = await sb
    .from("transaksi")
    .insert({
      tanggal:    body.tanggal,
      keterangan: body.keterangan.trim(),
      kategori:   body.kategori,
      jenis:      body.jenis,
      jumlah:     body.jumlah,
    })
    .select()
    .single();
  if (error) throw error;
  return toTransaksi(data);
}

/** PUT — update transaksi */
export async function updateTransaksi(
  id: string,
  body: Partial<Omit<TransaksiAdmin, "id">>,
): Promise<TransaksiAdmin> {
  const payload: Record<string, unknown> = {};
  if (body.tanggal    !== undefined) payload.tanggal    = body.tanggal;
  if (body.keterangan !== undefined) payload.keterangan = body.keterangan.trim();
  if (body.kategori   !== undefined) payload.kategori   = body.kategori;
  if (body.jenis      !== undefined) payload.jenis      = body.jenis;
  if (body.jumlah     !== undefined) payload.jumlah     = body.jumlah;

  const sb = createServerClient();
  const { data, error } = await sb
    .from("transaksi").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return toTransaksi(data);
}

/** DELETE — hapus transaksi */
export async function deleteTransaksi(id: string): Promise<void> {
  const sb = createServerClient();
  const { error } = await sb.from("transaksi").delete().eq("id", id);
  if (error) throw error;
}
