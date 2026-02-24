/**
 * db.ts — Query helpers Supabase
 * Pengganti semua fungsi localStorage (lsGet / lsSet) di adminTypes.ts
 *
 * Cara pakai:
 *   import { dbKhatib, dbJadwal, dbTransaksi } from "@/lib/db";
 *
 *   // Ambil semua khatib
 *   const list = await dbKhatib.getAll();
 *
 *   // Tambah jadwal
 *   await dbJadwal.insert({ tanggal: "2025-01-10", ... });
 */

import { supabase } from "./supabase";
import type { Khatib, Jadwal, TransaksiAdmin } from "./adminTypes";

// ─── Konversi row DB → tipe TS ───────────────────────────────────────────────

function rowToKhatib(r: Record<string, unknown>): Khatib {
  return {
    id:           r.id          as string,
    nama:         r.nama        as string,
    gelar:        r.gelar       as string,
    spesialisasi: r.spesialisasi as string,
    noHp:         r.no_hp       as string,
    email:        r.email       as string,
    aktif:        r.aktif       as boolean,
  };
}

function rowToJadwal(r: Record<string, unknown>): Jadwal {
  return {
    id:            r.id             as string,
    tanggal:       r.tanggal        as string,
    jenisKegiatan: r.jenis_kegiatan as string,
    khatibId:      (r.khatib_id     as string) ?? "",
    khatibNama:    (r.khatib        as Record<string, string>)?.nama ?? "",
    topik:         r.topik          as string,
    waktu:         r.waktu          as string,
    keterangan:    r.keterangan     as string,
  };
}

function rowToTransaksi(r: Record<string, unknown>): TransaksiAdmin {
  return {
    id:         r.id          as string,
    tanggal:    r.tanggal     as string,
    keterangan: r.keterangan  as string,
    kategori:   r.kategori    as string,
    jenis:      r.jenis       as "masuk" | "keluar",
    jumlah:     r.jumlah      as number,
  };
}

// ─── KHATIB ──────────────────────────────────────────────────────────────────

export const dbKhatib = {
  /** Ambil semua khatib, diurutkan berdasarkan nama */
  async getAll(): Promise<Khatib[]> {
    const { data, error } = await supabase
      .from("khatib")
      .select("*")
      .order("nama");
    if (error) throw error;
    return (data ?? []).map(rowToKhatib);
  },

  /** Ambil hanya khatib yang aktif */
  async getAktif(): Promise<Khatib[]> {
    const { data, error } = await supabase
      .from("khatib")
      .select("*")
      .eq("aktif", true)
      .order("nama");
    if (error) throw error;
    return (data ?? []).map(rowToKhatib);
  },

  /** Tambah khatib baru */
  async insert(khatib: Omit<Khatib, "id">): Promise<Khatib> {
    const { data, error } = await supabase
      .from("khatib")
      .insert({
        nama:         khatib.nama,
        gelar:        khatib.gelar,
        spesialisasi: khatib.spesialisasi,
        no_hp:        khatib.noHp,
        email:        khatib.email,
        aktif:        khatib.aktif,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToKhatib(data);
  },

  /** Update khatib berdasarkan id */
  async update(id: string, khatib: Partial<Omit<Khatib, "id">>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (khatib.nama         !== undefined) payload.nama         = khatib.nama;
    if (khatib.gelar        !== undefined) payload.gelar        = khatib.gelar;
    if (khatib.spesialisasi !== undefined) payload.spesialisasi = khatib.spesialisasi;
    if (khatib.noHp         !== undefined) payload.no_hp        = khatib.noHp;
    if (khatib.email        !== undefined) payload.email        = khatib.email;
    if (khatib.aktif        !== undefined) payload.aktif        = khatib.aktif;

    const { error } = await supabase.from("khatib").update(payload).eq("id", id);
    if (error) throw error;
  },

  /** Toggle status aktif khatib */
  async toggleAktif(id: string, aktif: boolean): Promise<void> {
    const { error } = await supabase.from("khatib").update({ aktif }).eq("id", id);
    if (error) throw error;
  },

  /** Hapus khatib */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("khatib").delete().eq("id", id);
    if (error) throw error;
  },
};

// ─── JADWAL ──────────────────────────────────────────────────────────────────

export const dbJadwal = {
  /**
   * Ambil semua jadwal, join dengan nama khatib.
   * Hasil: Jadwal[] sudah terisi khatibNama.
   */
  async getAll(): Promise<Jadwal[]> {
    const { data, error } = await supabase
      .from("jadwal")
      .select("*, khatib(nama)")
      .order("tanggal");
    if (error) throw error;
    return (data ?? []).map(rowToJadwal);
  },

  /** Ambil jadwal mendatang (mulai hari ini), max N item */
  async getMendatang(limit = 6): Promise<Jadwal[]> {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("jadwal")
      .select("*, khatib(nama)")
      .gte("tanggal", today)
      .order("tanggal")
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(rowToJadwal);
  },

  /** Tambah jadwal baru */
  async insert(jadwal: Omit<Jadwal, "id" | "khatibNama">): Promise<Jadwal> {
    const { data, error } = await supabase
      .from("jadwal")
      .insert({
        tanggal:        jadwal.tanggal,
        jenis_kegiatan: jadwal.jenisKegiatan,
        khatib_id:      jadwal.khatibId || null,
        topik:          jadwal.topik,
        waktu:          jadwal.waktu,
        keterangan:     jadwal.keterangan,
      })
      .select("*, khatib(nama)")
      .single();
    if (error) throw error;
    return rowToJadwal(data);
  },

  /** Update jadwal berdasarkan id */
  async update(id: string, jadwal: Partial<Omit<Jadwal, "id" | "khatibNama">>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (jadwal.tanggal        !== undefined) payload.tanggal        = jadwal.tanggal;
    if (jadwal.jenisKegiatan  !== undefined) payload.jenis_kegiatan = jadwal.jenisKegiatan;
    if (jadwal.khatibId       !== undefined) payload.khatib_id      = jadwal.khatibId || null;
    if (jadwal.topik          !== undefined) payload.topik          = jadwal.topik;
    if (jadwal.waktu          !== undefined) payload.waktu          = jadwal.waktu;
    if (jadwal.keterangan     !== undefined) payload.keterangan     = jadwal.keterangan;

    const { error } = await supabase.from("jadwal").update(payload).eq("id", id);
    if (error) throw error;
  },

  /** Hapus jadwal */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("jadwal").delete().eq("id", id);
    if (error) throw error;
  },
};

