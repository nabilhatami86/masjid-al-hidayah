import BeritaSection from "./BeritaSection";
import CopyNorekCard from "./CopyNorekCard";
import Footer from "@/components/Footer/page";
import Sidebar from "@/components/Sidebar/page";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_KHATIB, type Khatib } from "@/lib/adminTypes";
import { getJadwalMendatang } from "@/lib/controllers/jadwalController";
import { getKhatibById } from "@/lib/controllers/khatibController";
import { getAllProgramImages } from "@/lib/controllers/programController";
import {
  MapPin,
  User,
  Settings,
  Building2,
  BookOpen,
  GraduationCap,
  Droplets,
  Wifi,
  Car,
  Star,
  Clock,
  Phone,
  Smartphone,
  Check,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const LAT = -7.3186;
const LON = 112.7284;
const METHOD = 20;

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface ApiTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}
type PrayerKey = "fajr" | "dzuhur" | "ashar" | "maghrib" | "isya";
interface PrayerRow {
  date: string;
  fajr: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  isActive: boolean;
  activeCol: PrayerKey | null;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function cleanTime(t: string) {
  return t.replace(/\s*\(.*?\)/, "").trim();
}

function getWIBNow(): Date {
  const now = new Date();
  return new Date(
    now.getTime() + now.getTimezoneOffset() * 60_000 + 7 * 3_600_000,
  );
}

function toApiDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAYS_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function toDisplayDate(d: Date) {
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function getNextFriday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 5 ? 0 : (5 - day + 7) % 7));
  return d;
}

function getNextPrayer(wibNow: Date, t: ApiTimings): PrayerKey {
  const nowMin = wibNow.getHours() * 60 + wibNow.getMinutes();
  const schedule: { key: PrayerKey; time: string }[] = [
    { key: "fajr", time: t.Fajr },
    { key: "dzuhur", time: t.Dhuhr },
    { key: "ashar", time: t.Asr },
    { key: "maghrib", time: t.Maghrib },
    { key: "isya", time: t.Isha },
  ];
  for (const s of schedule) {
    const [h, m] = s.time.split(":").map(Number);
    if (h * 60 + m > nowMin) return s.key;
  }
  return "isya";
}

// ─── UPCOMING SCHEDULE (server-side computed) ────────────────────────────────
interface UpcomingEvent {
  id: string;
  tanggal: Date;
  jenis: string;
  badge: string;
  topik: string;
  khatib: string;
  waktu: string;
}

function getUpcomingEvents(from: Date): UpcomingEvent[] {
  const activeKhatib = DEFAULT_KHATIB.filter((k) => k.aktif);
  let kidx = 0;
  const events: UpcomingEvent[] = [];

  const topicsFriday = [
    "Keutamaan Sholat Berjamaah",
    "Akhlak Muslim dalam Kehidupan Sehari-hari",
    "Mengenal 99 Asmaul Husna",
    "Birrul Walidain — Berbakti kepada Orang Tua",
  ];
  const topicsSabtu = [
    "Fiqih Sholat Lengkap",
    "Tafsir Juz Amma — Surah Pendek",
  ];

  const daysToFriday = (5 - from.getDay() + 7) % 7 || 7;

  for (let w = 0; w < 4; w++) {
    const friday = new Date(from);
    friday.setDate(from.getDate() + daysToFriday + w * 7);
    events.push({
      id: `f${w}`,
      tanggal: friday,
      jenis: "Khutbah Jumat",
      badge: "amber",
      topik: topicsFriday[w % topicsFriday.length],
      khatib: activeKhatib[kidx++ % activeKhatib.length].nama,
      waktu: "11:30",
    });
    if (w < 2) {
      const saturday = new Date(friday);
      saturday.setDate(friday.getDate() + 1);
      events.push({
        id: `s${w}`,
        tanggal: saturday,
        jenis: w === 0 ? "Kajian Sabtu" : "Tahsin Al-Qur'an",
        badge: w === 0 ? "blue" : "emerald",
        topik: topicsSabtu[w],
        khatib: activeKhatib[kidx++ % activeKhatib.length].nama,
        waktu: w === 0 ? "08:00" : "09:00",
      });
    }
  }
  return events
    .sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime())
    .slice(0, 6);
}

