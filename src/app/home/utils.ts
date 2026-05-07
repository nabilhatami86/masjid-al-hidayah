import { DEFAULT_KHATIB, type Khatib } from "@/lib/adminTypes";
import { getJadwalMendatang } from "@/lib/controllers/jadwalController";
import { getKhatibById } from "@/lib/controllers/khatibController";
import { getAllProgramImages } from "@/lib/controllers/programController";
import { KOTA_ID, MONTHS_ID, FALLBACK_TIMINGS, PROGRAMS_STATIC } from "./constants";
import type { ApiTimings, PrayerKey, PrayerRow, UpcomingEvent, Program } from "./types";

// ── Waktu ──────────────────────────────────────────────────────────────────
export function getWIBNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 60_000 + 7 * 3_600_000);
}

export function toDisplayDate(d: Date) {
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function getNextFriday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 5 ? 0 : (5 - day + 7) % 7));
  return d;
}

export function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Sholat ─────────────────────────────────────────────────────────────────
export function getNextPrayer(wibNow: Date, t: ApiTimings): PrayerKey {
  const nowMin = wibNow.getHours() * 60 + wibNow.getMinutes();
  const schedule: { key: PrayerKey; time: string }[] = [
    { key: "fajr",    time: t.Fajr    },
    { key: "dzuhur",  time: t.Dhuhr   },
    { key: "ashar",   time: t.Asr     },
    { key: "maghrib", time: t.Maghrib },
    { key: "isya",    time: t.Isha    },
  ];
  for (const s of schedule) {
    const [h, m] = s.time.split(":").map(Number);
    if (h * 60 + m > nowMin) return s.key;
  }
  return "isya";
}

export async function fetchTimings(d: Date): Promise<ApiTimings> {
  try {
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");
    const url  = `https://api.myquran.com/v2/sholat/jadwal/${KOTA_ID}/${yyyy}/${mm}/${dd}`;
    const res  = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return FALLBACK_TIMINGS;
    const json = await res.json();
    const j    = json?.data?.jadwal;
    if (!j) return FALLBACK_TIMINGS;
    return { Fajr: j.subuh, Dhuhr: j.dzuhur, Asr: j.ashar, Maghrib: j.maghrib, Isha: j.isya };
  } catch {
    return FALLBACK_TIMINGS;
  }
}

export function buildPrayerRows(wibNow: Date, wibTomorrow: Date, t1: ApiTimings, t2: ApiTimings): PrayerRow[] {
  return [
    {
      date: toDisplayDate(wibNow),
      fajr: t1.Fajr, dzuhur: t1.Dhuhr, ashar: t1.Asr, maghrib: t1.Maghrib, isya: t1.Isha,
      isActive: true,
      activeCol: getNextPrayer(wibNow, t1),
    },
    {
      date: toDisplayDate(wibTomorrow),
      fajr: t2.Fajr, dzuhur: t2.Dhuhr, ashar: t2.Asr, maghrib: t2.Maghrib, isya: t2.Isha,
      isActive: false,
      activeCol: null,
    },
  ];
}

// ── Jadwal kegiatan ────────────────────────────────────────────────────────
export function getUpcomingEvents(from: Date): UpcomingEvent[] {
  const activeKhatib = DEFAULT_KHATIB.filter((k) => k.aktif);
  let kidx = 0;
  const events: UpcomingEvent[] = [];
  const topicsFriday = [
    "Keutamaan Sholat Berjamaah",
    "Akhlak Muslim dalam Kehidupan Sehari-hari",
    "Mengenal 99 Asmaul Husna",
    "Birrul Walidain — Berbakti kepada Orang Tua",
  ];
  const topicsSabtu = ["Fiqih Sholat Lengkap", "Tafsir Juz Amma — Surah Pendek"];
  const daysToFriday = (5 - from.getDay() + 7) % 7 || 7;

  for (let w = 0; w < 4; w++) {
    const friday = new Date(from);
    friday.setDate(from.getDate() + daysToFriday + w * 7);
    events.push({
      id: `f${w}`, tanggal: friday, jenis: "Khutbah Jumat", badge: "amber",
      topik: topicsFriday[w % topicsFriday.length],
      khatib: activeKhatib[kidx++ % activeKhatib.length].nama,
      waktu: "11:30",
    });
    if (w < 2) {
      const saturday = new Date(friday);
      saturday.setDate(friday.getDate() + 1);
      events.push({
        id: `s${w}`, tanggal: saturday,
        jenis: w === 0 ? "Kajian Sabtu" : "Tahsin Al-Qur'an",
        badge: w === 0 ? "blue" : "emerald",
        topik: topicsSabtu[w],
        khatib: activeKhatib[kidx++ % activeKhatib.length].nama,
        waktu: w === 0 ? "08:00" : "09:00",
      });
    }
  }
  return events.sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime()).slice(0, 6);
}

// ── Khatib Jumat ───────────────────────────────────────────────────────────
export async function getKhatibForFriday(nextFriday: Date): Promise<Khatib | null> {
  const fridayISO = toISO(nextFriday);
  try {
    const jadwals     = await getJadwalMendatang(10);
    const fridayJadwal =
      jadwals.find((j) => j.jenisKegiatan === "Khutbah Jumat" && j.tanggal === fridayISO) ??
      jadwals.find((j) => j.jenisKegiatan === "Khutbah Jumat") ??
      null;
    if (fridayJadwal?.khatibId) return await getKhatibById(fridayJadwal.khatibId);
  } catch { /* fall through */ }

  const active = DEFAULT_KHATIB.filter((k) => k.aktif);
  return active.length > 0
    ? active[Math.floor(nextFriday.getDate() / 7) % active.length]
    : null;
}

// ── Program images ─────────────────────────────────────────────────────────
export async function getProgramsWithImages(): Promise<Program[]> {
  const imageMap: Record<string, string> = {};
  try {
    const imgs = await getAllProgramImages();
    for (const img of imgs) {
      if (img.imageUrl) imageMap[img.key] = img.imageUrl;
    }
  } catch { /* use default */ }

  return PROGRAMS_STATIC.map((p) => ({ ...p, image: imageMap[p.key] ?? "/background.png" }));
}