// ─── TRANSAKSI ───────────────────────────────────────────────────────────────

export const dbTransaksi = {
  /** Ambil semua transaksi, diurutkan tanggal terbaru dulu */
  async getAll(): Promise<TransaksiAdmin[]> {
    const { data, error } = await supabase
      .from("transaksi")
      .select("*")
      .order("tanggal", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToTransaksi);
  },

  /** Tambah transaksi baru */
  async insert(tx: Omit<TransaksiAdmin, "id">): Promise<TransaksiAdmin> {
    const { data, error } = await supabase
      .from("transaksi")
      .insert({
        tanggal:    tx.tanggal,
        keterangan: tx.keterangan,
        kategori:   tx.kategori,
        jenis:      tx.jenis,
        jumlah:     tx.jumlah,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToTransaksi(data);
  },

  /** Update transaksi berdasarkan id */
  async update(id: string, tx: Partial<Omit<TransaksiAdmin, "id">>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (tx.tanggal    !== undefined) payload.tanggal    = tx.tanggal;
    if (tx.keterangan !== undefined) payload.keterangan = tx.keterangan;
    if (tx.kategori   !== undefined) payload.kategori   = tx.kategori;
    if (tx.jenis      !== undefined) payload.jenis      = tx.jenis;
    if (tx.jumlah     !== undefined) payload.jumlah     = tx.jumlah;

    const { error } = await supabase.from("transaksi").update(payload).eq("id", id);
    if (error) throw error;
  },

  /** Hapus transaksi */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("transaksi").delete().eq("id", id);
    if (error) throw error;
  },

  /** Hitung ringkasan: total masuk, keluar, saldo */
  async getSummary(): Promise<{ masuk: number; keluar: number; saldo: number }> {
    const { data, error } = await supabase
      .from("transaksi")
      .select("jenis, jumlah");
    if (error) throw error;

    let masuk = 0;
    let keluar = 0;
    for (const row of data ?? []) {
      if (row.jenis === "masuk") masuk += row.jumlah;
      else keluar += row.jumlah;
    }
    return { masuk, keluar, saldo: masuk - keluar };
  },
};
