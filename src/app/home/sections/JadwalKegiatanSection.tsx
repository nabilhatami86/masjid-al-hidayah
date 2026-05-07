import Link from "next/link";
import SectionHeader from "../shared/SectionHeader";
import { BADGE_MAP, MONTHS_ID, DAYS_ID } from "../constants";
import type { UpcomingEvent } from "../types";

interface Props {
  events: UpcomingEvent[];
}

export default function JadwalKegiatanSection({ events }: Props) {
  return (
    <section id="kajian" className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader label="Agenda Masjid" title="Jadwal Kegiatan" />
          <Link
            href="/laporan-keuangan"
            className="text-[13px] text-amber-600 font-semibold hover:underline hidden sm:block"
          >
            Laporan Keuangan →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-gray-50"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${BADGE_MAP[ev.badge]}`}>
                  {ev.jenis}
                </span>
                <span className="text-[11px] text-gray-400">{ev.waktu} WIB</span>
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
  );
}
