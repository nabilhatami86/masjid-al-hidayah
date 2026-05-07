import {
  Building2, BookOpen, GraduationCap, Droplets,
  Wifi, Car, MapPin, Clock, Phone, Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { ApiTimings } from "./types";

// ID kota Surabaya — sumber: https://api.myquran.com/v2/sholat/kota/semua
export const KOTA_ID = "1638";

export const MONTHS_ID = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

export const DAYS_ID = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export const FALLBACK_TIMINGS: ApiTimings = {
  Fajr: "--:--", Dhuhr: "--:--", Asr: "--:--", Maghrib: "--:--", Isha: "--:--",
};

export const BADGE_MAP: Record<string, string> = {
  amber:   "bg-amber-100 text-amber-700",
  blue:    "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

export const PROGRAMS_STATIC = [
  { key: "tpa-al-hidayah",  title: "TPA Al-Hidayah",   desc: "Pendidikan Al-Qur'an untuk anak usia 5–15 tahun dengan metode terbaik.", objectPos: "object-top"    },
  { key: "kajian-sabtu",    title: "Kajian Sabtu",     desc: "Kajian rutin setiap Sabtu pagi dengan ustadz pilihan & topik aktual.",   objectPos: "object-center" },
  { key: "wakaf-produktif", title: "Wakaf Produktif",  desc: "Program wakaf untuk kemandirian ekonomi umat & pembangunan masjid.",     objectPos: "object-bottom" },
  { key: "tahsin-alquran",  title: "Tahsin Al-Qur'an", desc: "Perbaikan bacaan Al-Qur'an sesuai kaidah tajwid untuk semua usia.",      objectPos: "object-right"  },
];

export const FASILITAS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Building2,    title: "Ruang Shalat",   desc: "Kapasitas 500 jamaah, ber-AC, bersih & nyaman"         },
  { icon: BookOpen,     title: "Perpustakaan",   desc: "Koleksi 1.200+ buku & kitab Islam"                     },
  { icon: GraduationCap,title: "Kelas TPA",      desc: "Ruang kelas ber-AC untuk santri TPA"                   },
  { icon: Droplets,     title: "Tempat Wudhu",   desc: "Terpisah pria & wanita, selalu bersih"                 },
  { icon: Wifi,         title: "WiFi Gratis",    desc: "Internet cepat untuk jamaah selama di masjid"          },
  { icon: Car,          title: "Area Parkir",    desc: "Parkir luas, aman & gratis untuk jamaah"               },
];

export const PENGURUS = [
  { jabatan: "Ketua DKM",   nama: "H. Suryadi, S.E.",      desc: "Mengkoordinasikan seluruh kegiatan masjid" },
  { jabatan: "Imam Masjid", nama: "Ustadz Ahmad Fauzi",    desc: "Imam shalat 5 waktu & pembimbing rohani"   },
  { jabatan: "Sekretaris",  nama: "Ir. Budi Santoso, M.T.",desc: "Administrasi & hubungan masyarakat"        },
];

export const KONTAK_LIST: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: MapPin,     label: "Alamat",          value: "Jl. Ketintang Baru XV No.20\nKec. Gayungan, Surabaya 60231\nJawa Timur, Indonesia" },
  { icon: Clock,      label: "Jam Operasional", value: "Senin – Minggu: 04:00 – 21:00 WIB\nShalat 5 waktu berjamaah setiap hari"          },
  { icon: Phone,      label: "Kontak",          value: "WhatsApp: 0812-3456-7890\nEmail: info@masjidalhidayah.id"                         },
  { icon: Smartphone, label: "Media Sosial",    value: "Instagram: @masjidalhidayah.id\nYouTube: Masjid Al-Hidayah Surabaya"              },
];

export const MISI_LIST = [
  "Menyelenggarakan ibadah yang tertib dan berkualitas",
  "Mengembangkan pendidikan Islam dari usia dini",
  "Memberdayakan jamaah secara ekonomi & sosial",
  "Menjaga transparansi & akuntabilitas keuangan",
];