// ─── API FETCH ───────────────────────────────────────────────────────────────
async function fetchTimings(dateStr: string): Promise<ApiTimings | null> {
  try {
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${LAT}&longitude=${LON}&method=${METHOD}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const t = json?.data?.timings;
    if (!t) return null;
    return {
      Fajr: cleanTime(t.Fajr),
      Dhuhr: cleanTime(t.Dhuhr),
      Asr: cleanTime(t.Asr),
      Maghrib: cleanTime(t.Maghrib),
      Isha: cleanTime(t.Isha),
    };
  } catch {
    return null;
  }
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const prayerColumns: { label: string; key: PrayerKey }[] = [
  { label: "FAJR", key: "fajr" },
  { label: "DZUHUR", key: "dzuhur" },
  { label: "ASHAR", key: "ashar" },
  { label: "MAGHRIB", key: "maghrib" },
  { label: "ISYA", key: "isya" },
];
const FALLBACK: ApiTimings = {
  Fajr: "--:--",
  Dhuhr: "--:--",
  Asr: "--:--",
  Maghrib: "--:--",
  Isha: "--:--",
};

const BADGE_MAP: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

const PROGRAMS_STATIC = [
  { key: "tpa-al-hidayah",  title: "TPA Al-Hidayah",   desc: "Pendidikan Al-Qur'an untuk anak usia 5–15 tahun dengan metode terbaik.", objectPos: "object-top"    },
  { key: "kajian-sabtu",    title: "Kajian Sabtu",     desc: "Kajian rutin setiap Sabtu pagi dengan ustadz pilihan & topik aktual.",   objectPos: "object-center" },
  { key: "wakaf-produktif", title: "Wakaf Produktif",  desc: "Program wakaf untuk kemandirian ekonomi umat & pembangunan masjid.",     objectPos: "object-bottom" },
  { key: "tahsin-alquran",  title: "Tahsin Al-Qur'an", desc: "Perbaikan bacaan Al-Qur'an sesuai kaidah tajwid untuk semua usia.",      objectPos: "object-right"  },
];

const fasilitas: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Building2,
    title: "Ruang Shalat",
    desc: "Kapasitas 500 jamaah, ber-AC, bersih & nyaman",
  },
  {
    icon: BookOpen,
    title: "Perpustakaan",
    desc: "Koleksi 1.200+ buku & kitab Islam",
  },
  {
    icon: GraduationCap,
    title: "Kelas TPA",
    desc: "Ruang kelas ber-AC untuk santri TPA",
  },
  {
    icon: Droplets,
    title: "Tempat Wudhu",
    desc: "Terpisah pria & wanita, selalu bersih",
  },
  {
    icon: Wifi,
    title: "WiFi Gratis",
    desc: "Internet cepat untuk jamaah selama di masjid",
  },
  {
    icon: Car,
    title: "Area Parkir",
    desc: "Parkir luas, aman & gratis untuk jamaah",
  },
];

const pengurus = [
  {
    jabatan: "Ketua DKM",
    nama: "H. Suryadi, S.E.",
    desc: "Mengkoordinasikan seluruh kegiatan masjid",
  },
  {
    jabatan: "Imam Masjid",
    nama: "Ustadz Ahmad Fauzi",
    desc: "Imam shalat 5 waktu & pembimbing rohani",
  },
  {
    jabatan: "Sekretaris",
    nama: "Ir. Budi Santoso, M.T.",
    desc: "Administrasi & hubungan masyarakat",
  },
];


