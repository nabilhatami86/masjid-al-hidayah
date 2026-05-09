import { MONTHS_ID, MONTHS_FULL } from "./constants";
import type { Transaksi, MonthlyEntry, PieEntry, Summary } from "./types";

// re-export dari @/lib/format agar import lama tetap bekerja
export { rupiah, rupiahShort } from "@/lib/format";

export function computeSummary(list: Transaksi[]): Summary {
  let masuk = 0, keluar = 0;
  for (const t of list) {
    if (t.jenis === "masuk") masuk += t.jumlah;
    else keluar += t.jumlah;
  }
  return { masuk, keluar, saldo: masuk - keluar };
}

export function computeMonthlyChart(list: Transaksi[]): MonthlyEntry[] {
  const map: Record<number, { masuk: number; keluar: number }> = {};
  for (let m = 1; m <= 12; m++) map[m] = { masuk: 0, keluar: 0 };
  for (const t of list) {
    const m = parseInt(t.tanggal.split("-")[1]);
    if (m >= 1 && m <= 12) map[m][t.jenis] += t.jumlah;
  }
  return Object.entries(map).map(([m, v]) => ({
    bulan: MONTHS_ID[parseInt(m) - 1],
    Pemasukan: v.masuk,
    Pengeluaran: v.keluar,
  }));
}

export function computePieKeluar(list: Transaksi[]): PieEntry[] {
  const map: Record<string, number> = {};
  for (const t of list) {
    if (t.jenis === "keluar") map[t.kategori] = (map[t.kategori] ?? 0) + t.jumlah;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function computePieMasuk(list: Transaksi[]): PieEntry[] {
  const map: Record<string, number> = {};
  for (const t of list) {
    if (t.jenis === "masuk") map[t.kategori] = (map[t.kategori] ?? 0) + t.jumlah;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function computeDateRange(list: Transaksi[]): string {
  if (list.length === 0) return "";
  const sorted = [...list].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const fmt = (d: string) => {
    const dt = new Date(d);
    return `${MONTHS_FULL[dt.getMonth()]} ${dt.getFullYear()}`;
  };
  const first = fmt(sorted[0].tanggal);
  const last  = fmt(sorted[sorted.length - 1].tanggal);
  return first === last ? first : `${first} – ${last}`;
}

export function computeCumulativeSaldo(monthly: MonthlyEntry[]) {
  return monthly.reduce<{ bulan: string; Saldo: number }[]>((acc, cur, i) => {
    const prev = acc[i - 1]?.Saldo ?? 0;
    acc.push({ bulan: cur.bulan, Saldo: prev + cur.Pemasukan - cur.Pengeluaran });
    return acc;
  }, []);
}
