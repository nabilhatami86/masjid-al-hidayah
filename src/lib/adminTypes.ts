// ─── AUTH ────────────────────────────────────────────────────────────────────
export const ADMIN_TOKEN    = "masjid-admin-2024";
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin123";

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface Khatib {
  id: string;
  nama: string;
  gelar: string;
  spesialisasi: string;
  noHp: string;
  email: string;
  aktif: boolean;
  fotoUrl?: string | null;   // URL foto dari Supabase Storage (opsional)
}

export interface Jadwal {
  id: string;
  tanggal: string;       // "YYYY-MM-DD"
  jenisKegiatan: string;
  khatibId: string;
  khatibNama: string;
  topik: string;
  waktu: string;         // "HH:MM"
  keterangan: string;
}

export interface TransaksiAdmin {
  id: string;
  tanggal: string;
  keterangan: string;
  kategori: string;
  jenis: "masuk" | "keluar";
  jumlah: number;
}

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
export const DEFAULT_KHATIB: Khatib[] = [
  { id: "k1", nama: "Dr. Adi Hidayat",         gelar: "Lc., M.A.", spesialisasi: "Tafsir & Hadist",      noHp: "081234567890", email: "adi@example.com",    aktif: true  },
  { id: "k2", nama: "Ustadz Khalid Basalamah", gelar: "M.A.",      spesialisasi: "Fiqih & Akidah",       noHp: "081234567891", email: "khalid@example.com", aktif: true  },
  { id: "k3", nama: "Ustadz Hanan Attaki",     gelar: "Lc.",       spesialisasi: "Dakwah & Motivasi",    noHp: "081234567892", email: "hanan@example.com",  aktif: true  },
  { id: "k4", nama: "KH. Ahmad Dahlan",        gelar: "M.Ag.",     spesialisasi: "Fiqih Muamalah",       noHp: "081234567893", email: "dahlan@example.com", aktif: false },
  { id: "k5", nama: "Ustadz Felix Siauw",      gelar: "",          spesialisasi: "Dakwah Kontemporer",   noHp: "081234567894", email: "felix@example.com",  aktif: true  },
];

export const DEFAULT_JADWAL: Jadwal[] = [
  { id: "j1", tanggal: "2024-12-06", jenisKegiatan: "Khutbah Jumat",    khatibId: "k1", khatibNama: "Dr. Adi Hidayat",         topik: "Keutamaan Ilmu dalam Islam",          waktu: "11:30", keterangan: "" },
  { id: "j2", tanggal: "2024-12-07", jenisKegiatan: "Kajian Sabtu",     khatibId: "k2", khatibNama: "Ustadz Khalid Basalamah", topik: "Fiqih Sholat Lengkap",               waktu: "08:00", keterangan: "Bawa kitab Fiqhul Islam" },
  { id: "j3", tanggal: "2024-12-13", jenisKegiatan: "Khutbah Jumat",    khatibId: "k3", khatibNama: "Ustadz Hanan Attaki",     topik: "Menjaga Hati di Akhir Zaman",        waktu: "11:30", keterangan: "" },
  { id: "j4", tanggal: "2024-12-14", jenisKegiatan: "Tahsin Al-Qur'an", khatibId: "k1", khatibNama: "Dr. Adi Hidayat",         topik: "Makharijul Huruf & Tajwid Dasar",    waktu: "09:00", keterangan: "Untuk semua level" },
  { id: "j5", tanggal: "2024-12-20", jenisKegiatan: "Khutbah Jumat",    khatibId: "k1", khatibNama: "Dr. Adi Hidayat",         topik: "Persiapan Menyambut Tahun Baru",     waktu: "11:30", keterangan: "" },
  { id: "j6", tanggal: "2024-12-21", jenisKegiatan: "TPA Al-Hidayah",   khatibId: "k5", khatibNama: "Ustadz Felix Siauw",      topik: "Hafalan Juz 30 — Sesi 4",           waktu: "16:00", keterangan: "Khusus santri TPA" },
  { id: "j7", tanggal: "2024-12-27", jenisKegiatan: "Khutbah Jumat",    khatibId: "k2", khatibNama: "Ustadz Khalid Basalamah", topik: "Muhasabah & Resolusi Akhir Tahun",  waktu: "11:30", keterangan: "" },
  { id: "j8", tanggal: "2024-12-28", jenisKegiatan: "Kajian Sabtu",     khatibId: "k3", khatibNama: "Ustadz Hanan Attaki",     topik: "Pemuda Islam & Tantangan Modern",   waktu: "08:00", keterangan: "" },
];

export const KATEGORI_MASUK  = ["Infaq Jumat", "Kotak Amal", "Donasi Transfer", "Wakaf", "Zakat"];
export const KATEGORI_KELUAR = ["Listrik & Air", "Kebersihan", "Operasional", "Kajian & Kegiatan", "Pembangunan & Renovasi"];
export const JENIS_KEGIATAN  = ["Khutbah Jumat", "Kajian Sabtu", "Tahsin Al-Qur'an", "Tahfidz", "TPA Al-Hidayah", "Maulid & Kegiatan Khusus"];

// ─── LOCALSTORAGE HELPERS ────────────────────────────────────────────────────
export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
