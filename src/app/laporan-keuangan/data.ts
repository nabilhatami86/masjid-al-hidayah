export type Kategori =
  | "Infaq Jumat"
  | "Kotak Amal"
  | "Donasi Transfer"
  | "Wakaf"
  | "Zakat"
  | "Listrik & Air"
  | "Kebersihan"
  | "Operasional"
  | "Kajian & Kegiatan"
  | "Pembangunan & Renovasi";

export interface Transaksi {
  id: number;
  tanggal: string; // "YYYY-MM-DD"
  keterangan: string;
  kategori: Kategori;
  jenis: "masuk" | "keluar";
  jumlah: number;
}

// ─── DATA TRANSAKSI (Januari – Desember 2024) ─────────────────────────────────
export const transaksiList: Transaksi[] = [
  // ── Januari ──
  { id: 1,  tanggal: "2024-01-05", keterangan: "Infaq Jumat (5 Jan)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 1_850_000 },
  { id: 2,  tanggal: "2024-01-07", keterangan: "Kotak Amal Minggu 1", kategori: "Kotak Amal", jenis: "masuk", jumlah: 620_000 },
  { id: 3,  tanggal: "2024-01-12", keterangan: "Infaq Jumat (12 Jan)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 1_920_000 },
  { id: 4,  tanggal: "2024-01-14", keterangan: "Kotak Amal Minggu 2", kategori: "Kotak Amal", jenis: "masuk", jumlah: 590_000 },
  { id: 5,  tanggal: "2024-01-15", keterangan: "Tagihan Listrik & Air Jan", kategori: "Listrik & Air", jenis: "keluar", jumlah: 870_000 },
  { id: 6,  tanggal: "2024-01-19", keterangan: "Infaq Jumat (19 Jan)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 1_780_000 },
  { id: 7,  tanggal: "2024-01-20", keterangan: "Honor Kebersihan Jan", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 8,  tanggal: "2024-01-21", keterangan: "Kotak Amal Minggu 3", kategori: "Kotak Amal", jenis: "masuk", jumlah: 610_000 },
  { id: 9,  tanggal: "2024-01-25", keterangan: "Donasi Transfer — Bp. Hasan", kategori: "Donasi Transfer", jenis: "masuk", jumlah: 2_000_000 },
  { id: 10, tanggal: "2024-01-26", keterangan: "Infaq Jumat (26 Jan)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 1_900_000 },
  { id: 11, tanggal: "2024-01-28", keterangan: "Kotak Amal Minggu 4", kategori: "Kotak Amal", jenis: "masuk", jumlah: 540_000 },
  { id: 12, tanggal: "2024-01-30", keterangan: "ATK & Operasional Jan", kategori: "Operasional", jenis: "keluar", jumlah: 230_000 },

  // ── Februari ──
  { id: 13, tanggal: "2024-02-02", keterangan: "Infaq Jumat (2 Feb)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 1_950_000 },
  { id: 14, tanggal: "2024-02-04", keterangan: "Kotak Amal Minggu 1", kategori: "Kotak Amal", jenis: "masuk", jumlah: 680_000 },
  { id: 15, tanggal: "2024-02-05", keterangan: "Donasi Wakaf Tanah — Bp. Ridwan", kategori: "Wakaf", jenis: "masuk", jumlah: 5_000_000 },
  { id: 16, tanggal: "2024-02-09", keterangan: "Infaq Jumat (9 Feb)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_010_000 },
  { id: 17, tanggal: "2024-02-15", keterangan: "Tagihan Listrik & Air Feb", kategori: "Listrik & Air", jenis: "keluar", jumlah: 920_000 },
  { id: 18, tanggal: "2024-02-16", keterangan: "Infaq Jumat (16 Feb)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 1_880_000 },
  { id: 19, tanggal: "2024-02-20", keterangan: "Honor Kebersihan Feb", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 20, tanggal: "2024-02-23", keterangan: "Infaq Jumat (23 Feb)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 1_970_000 },
  { id: 21, tanggal: "2024-02-25", keterangan: "Kajian Sabtu — konsumsi", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 380_000 },
  { id: 22, tanggal: "2024-02-28", keterangan: "ATK & Operasional Feb", kategori: "Operasional", jenis: "keluar", jumlah: 210_000 },

  // ── Maret ──
  { id: 23, tanggal: "2024-03-01", keterangan: "Infaq Jumat (1 Mar)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_100_000 },
  { id: 24, tanggal: "2024-03-03", keterangan: "Kotak Amal Minggu 1", kategori: "Kotak Amal", jenis: "masuk", jumlah: 720_000 },
  { id: 25, tanggal: "2024-03-08", keterangan: "Infaq Jumat (8 Mar)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_250_000 },
  { id: 26, tanggal: "2024-03-10", keterangan: "Donasi Transfer — Ibu Sari", kategori: "Donasi Transfer", jenis: "masuk", jumlah: 1_500_000 },
  { id: 27, tanggal: "2024-03-15", keterangan: "Tagihan Listrik & Air Mar", kategori: "Listrik & Air", jenis: "keluar", jumlah: 890_000 },
  { id: 28, tanggal: "2024-03-15", keterangan: "Infaq Jumat (15 Mar)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_200_000 },
  { id: 29, tanggal: "2024-03-20", keterangan: "Honor Kebersihan Mar", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 30, tanggal: "2024-03-22", keterangan: "Infaq Jumat (22 Mar)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_900_000 },
  { id: 31, tanggal: "2024-03-25", keterangan: "Perlengkapan Kajian Mar", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 450_000 },
  { id: 32, tanggal: "2024-03-29", keterangan: "Infaq Jumat (29 Mar)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 3_100_000 },
  { id: 33, tanggal: "2024-03-31", keterangan: "ATK & Operasional Mar", kategori: "Operasional", jenis: "keluar", jumlah: 270_000 },

  // ── April ──
  { id: 34, tanggal: "2024-04-05", keterangan: "Infaq Jumat (5 Apr)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 4_500_000 },
  { id: 35, tanggal: "2024-04-07", keterangan: "Kotak Amal Minggu 1", kategori: "Kotak Amal", jenis: "masuk", jumlah: 950_000 },
  { id: 36, tanggal: "2024-04-08", keterangan: "Zakat Fitrah — jamaah", kategori: "Zakat", jenis: "masuk", jumlah: 8_200_000 },
  { id: 37, tanggal: "2024-04-10", keterangan: "Penyaluran Zakat Fitrah", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 8_200_000 },
  { id: 38, tanggal: "2024-04-12", keterangan: "Infaq Jumat (12 Apr)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 5_200_000 },
  { id: 39, tanggal: "2024-04-15", keterangan: "Tagihan Listrik & Air Apr", kategori: "Listrik & Air", jenis: "keluar", jumlah: 930_000 },
  { id: 40, tanggal: "2024-04-19", keterangan: "Infaq Idul Fitri", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 6_800_000 },
  { id: 41, tanggal: "2024-04-20", keterangan: "Honor Kebersihan Apr", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 42, tanggal: "2024-04-20", keterangan: "Konsumsi Kajian Idul Fitri", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 1_200_000 },
  { id: 43, tanggal: "2024-04-26", keterangan: "Infaq Jumat (26 Apr)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 3_100_000 },

  // ── Mei ──
  { id: 44, tanggal: "2024-05-03", keterangan: "Infaq Jumat (3 Mei)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_200_000 },
  { id: 45, tanggal: "2024-05-10", keterangan: "Infaq Jumat (10 Mei)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_050_000 },
  { id: 46, tanggal: "2024-05-15", keterangan: "Tagihan Listrik & Air Mei", kategori: "Listrik & Air", jenis: "keluar", jumlah: 870_000 },
  { id: 47, tanggal: "2024-05-15", keterangan: "Donasi Transfer — Bp. Fauzi", kategori: "Donasi Transfer", jenis: "masuk", jumlah: 3_000_000 },
  { id: 48, tanggal: "2024-05-17", keterangan: "Infaq Jumat (17 Mei)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_100_000 },
  { id: 49, tanggal: "2024-05-20", keterangan: "Honor Kebersihan Mei", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 50, tanggal: "2024-05-20", keterangan: "Kotak Amal Minggu 3", kategori: "Kotak Amal", jenis: "masuk", jumlah: 710_000 },
  { id: 51, tanggal: "2024-05-24", keterangan: "Infaq Jumat (24 Mei)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_000_000 },
  { id: 52, tanggal: "2024-05-31", keterangan: "ATK & Operasional Mei", kategori: "Operasional", jenis: "keluar", jumlah: 250_000 },

  // ── Juni ──
  { id: 53, tanggal: "2024-06-07", keterangan: "Infaq Jumat (7 Jun)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_150_000 },
  { id: 54, tanggal: "2024-06-09", keterangan: "Donasi Renovasi Mihrab", kategori: "Donasi Transfer", jenis: "masuk", jumlah: 4_000_000 },
  { id: 55, tanggal: "2024-06-14", keterangan: "Infaq Jumat (14 Jun)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_080_000 },
  { id: 56, tanggal: "2024-06-15", keterangan: "Tagihan Listrik & Air Jun", kategori: "Listrik & Air", jenis: "keluar", jumlah: 910_000 },
  { id: 57, tanggal: "2024-06-17", keterangan: "Biaya Renovasi Mihrab (Fase 1)", kategori: "Pembangunan & Renovasi", jenis: "keluar", jumlah: 3_500_000 },
  { id: 58, tanggal: "2024-06-20", keterangan: "Honor Kebersihan Jun", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 59, tanggal: "2024-06-21", keterangan: "Infaq Jumat (21 Jun)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_200_000 },
  { id: 60, tanggal: "2024-06-28", keterangan: "Infaq Jumat (28 Jun)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_120_000 },

  // ── Juli ──
  { id: 61, tanggal: "2024-07-05", keterangan: "Infaq Jumat (5 Jul)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_300_000 },
  { id: 62, tanggal: "2024-07-07", keterangan: "Donasi Wakaf — Bp. Wahyu", kategori: "Wakaf", jenis: "masuk", jumlah: 7_500_000 },
  { id: 63, tanggal: "2024-07-12", keterangan: "Infaq Jumat (12 Jul)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_180_000 },
  { id: 64, tanggal: "2024-07-15", keterangan: "Tagihan Listrik & Air Jul", kategori: "Listrik & Air", jenis: "keluar", jumlah: 940_000 },
  { id: 65, tanggal: "2024-07-15", keterangan: "Biaya Renovasi Mihrab (Fase 2)", kategori: "Pembangunan & Renovasi", jenis: "keluar", jumlah: 4_200_000 },
  { id: 66, tanggal: "2024-07-19", keterangan: "Infaq Jumat (19 Jul)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_250_000 },
  { id: 67, tanggal: "2024-07-20", keterangan: "Honor Kebersihan Jul", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 68, tanggal: "2024-07-26", keterangan: "Infaq Jumat (26 Jul)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_100_000 },
  { id: 69, tanggal: "2024-07-28", keterangan: "Kajian Tahsin — alat tulis", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 320_000 },

  // ── Agustus ──
  { id: 70, tanggal: "2024-08-02", keterangan: "Infaq Jumat (2 Agt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_500_000 },
  { id: 71, tanggal: "2024-08-09", keterangan: "Infaq Jumat (9 Agt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_600_000 },
  { id: 72, tanggal: "2024-08-15", keterangan: "Tagihan Listrik & Air Agt", kategori: "Listrik & Air", jenis: "keluar", jumlah: 960_000 },
  { id: 73, tanggal: "2024-08-16", keterangan: "Infaq Jumat (16 Agt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 3_200_000 },
  { id: 74, tanggal: "2024-08-17", keterangan: "Kegiatan 17 Agustus", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 850_000 },
  { id: 75, tanggal: "2024-08-20", keterangan: "Honor Kebersihan Agt", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 76, tanggal: "2024-08-23", keterangan: "Infaq Jumat (23 Agt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_400_000 },
  { id: 77, tanggal: "2024-08-25", keterangan: "Donasi Transfer — Ibu Nurul", kategori: "Donasi Transfer", jenis: "masuk", jumlah: 2_500_000 },
  { id: 78, tanggal: "2024-08-30", keterangan: "Infaq Jumat (30 Agt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_350_000 },

  // ── September ──
  { id: 79, tanggal: "2024-09-06", keterangan: "Infaq Jumat (6 Sep)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_100_000 },
  { id: 80, tanggal: "2024-09-13", keterangan: "Infaq Jumat (13 Sep)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_080_000 },
  { id: 81, tanggal: "2024-09-15", keterangan: "Tagihan Listrik & Air Sep", kategori: "Listrik & Air", jenis: "keluar", jumlah: 900_000 },
  { id: 82, tanggal: "2024-09-15", keterangan: "Donasi Wakaf Buku", kategori: "Wakaf", jenis: "masuk", jumlah: 1_200_000 },
  { id: 83, tanggal: "2024-09-20", keterangan: "Infaq Jumat (20 Sep)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_200_000 },
  { id: 84, tanggal: "2024-09-20", keterangan: "Honor Kebersihan Sep", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 85, tanggal: "2024-09-22", keterangan: "Pengecatan Selasar Masjid", kategori: "Pembangunan & Renovasi", jenis: "keluar", jumlah: 2_100_000 },
  { id: 86, tanggal: "2024-09-27", keterangan: "Infaq Jumat (27 Sep)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_150_000 },

  // ── Oktober ──
  { id: 87, tanggal: "2024-10-04", keterangan: "Infaq Jumat (4 Okt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_200_000 },
  { id: 88, tanggal: "2024-10-06", keterangan: "Kotak Amal Minggu 1", kategori: "Kotak Amal", jenis: "masuk", jumlah: 680_000 },
  { id: 89, tanggal: "2024-10-11", keterangan: "Infaq Jumat (11 Okt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_150_000 },
  { id: 90, tanggal: "2024-10-15", keterangan: "Tagihan Listrik & Air Okt", kategori: "Listrik & Air", jenis: "keluar", jumlah: 880_000 },
  { id: 91, tanggal: "2024-10-18", keterangan: "Infaq Jumat (18 Okt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_180_000 },
  { id: 92, tanggal: "2024-10-20", keterangan: "Honor Kebersihan Okt", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 93, tanggal: "2024-10-20", keterangan: "Donasi Transfer — Bp. Eko", kategori: "Donasi Transfer", jenis: "masuk", jumlah: 1_000_000 },
  { id: 94, tanggal: "2024-10-25", keterangan: "Infaq Jumat (25 Okt)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_220_000 },
  { id: 95, tanggal: "2024-10-27", keterangan: "Kajian Tahfidz — konsumsi", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 420_000 },

  // ── November ──
  { id: 96,  tanggal: "2024-11-01", keterangan: "Infaq Jumat (1 Nov)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_300_000 },
  { id: 97,  tanggal: "2024-11-08", keterangan: "Infaq Jumat (8 Nov)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_250_000 },
  { id: 98,  tanggal: "2024-11-10", keterangan: "Donasi Wakaf — Ibu Maryam", kategori: "Wakaf", jenis: "masuk", jumlah: 3_000_000 },
  { id: 99,  tanggal: "2024-11-15", keterangan: "Tagihan Listrik & Air Nov", kategori: "Listrik & Air", jenis: "keluar", jumlah: 920_000 },
  { id: 100, tanggal: "2024-11-15", keterangan: "Infaq Jumat (15 Nov)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_180_000 },
  { id: 101, tanggal: "2024-11-20", keterangan: "Honor Kebersihan Nov", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 102, tanggal: "2024-11-22", keterangan: "Infaq Jumat (22 Nov)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_200_000 },
  { id: 103, tanggal: "2024-11-24", keterangan: "Perbaikan Sound System", kategori: "Pembangunan & Renovasi", jenis: "keluar", jumlah: 1_800_000 },
  { id: 104, tanggal: "2024-11-29", keterangan: "Infaq Jumat (29 Nov)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_150_000 },
  { id: 105, tanggal: "2024-11-30", keterangan: "ATK & Operasional Nov", kategori: "Operasional", jenis: "keluar", jumlah: 240_000 },

  // ── Desember ──
  { id: 106, tanggal: "2024-12-06", keterangan: "Infaq Jumat (6 Des)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_400_000 },
  { id: 107, tanggal: "2024-12-08", keterangan: "Donasi Transfer — Jamaah Umum", kategori: "Donasi Transfer", jenis: "masuk", jumlah: 2_000_000 },
  { id: 108, tanggal: "2024-12-13", keterangan: "Infaq Jumat (13 Des)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_350_000 },
  { id: 109, tanggal: "2024-12-15", keterangan: "Tagihan Listrik & Air Des", kategori: "Listrik & Air", jenis: "keluar", jumlah: 960_000 },
  { id: 110, tanggal: "2024-12-20", keterangan: "Infaq Jumat (20 Des)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_500_000 },
  { id: 111, tanggal: "2024-12-20", keterangan: "Honor Kebersihan Des", kategori: "Kebersihan", jenis: "keluar", jumlah: 450_000 },
  { id: 112, tanggal: "2024-12-22", keterangan: "Maulid Nabi — konsumsi & dekorasi", kategori: "Kajian & Kegiatan", jenis: "keluar", jumlah: 1_500_000 },
  { id: 113, tanggal: "2024-12-25", keterangan: "Donasi Wakaf Akhir Tahun", kategori: "Wakaf", jenis: "masuk", jumlah: 4_000_000 },
  { id: 114, tanggal: "2024-12-27", keterangan: "Infaq Jumat (27 Des)", kategori: "Infaq Jumat", jenis: "masuk", jumlah: 2_450_000 },
  { id: 115, tanggal: "2024-12-31", keterangan: "ATK & Operasional Des", kategori: "Operasional", jenis: "keluar", jumlah: 280_000 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const MONTHS_ID = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];

export function getMonthlyChart() {
  const map: Record<number, { masuk: number; keluar: number }> = {};
  for (let m = 1; m <= 12; m++) map[m] = { masuk: 0, keluar: 0 };
  for (const t of transaksiList) {
    const m = parseInt(t.tanggal.split("-")[1]);
    map[m][t.jenis] += t.jumlah;
  }
  return Object.entries(map).map(([m, v]) => ({
    bulan: MONTHS_ID[parseInt(m) - 1],
    Pemasukan: v.masuk,
    Pengeluaran: v.keluar,
  }));
}

export function getPieData() {
  const map: Record<string, number> = {};
  for (const t of transaksiList) {
    if (t.jenis === "keluar") {
      map[t.kategori] = (map[t.kategori] ?? 0) + t.jumlah;
    }
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getPieMasukData() {
  const map: Record<string, number> = {};
  for (const t of transaksiList) {
    if (t.jenis === "masuk") {
      map[t.kategori] = (map[t.kategori] ?? 0) + t.jumlah;
    }
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getSummary() {
  let masuk = 0;
  let keluar = 0;
  for (const t of transaksiList) {
    if (t.jenis === "masuk") masuk += t.jumlah;
    else keluar += t.jumlah;
  }
  return { masuk, keluar, saldo: masuk - keluar };
}
