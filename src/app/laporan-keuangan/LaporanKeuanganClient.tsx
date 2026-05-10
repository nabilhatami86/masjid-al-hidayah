"use client";

import { useState, useMemo, useEffect } from "react";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { KEYFRAMES } from "./constants";
import {
  computeSummary, computeMonthlyChart,
  computePieKeluar, computePieMasuk, computeDateRange,
} from "./utils";
import type { Transaksi } from "./types";

import SkeletonLoading  from "./components/SkeletonLoading";
import SummaryCards     from "./components/SummaryCards";
import ChartBatang      from "./components/ChartBatang";
import ChartPie         from "./components/ChartPie";
import TransaksiTable   from "./components/TransaksiTable";

export default function LaporanKeuanganClient() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [mounted, setMounted]             = useState(false);
  const [countStarted, setCountStarted]   = useState(false);
  const [tahunFilter, setTahunFilter]     = useState<string>("semua");
  const [bulanFilter, setBulanFilter]     = useState<string>("semua");

  useEffect(() => {
    fetch("/api/transaksi")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Transaksi[]>;
      })
      .then((data) => { setTransaksiList(data); setLoading(false); })
      .catch(() => { setError("Gagal memuat data. Silakan coba lagi."); setLoading(false); });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;
    const t = setTimeout(() => setCountStarted(true), 280);
    return () => clearTimeout(t);
  }, [mounted, loading]);

  // Daftar tahun yang tersedia dari data
  const availableYears = useMemo(() => {
    const years = new Set(transaksiList.map((t) => t.tanggal.split("-")[0]));
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [transaksiList]);

  const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  // Reset bulan ketika tahun berubah ke "semua"
  const handleTahunChange = (y: string) => {
    setTahunFilter(y);
    if (y === "semua") setBulanFilter("semua");
  };

  // Bulan yang ada datanya untuk tahun terpilih
  const availableMonths = useMemo(() => {
    const base = tahunFilter === "semua" ? transaksiList : transaksiList.filter((t) => t.tanggal.startsWith(tahunFilter));
    const months = new Set(base.map((t) => t.tanggal.slice(5, 7)));
    return Array.from(months).sort();
  }, [transaksiList, tahunFilter]);

  // Filter berdasarkan tahun + bulan
  const filteredByYear = useMemo(() => {
    let list = transaksiList;
    if (tahunFilter !== "semua") list = list.filter((t) => t.tanggal.startsWith(tahunFilter));
    if (bulanFilter !== "semua") list = list.filter((t) => t.tanggal.slice(5, 7) === bulanFilter);
    return list;
  }, [transaksiList, tahunFilter, bulanFilter]);

  const summary     = useMemo(() => computeSummary(filteredByYear),      [filteredByYear]);
  const monthlyData = useMemo(() => computeMonthlyChart(filteredByYear), [filteredByYear]);
  const pieKeluar   = useMemo(() => computePieKeluar(filteredByYear),    [filteredByYear]);
  const pieMasuk    = useMemo(() => computePieMasuk(filteredByYear),     [filteredByYear]);
  const dateRange   = useMemo(() => computeDateRange(filteredByYear),    [filteredByYear]);

  const exportLabel = (() => {
    if (tahunFilter === "semua") return `Semua Tahun (${availableYears.join(", ")})`;
    if (bulanFilter !== "semua") return `${MONTHS_ID[parseInt(bulanFilter) - 1]} ${tahunFilter}`;
    return `Tahun ${tahunFilter}`;
  })();

  const exportFilename = (() => {
    if (tahunFilter === "semua") return "laporan-keuangan-semua";
    if (bulanFilter !== "semua") return `laporan-keuangan-${tahunFilter}-${bulanFilter}`;
    return `laporan-keuangan-${tahunFilter}`;
  })();

  async function handleExportExcel() {
    const { exportExcel } = await import("@/lib/controllers/exportController");
    await exportExcel(
      filteredByYear as Parameters<typeof exportExcel>[0],
      exportLabel,
      summary,
      `${exportFilename}.xlsx`,
    );
  }

  function handleExportCSV() {
    import("@/lib/controllers/exportController").then(({ exportCSV }) => {
      exportCSV(
        filteredByYear as Parameters<typeof exportCSV>[0],
        `${exportFilename}.csv`,
      );
    });
  }

  function handlePrint() {
    import("@/lib/controllers/exportController").then(({ printLaporan }) => {
      printLaporan(
        filteredByYear as Parameters<typeof printLaporan>[0],
        exportLabel,
        summary,
      );
    });
  }

  const aSlide = () => (mounted ? "an-slide" : "opacity-0 pointer-events-none");
  const aScale = () => (mounted ? "an-scale" : "opacity-0 pointer-events-none");
  const aDelay = (ms: number): React.CSSProperties => ({ animationDelay: `${ms}ms` });

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className={aSlide()} style={aDelay(0)}>
          <div
            className={`h-1 w-20 rounded-full bg-linear-to-r from-emerald-400 via-amber-400 to-amber-300 mb-4 ${mounted ? "an-accent" : "opacity-0"}`}
            style={aDelay(120)}
          />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
              <p className="text-sm text-gray-500 mt-1">Masjid Al-Hidayah · Ketintang, Surabaya</p>
            </div>

            {/* Filter Tahun + Bulan */}
            {!loading && availableYears.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-[12px] text-gray-500 font-medium whitespace-nowrap">Tahun:</label>
                <select
                  value={tahunFilter}
                  onChange={(e) => handleTahunChange(e.target.value)}
                  className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
                >
                  <option value="semua">Semua Tahun</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                {tahunFilter !== "semua" && (
                  <>
                    <label className="text-[12px] text-gray-500 font-medium whitespace-nowrap">Bulan:</label>
                    <select
                      value={bulanFilter}
                      onChange={(e) => setBulanFilter(e.target.value)}
                      className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
                    >
                      <option value="semua">Semua Bulan</option>
                      {availableMonths.map((m) => (
                        <option key={m} value={m}>{MONTHS_ID[parseInt(m) - 1]}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            <SummaryCards
              summary={summary}
              dateRange={dateRange}
              countStarted={countStarted}
              aScale={aScale}
              aDelay={aDelay}
            />

            {/* Tombol Export */}
            <div className={`${aSlide()} flex flex-wrap gap-2`} style={aDelay(260)}>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors shadow-sm"
              >
                <FileText size={15} />
                Export CSV
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors shadow-sm"
              >
                <FileSpreadsheet size={15} />
                Export Excel
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-600 hover:border-amber-300 hover:text-amber-600 transition-colors shadow-sm"
              >
                <Printer size={15} />
                Cetak / PDF
              </button>
            </div>

            <ChartBatang monthlyData={monthlyData} aSlide={aSlide} aDelay={aDelay} />
            <ChartPie pieKeluar={pieKeluar} pieMasuk={pieMasuk} aSlide={aSlide} aDelay={aDelay} />
            <TransaksiTable transaksiList={filteredByYear} aSlide={aSlide} aDelay={aDelay} />

            {/* Catatan Transparansi */}
            <div
              className={`${aSlide()} bg-amber-50 border border-amber-200 rounded-2xl p-5 text-[13px] text-amber-800`}
              style={aDelay(630)}
            >
              <p className="font-bold mb-1">Catatan Transparansi</p>
              <p className="leading-relaxed text-amber-700">
                Laporan keuangan ini disusun oleh Pengurus Masjid Al-Hidayah dan
                disampaikan secara terbuka kepada jamaah. Untuk pertanyaan atau
                klarifikasi, silakan hubungi pengurus melalui email{" "}
                <a href="mailto:info@masjidalhidayah.id" className="underline font-semibold">
                  info@masjidalhidayah.id
                </a>.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
