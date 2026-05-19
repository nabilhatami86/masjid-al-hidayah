import Link from "next/link";
import SectionHeader from "../shared/SectionHeader";
import { BADGE_MAP, MONTHS_ID, DAYS_ID } from "../constants";
import type { UpcomingEvent } from "../types";

interface Props {
  events: UpcomingEvent[];
}

const BADGE_CLEAN: Record<string, string> = {
  amber:   "bg-amber-50 text-amber-700 border border-amber-100",
  blue:    "bg-sky-50 text-sky-700 border border-sky-100",
  emerald: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

export default function JadwalKegiatanSection({ events }: Props) {
  return (
    <section id="kajian" className="px-4 py-16 bg-[#F5F3EE]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <SectionHeader label="Agenda Masjid" title="Jadwal Kegiatan" />
          <Link href="/jadwal-kegiatan" className="text-[12.5px] text-gray-400 hover:text-gray-700 font-medium transition-colors hidden sm:block mb-10">
            Lihat semua →
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-gray-400 bg-white rounded-2xl border border-gray-100">
            Belum ada jadwal kegiatan yang tersedia.
          </div>
        ) : (
          <div className="space-y-2">
            {/* Item pertama — sedikit lebih besar */}
            {events[0] && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-start">
                <div className="w-12 shrink-0 text-center pt-0.5">
                  <p className="text-[22px] font-bold text-gray-800 leading-none">
                    {events[0].tanggal.getDate()}
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase font-semibold mt-0.5">
                    {MONTHS_ID[events[0].tanggal.getMonth()].slice(0, 3)}
                  </p>
                </div>
                <div className="w-px bg-gray-100 self-stretch shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10.5px] px-2 py-0.5 rounded font-semibold ${BADGE_CLEAN[events[0].badge] ?? "bg-gray-50 text-gray-500 border border-gray-100"}`}>
                      {events[0].jenis}
                    </span>
                    <span className="text-[11px] text-gray-400">{events[0].waktu} WIB</span>
                  </div>
                  <p className="text-[14px] font-bold text-gray-800 leading-snug mb-1">
                    {events[0].topik}
                  </p>
                  <p className="text-[12.5px] text-gray-500">
                    {DAYS_ID[events[0].tanggal.getDay()]} · {events[0].khatib}
                  </p>
                </div>
              </div>
            )}

            {/* Item selanjutnya — lebih compact */}
            <div className="grid sm:grid-cols-2 gap-2">
              {events.slice(1).map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 items-start hover:border-gray-200 transition-colors"
                >
                  <div className="w-9 shrink-0 text-center pt-0.5">
                    <p className="text-[17px] font-bold text-gray-800 leading-none">
                      {ev.tanggal.getDate()}
                    </p>
                    <p className="text-[9px] text-stone-400 uppercase font-semibold mt-0.5">
                      {MONTHS_ID[ev.tanggal.getMonth()].slice(0, 3)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-semibold ${BADGE_CLEAN[ev.badge] ?? "bg-gray-50 text-gray-500 border border-gray-100"}`}>
                        {ev.jenis}
                      </span>
                      <span className="text-[10.5px] text-gray-400">{ev.waktu}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-gray-700 leading-snug line-clamp-2">
                      {ev.topik}
                    </p>
                    <p className="text-[11.5px] text-gray-400 mt-0.5 truncate">
                      {DAYS_ID[ev.tanggal.getDay()]} · {ev.khatib}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[11.5px] text-gray-400 mt-5">
          Jadwal dapat berubah sewaktu-waktu · Pantau pengumuman di masjid
        </p>
      </div>
    </section>
  );
}
