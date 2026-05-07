export interface ApiTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export type PrayerKey = "fajr" | "dzuhur" | "ashar" | "maghrib" | "isya";

export interface PrayerRow {
  date: string;
  fajr: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  isActive: boolean;
  activeCol: PrayerKey | null;
}

export interface UpcomingEvent {
  id: string;
  tanggal: Date;
  jenis: string;
  badge: string;
  topik: string;
  khatib: string;
  waktu: string;
}

export interface Program {
  key: string;
  title: string;
  desc: string;
  objectPos: string;
  image: string;
}
