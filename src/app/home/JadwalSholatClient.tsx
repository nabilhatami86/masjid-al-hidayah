"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, User } from "lucide-react";

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

interface KhatibInfo {
  nama: string;
  gelar: string;
  spesialisasi: string;
  fotoUrl?: string | null;
}

interface Props {
  prayerData: PrayerRow[];
  khutbahLabel: string;
  fridayKhatib: KhatibInfo | null;
}

const PRAYERS: { key: PrayerKey; label: string }[] = [
  { key: "fajr",    label: "Subuh"   },
  { key: "dzuhur",  label: "Dzuhur"  },
  { key: "ashar",   label: "Ashar"   },
  { key: "maghrib", label: "Maghrib" },
  { key: "isya",    label: "Isya"    },
];

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function tick() {
      const now = new Date();
      const wib = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 7 * 3600000);
      setTime(wib.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}

export default function JadwalSholatClient({ prayerData, khutbahLabel, fridayKhatib }: Props) {
  const [activeDay, setActiveDay] = useState<0 | 1>(0);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const row = prayerData[activeDay] ?? prayerData[0];

  return (
    <div className="relative z-10 -mt-27 px-4 mb-8">
      <div
        className={`max-w-4xl mx-auto rounded-2xl overflow-hidden transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
      >
        {/* TOP ROW */}
        <div className="flex items-center justify-between px-5 py-3 gap-4">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={11} className="text-white/50 shrink-0" />
            <span className="text-white/60 text-[11px] truncate">
              Ketintang Baru XV, Surabaya
            </span>
          </div>

          <div className="flex bg-white/10 rounded-lg p-0.5 gap-0.5 shrink-0">
            {prayerData.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i as 0 | 1)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${
                  activeDay === i
                    ? "bg-white text-amber-600"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {i === 0 ? "Hari ini" : "Besok"}
              </button>
            ))}
          </div>

          <div className="text-white/90 font-semibold text-[15px] tabular-nums shrink-0">
            <LiveClock />
          </div>
        </div>

        {/* PRAYER PILLS */}
        <div className="px-4 pb-4 grid grid-cols-5 gap-2">
          {PRAYERS.map(({ key, label }, idx) => {
            const isNext = activeDay === 0 && key === row.activeCol;
            return (
              <div
                key={key}
                className={`relative flex flex-col items-center gap-1 rounded-xl py-2.5 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                } ${isNext ? "bg-white/95 shadow-sm" : "bg-white/8 hover:bg-white/14"}`}
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                {isNext && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                )}
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isNext ? "text-amber-500" : "text-white/70"}`}>
                  {label}
                </p>
                <p className={`text-[14px] font-bold tabular-nums leading-none ${isNext ? "text-amber-600" : "text-white"}`}>
                  {row[key]}
                </p>
              </div>
            );
          })}
        </div>

        {/* KHATIB STRIP */}
        <div
          className={`flex items-center gap-3 px-5 py-2.5 border-t border-white/10 bg-black/15 transition-all duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "360ms" }}
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/25 shrink-0">
            {fridayKhatib?.fotoUrl ? (
              <Image src={fridayKhatib.fotoUrl} alt={fridayKhatib.nama} fill className="object-cover object-top" />
            ) : (
              <div className="w-full h-full bg-white/15 flex items-center justify-center">
                <User size={13} className="text-white/70" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-white/45 text-[10px] font-medium uppercase tracking-wider shrink-0">Khatib Jumat</span>
            <span className="text-white/30 text-[10px]">·</span>
            <span className="text-white/80 text-[11px] font-semibold truncate">
              {fridayKhatib
                ? `${fridayKhatib.nama}${fridayKhatib.gelar ? `, ${fridayKhatib.gelar}` : ""}`
                : "Belum Ditentukan"}
            </span>
            {fridayKhatib?.spesialisasi && (
              <>
                <span className="text-white/30 text-[10px] shrink-0">·</span>
                <span className="text-white/45 text-[10px] truncate hidden sm:block">{fridayKhatib.spesialisasi}</span>
              </>
            )}
          </div>
          <span className="text-white/35 text-[10px] ml-auto shrink-0 hidden sm:block">{khutbahLabel}</span>
        </div>
      </div>
    </div>
  );
}