// ─── PAGE ────────────────────────────────────────────────────────────────────
export default async function HomePages() {
  const wibNow = getWIBNow();
  const wibTomorrow = new Date(wibNow);
  wibTomorrow.setDate(wibTomorrow.getDate() + 1);

  const nextFriday = getNextFriday(wibNow);
  const khutbahLabel = `Khutbah Jumat, ${toDisplayDate(nextFriday)}`;
  const upcomingEvents = getUpcomingEvents(wibNow);

  const [todayT, tomorrowT] = await Promise.all([
    fetchTimings(toApiDate(wibNow)),
    fetchTimings(toApiDate(wibTomorrow)),
  ]);
  const t1 = todayT ?? FALLBACK;
  const t2 = tomorrowT ?? FALLBACK;

  const prayerData: PrayerRow[] = [
    {
      date: toDisplayDate(wibNow),
      fajr: t1.Fajr,
      dzuhur: t1.Dhuhr,
      ashar: t1.Asr,
      maghrib: t1.Maghrib,
      isya: t1.Isha,
      isActive: true,
      activeCol: getNextPrayer(wibNow, t1),
    },
    {
      date: toDisplayDate(wibTomorrow),
      fajr: t2.Fajr,
      dzuhur: t2.Dhuhr,
      ashar: t2.Asr,
      maghrib: t2.Maghrib,
      isya: t2.Isha,
      isActive: false,
      activeCol: null,
    },
  ];

  // ─── KHATIB JUMAT ──────────────────────────────────────────────────────────
  const nextFridayISO = `${nextFriday.getFullYear()}-${String(nextFriday.getMonth() + 1).padStart(2, "0")}-${String(nextFriday.getDate()).padStart(2, "0")}`;
  let fridayKhatib: Khatib | null = null;
  try {
    const jadwals = await getJadwalMendatang(10);
    const fridayJadwal =
      jadwals.find(
        (j) =>
          j.jenisKegiatan === "Khutbah Jumat" && j.tanggal === nextFridayISO,
      ) ??
      jadwals.find((j) => j.jenisKegiatan === "Khutbah Jumat") ??
      null;
    if (fridayJadwal?.khatibId) {
      fridayKhatib = await getKhatibById(fridayJadwal.khatibId);
    }
  } catch {
    /* fall through to default */
  }
  if (!fridayKhatib) {
    const active = DEFAULT_KHATIB.filter((k) => k.aktif);
    if (active.length > 0) {
      fridayKhatib =
        active[Math.floor(nextFriday.getDate() / 7) % active.length];
    }
  }

  // ─── PROGRAM IMAGES ────────────────────────────────────────────────────────
  const programImageMap: Record<string, string> = {};
  try {
    const imgs = await getAllProgramImages();
    for (const img of imgs) {
      if (img.imageUrl) programImageMap[img.key] = img.imageUrl;
    }
  } catch { /* fall through — use default image */ }

  const programs = PROGRAMS_STATIC.map((p) => ({
    ...p,
    image: programImageMap[p.key] ?? "/background.png",
  }));

  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <Sidebar />

      {/* ══ HERO ══ */}
      <section className="pt-[65px]">
        <div className="relative w-full h-170 md:h-215">
          <Image
            src="/background.png"
            alt="Masjid Al-Hidayah"
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-36 md:pb-48 px-4 text-center">
            <p className="text-amber-300 font-semibold text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
              Ketintang Baru XV No.20 · Surabaya
            </p>
            <h1 className="text-white font-bold text-4xl md:text-6xl mb-4 drop-shadow-lg">
              Masjid Al-Hidayah
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
              Pusat Kegiatan Keislaman &amp; Pemberdayaan Umat
            </p>
            <div className="flex gap-3 mt-7 flex-wrap justify-center">
              <a
                href="#kajian"
                className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                Jadwal Kegiatan
              </a>
              <a
                href="#contact"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors border border-white/30"
              >
                Donasi Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ JADWAL SHOLAT ══ */}
      <div className="relative z-10 -mt-24 px-4 mb-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-amber-500 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-white" />
              <h2 className="text-white font-bold text-[13px] uppercase tracking-widest">
                Jadwal Sholat
              </h2>
            </div>
            <span className="text-amber-100 text-[11px] font-medium">
              Hari Ini &amp; Besok
            </span>
          </div>
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Kiri */}
            <div className="md:w-68 shrink-0 p-5">
              <div className="flex items-start gap-1.5 mb-0.5">
                <MapPin size={15} className="mt-0.5 text-gray-400 shrink-0" />
                <span className="text-[12px] font-medium text-gray-600 leading-snug">
                  Ketintang Baru XV No.20, Kec.Gayungan, Surabaya
                </span>
              </div>
              <p className="text-[11px] text-amber-600 font-semibold mb-4 pl-5.5">
                {khutbahLabel}
              </p>

              {/* Khatib card */}
              <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-3.5 border border-amber-200">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2.5">
                  Khatib Jumat
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-amber-50 ring-2 ring-amber-200 shrink-0">
                    {fridayKhatib?.fotoUrl ? (
                      <Image
                        src={fridayKhatib.fotoUrl}
                        alt={fridayKhatib.nama}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-100">
                        <User size={22} className="text-amber-700" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-gray-900 leading-snug">
                      {fridayKhatib
                        ? `${fridayKhatib.nama}${fridayKhatib.gelar ? `, ${fridayKhatib.gelar}` : ""}`
                        : "Belum Ditentukan"}
                    </p>
                    {fridayKhatib?.spesialisasi && (
                      <p className="text-[11px] text-amber-600 mt-0.5 font-medium truncate">
                        {fridayKhatib.spesialisasi}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan: tabel */}
            <div className="flex-1 p-5 overflow-x-auto">
              <table className="w-full min-w-95 text-center text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-3 pr-2 text-[11px] font-semibold text-gray-400 min-w-32.5" />
                    {prayerColumns.map(({ label }) => (
                      <th
                        key={label}
                        className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-14"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {prayerData.map((row, i) => (
                    <tr key={i}>
                      <td
                        className={`py-2.5 pr-2 text-left rounded-l-xl ${row.isActive ? "bg-amber-50" : ""}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <ChevronRight
                            size={12}
                            className={`text-amber-500 ${row.isActive ? "visible" : "invisible"}`}
                          />
                          <span
                            className={`text-[12px] whitespace-nowrap ${row.isActive ? "font-semibold text-gray-800" : "text-gray-500"}`}
                          >
                            {row.date}
                          </span>
                        </div>
                      </td>
                      {prayerColumns.map(({ key }, j) => (
                        <td
                          key={key}
                          className={[
                            "py-2.5 w-14 text-[12px]",
                            row.isActive ? "bg-amber-50" : "",
                            j === prayerColumns.length - 1
                              ? "rounded-r-xl"
                              : "",
                            row.isActive && key === row.activeCol
                              ? "font-bold text-amber-600"
                              : "font-medium text-gray-600",
                          ].join(" ")}
                        >
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ══ PROFIL ══ */}
      <section id="profil" className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-[0.2em] mb-2">
              Tentang Kami
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Masjid Al-Hidayah
            </h2>
            <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mt-3" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Building2 size={18} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-[16px] text-gray-900">
                  Sejarah Singkat
                </h3>
              </div>
              <p className="text-[13.5px] text-gray-600 leading-relaxed mb-3">
                Masjid Al-Hidayah berdiri sejak tahun 1985 atas prakarsa warga
                Ketintang Baru XV sebagai pusat kegiatan keislaman di kawasan
                Gayungan, Surabaya. Berawal dari mushola sederhana, kini hadir
                sebagai masjid yang megah dengan berbagai fasilitas modern.
              </p>
              <p className="text-[13.5px] text-gray-600 leading-relaxed">
                Selama lebih dari 39 tahun, masjid ini menjadi jangkar spiritual
                ribuan jamaah, menyelenggarakan pendidikan, kajian, dan kegiatan
                sosial kemasyarakatan.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Star size={18} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-[16px] text-gray-900">
                  Visi &amp; Misi
                </h3>
              </div>
              <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
                Visi
              </p>
              <p className="text-[13.5px] text-gray-700 font-medium mb-4 leading-relaxed">
                Menjadi pusat keislaman yang maju, inklusif, dan memberdayakan
                umat menuju kehidupan baldatun thayyibatun wa rabbun ghafur.
              </p>
              <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2">
                Misi
              </p>
              <ul className="space-y-1.5">
                {[
                  "Menyelenggarakan ibadah yang tertib dan berkualitas",
                  "Mengembangkan pendidikan Islam dari usia dini",
                  "Memberdayakan jamaah secara ekonomi & sosial",
                  "Menjaga transparansi & akuntabilitas keuangan",
                ].map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2 text-[13px] text-gray-600"
                  >
                    <Check
                      size={14}
                      className="text-amber-500 mt-0.5 shrink-0"
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Pengurus */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pengurus.map((p) => (
              <div
                key={p.nama}
                className="bg-white rounded-2xl p-5 shadow-sm text-center"
              >
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <User size={28} className="text-amber-700" />
                </div>
                <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
                  {p.jabatan}
                </p>
                <p className="font-bold text-[14px] text-gray-900">{p.nama}</p>
                <p className="text-[12px] text-gray-500 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JADWAL KEGIATAN ══ */}
      <section id="kajian" className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-600 font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                Agenda Masjid
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Jadwal Kegiatan
              </h2>
              <div className="w-12 h-1 bg-amber-400 rounded-full mt-3" />
            </div>
            <Link
              href="/laporan-keuangan"
              className="text-[13px] text-amber-600 font-semibold hover:underline hidden sm:block"
            >
              Laporan Keuangan →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${BADGE_MAP[ev.badge]}`}
                  >
                    {ev.jenis}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {ev.waktu} WIB
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[15px] font-bold text-amber-600 leading-none">
                      {ev.tanggal.getDate()}
                    </span>
                    <span className="text-[9px] text-amber-400 uppercase font-semibold">
                      {MONTHS_ID[ev.tanggal.getMonth()].slice(0, 3)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2">
                      {ev.topik}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {DAYS_ID[ev.tanggal.getDay()]} · {ev.khatib}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[12px] text-gray-400 mt-6">
            Jadwal dapat berubah sewaktu-waktu · Pantau pengumuman di masjid
          </p>
        </div>
      </section>

      {/* ══ PROGRAM UNGGULAN ══ */}
      <section id="program" className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-[0.2em] mb-2">
              Program Kami
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Program Unggulan
            </h2>
            <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programs.map((program) => (
              <div
                key={program.title}
                className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className={`object-cover ${program.objectPos} group-hover:scale-105 transition-transform duration-500`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-white text-[17px] font-bold">
                    {program.title}
                  </h3>
                  <p className="text-white/75 text-[12px] mt-1 leading-snug">
                    {program.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FASILITAS ══ */}
      <section id="fasilitas" className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-[0.2em] mb-2">
              Sarana &amp; Prasarana
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Fasilitas Masjid
            </h2>
            <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {fasilitas.map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 rounded-2xl p-5 hover:shadow-sm transition-shadow border border-gray-100"
              >
                <div className="mb-3">
                  <f.icon size={28} className="text-amber-600" />
                </div>
                <h4 className="font-bold text-[14px] text-gray-900 mb-1">
                  {f.title}
                </h4>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BERITA ══ */}
      <BeritaSection />

      {/* ══ DONASI & KONTAK ══ */}
      <section id="contact" className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-[0.2em] mb-2">
              Bersama Membangun Masjid
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Donasi &amp; Hubungi Kami
            </h2>
            <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mt-3" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Donasi */}
            <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-[17px] mb-1">Donasi &amp; Wakaf</h3>
              <p className="text-white/80 text-[13px] mb-5 leading-relaxed">
                Setiap rupiah yang Anda sumbangkan menjadi amal jariyah yang
                mengalir tanpa henti. Jazakumullahu Khairan.
              </p>
              <div className="space-y-3">
                {[
                  {
                    bank: "BSI (Bank Syariah Indonesia)",
                    norek: "7 1234 5678 9",
                    atas: "Masjid Al-Hidayah",
                  },
                  {
                    bank: "Bank Mandiri Syariah",
                    norek: "0 2345 6789 0",
                    atas: "DKM Al-Hidayah",
                  },
                  {
                    bank: "BNI Syariah",
                    norek: "0 9876 5432 1",
                    atas: "Masjid Al-Hidayah",
                  },
                ].map((acc) => (
                  <CopyNorekCard
                    key={acc.bank}
                    bank={acc.bank}
                    norek={acc.norek}
                    atas={acc.atas}
                  />
                ))}
              </div>
              <p className="text-[12px] text-white/70 mt-4">
                Konfirmasi via WhatsApp:{" "}
                <span className="font-semibold text-white">0812-3456-7890</span>
              </p>
            </div>

            {/* Kontak */}
            <div className="space-y-3">
              {(
                [
                  {
                    icon: MapPin,
                    label: "Alamat",
                    value:
                      "Jl. Ketintang Baru XV No.20\nKec. Gayungan, Surabaya 60231\nJawa Timur, Indonesia",
                  },
                  {
                    icon: Clock,
                    label: "Jam Operasional",
                    value:
                      "Senin – Minggu: 04:00 – 21:00 WIB\nShalat 5 waktu berjamaah setiap hari",
                  },
                  {
                    icon: Phone,
                    label: "Kontak",
                    value:
                      "WhatsApp: 0812-3456-7890\nEmail: info@masjidalhidayah.id",
                  },
                  {
                    icon: Smartphone,
                    label: "Media Sosial",
                    value:
                      "Instagram: @masjidalhidayah.id\nYouTube: Masjid Al-Hidayah Surabaya",
                  },
                ] as { icon: LucideIcon; label: string; value: string }[]
              ).map((c) => {
                const KontakIcon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <KontakIcon size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        {c.label}
                      </p>
                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
                        {c.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-[13px] text-gray-400 hover:border-amber-300 hover:text-amber-600 transition-colors"
              >
                <Settings size={16} />
                Panel Admin Masjid
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
