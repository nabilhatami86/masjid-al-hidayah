"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import SkeletonBox from "@/components/global/SkeletonBox";

const KOTA_ID = "1638"; // Surabaya
const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_SHORT = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

interface DayJadwal {
  tanggal: string;   // "DD-MM-YYYY"
  date: number;
  dayOfWeek: number;
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  isFriday: boolean;
  isToday: boolean;
}

function getWIBNow() {
  const now = new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 60_000 + 7 * 3_600_000);
}

export default function JadwalSholatBulananClient() {
  const wibNow = getWIBNow();
  const [year,  setYear]  = useState(wibNow.getFullYear());
  const [month, setMonth] = useState(wibNow.getMonth() + 1); // 1-12
  const [data,  setData]  = useState<DayJadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const todayY = wibNow.getFullYear();
  const todayM = wibNow.getMonth() + 1;
  const todayD = wibNow.getDate();

  const fetchMonth = useCallback(async (y: number, m: number) => {
    setLoading(true);
    setError(false);
    try {
      const mm  = String(m).padStart(2, "0");
      const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${KOTA_ID}/${y}/${mm}`, { next: { revalidate: 86400 } });
      if (!res.ok) throw new Error();
      const json = await res.json();
      // API returns: { tanggal: "Jumat, 01/05/2026", date: "2026-05-01", subuh, dzuhur, ashar, maghrib, isya, ... }
      const jadwals: { tanggal: string; date: string; subuh: string; dzuhur: string; ashar: string; maghrib: string; isya: string }[] =
        json?.data?.jadwal ?? [];
      const rows: DayJadwal[] = jadwals.map((j) => {
        // j.date is ISO "YYYY-MM-DD" — reliable for day extraction
        const [isoY, isoM, isoD] = j.date.split("-").map(Number);
        const d = isoD;
        const dateObj = new Date(isoY, isoM - 1, isoD);
        return {
          tanggal:   j.date,
          date:      d,
          dayOfWeek: dateObj.getDay(),
          subuh:     j.subuh,
          dzuhur:    j.dzuhur,
          ashar:     j.ashar,
          maghrib:   j.maghrib,
          isya:      j.isya,
          isFriday:  dateObj.getDay() === 5,
          isToday:   isoY === todayY && isoM === todayM && d === todayD,
        };
      });
      setData(rows);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [todayY, todayM, todayD]);

  useEffect(() => { fetchMonth(year, month); }, [year, month, fetchMonth]);

  function prevMonth() {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  }

  const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-2 text-center whitespace-nowrap">
      {children}
    </th>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
          <MapPin size={13} />
          Kota Surabaya
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Sholat</h1>
        <div className="w-12 h-1 bg-amber-400 rounded-full mt-3" />
      </div>

      {/* Navigasi bulan */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-sm">
        <button onClick={prevMonth} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-amber-300 hover:text-amber-600 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-900 text-lg">{MONTHS_ID[month - 1]} {year}</p>
          <p className="text-[12px] text-gray-400 flex items-center justify-center gap-1 mt-0.5">
            <Clock size={11} /> Waktu Indonesia Barat (WIB)
          </p>
        </div>
        <button onClick={nextMonth} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-amber-300 hover:text-amber-600 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mb-4 text-[12px] text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300 inline-block" />Hari ini</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-50 border border-emerald-200 inline-block" />Jumat</span>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonBox key={i} className="h-10 w-full" />)}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700 text-center">
          Gagal memuat jadwal. Periksa koneksi internet Anda.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <TH>Tgl</TH>
                  <TH>Hari</TH>
                  <TH>Subuh</TH>
                  <TH>Dzuhur</TH>
                  <TH>Ashar</TH>
                  <TH>Maghrib</TH>
                  <TH>Isya</TH>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((row) => (
                  <tr
                    key={row.tanggal}
                    className={`transition-colors ${
                      row.isToday
                        ? "bg-amber-50 border-l-4 border-amber-400"
                        : row.isFriday
                        ? "bg-emerald-50/50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[13px] font-bold ${row.isToday ? "text-amber-600" : row.isFriday ? "text-emerald-600" : "text-gray-700"}`}>
                        {row.date}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`text-[12px] font-medium ${row.isFriday ? "text-emerald-600 font-bold" : "text-gray-500"}`}>
                        {DAYS_SHORT[row.dayOfWeek]}
                        {row.isToday && <span className="ml-1 text-[10px] bg-amber-400 text-white px-1 py-0.5 rounded">Hari ini</span>}
                      </span>
                    </td>
                    {[row.subuh, row.dzuhur, row.ashar, row.maghrib, row.isya].map((waktu, i) => (
                      <td key={i} className="py-2.5 px-2 text-center">
                        <span className="text-[13px] font-medium text-gray-700 font-mono">{waktu}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-[12px] text-gray-400 mt-4 text-center">
        Sumber: Kementerian Agama RI via api.myquran.com · Waktu dapat berbeda ±2 menit
      </p>
    </div>
  );
}
