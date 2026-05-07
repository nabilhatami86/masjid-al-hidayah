"use client";

import { useMemo, useState } from "react";
import { rupiah } from "../utils";
import { BULAN_LIST, PER_PAGE } from "../constants";
import type { Transaksi } from "../types";

interface Props {
  transaksiList: Transaksi[];
  aSlide: () => string;
  aDelay: (ms: number) => React.CSSProperties;
}

export default function TransaksiTable({ transaksiList, aSlide, aDelay }: Props) {
  const [bulanFilter, setBulanFilter] = useState("semua");
  const [jenisFilter, setJenisFilter] = useState<"semua" | "masuk" | "keluar">("semua");
  const [halaman, setHalaman] = useState(1);

  const filtered = useMemo(() => {
    return transaksiList
      .filter((t) => {
        const bulanT = t.tanggal.split("-")[1];
        const okBulan = bulanFilter === "semua" || bulanT === bulanFilter;
        const okJenis = jenisFilter === "semua" || t.jenis === jenisFilter;
        return okBulan && okJenis;
      })
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [bulanFilter, jenisFilter, transaksiList]);

  const totalHalaman = Math.ceil(filtered.length / PER_PAGE);
  const tabelData    = filtered.slice((halaman - 1) * PER_PAGE, halaman * PER_PAGE);

  const summaryFiltered = useMemo(() => {
    let m = 0, k = 0;
    for (const t of filtered) {
      if (t.jenis === "masuk") m += t.jumlah;
      else k += t.jumlah;
    }
    return { masuk: m, keluar: k };
  }, [filtered]);

  function setFilterBulan(v: string) { setBulanFilter(v); setHalaman(1); }
  function setFilterJenis(v: "semua" | "masuk" | "keluar") { setJenisFilter(v); setHalaman(1); }

  const tbodyKey = `${bulanFilter}|${jenisFilter}|${halaman}`;

  return (
    <div className={`${aSlide()} bg-white rounded-2xl shadow-sm p-6`} style={aDelay(550)}>
      {/* Header + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-[15px] font-bold text-gray-800">Riwayat Transaksi</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={bulanFilter}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            {BULAN_LIST.map((b) => (
              <option key={b.val} value={b.val}>{b.label}</option>
            ))}
          </select>
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            {(["semua", "masuk", "keluar"] as const).map((j) => (
              <button
                key={j}
                onClick={() => setFilterJenis(j)}
                className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  jenisFilter === j
                    ? j === "masuk"   ? "bg-emerald-500 text-white"
                    : j === "keluar" ? "bg-red-500 text-white"
                    :                  "bg-gray-700 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {j === "semua" ? "Semua" : j === "masuk" ? "Masuk" : "Keluar"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-summary saat filter aktif */}
      {(bulanFilter !== "semua" || jenisFilter !== "semua") && (
        <div className="flex flex-wrap gap-4 mb-4 text-[13px] an-fade">
          <span className="text-emerald-600 font-semibold">Masuk: {rupiah(summaryFiltered.masuk)}</span>
          <span className="text-red-500 font-semibold">Keluar: {rupiah(summaryFiltered.keluar)}</span>
          <span className={`font-bold ${summaryFiltered.masuk - summaryFiltered.keluar >= 0 ? "text-amber-600" : "text-red-600"}`}>
            Selisih: {rupiah(summaryFiltered.masuk - summaryFiltered.keluar)}
          </span>
        </div>
      )}

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Tanggal","Keterangan","Kategori"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase pb-2 pr-4 whitespace-nowrap">{h}</th>
              ))}
              <th className="text-right text-[11px] font-semibold text-gray-400 uppercase pb-2 whitespace-nowrap">Jumlah</th>
            </tr>
          </thead>
          <tbody key={tbodyKey} className="divide-y divide-gray-50">
            {tabelData.map((t, i) => (
              <tr key={t.id} className="an-row hover:bg-gray-50 transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
                <td className="py-2.5 pr-4 text-[12px] text-gray-500 whitespace-nowrap">
                  {new Date(t.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="py-2.5 pr-4 text-[13px] text-gray-700">{t.keterangan}</td>
                <td className="py-2.5 pr-4">
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {t.kategori}
                  </span>
                </td>
                <td className={`py-2.5 text-right font-semibold text-[13px] whitespace-nowrap ${t.jenis === "masuk" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.jenis === "masuk" ? "+" : "-"}{rupiah(t.jumlah)}
                </td>
              </tr>
            ))}
            {tabelData.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                  Tidak ada data transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalHalaman > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-[12px] text-gray-400">
            Menampilkan {(halaman - 1) * PER_PAGE + 1}–{Math.min(halaman * PER_PAGE, filtered.length)} dari {filtered.length} transaksi
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setHalaman((p) => Math.max(1, p - 1))}
              disabled={halaman === 1}
              className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setHalaman(p)}
                className={`w-8 h-8 text-[12px] rounded-lg border transition-colors ${
                  p === halaman
                    ? "bg-amber-500 text-white border-amber-500 scale-110"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:scale-105"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setHalaman((p) => Math.min(totalHalaman, p + 1))}
              disabled={halaman === totalHalaman}
              className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next ›
            </button>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-[11px] text-gray-400 mt-3">Total {filtered.length} transaksi ditemukan</p>
      )}
    </div>
  );
}
