"use client";

import { useState, useMemo, useEffect } from "react";
import { KEYFRAMES } from "./constants";
import { computeSummary, computeMonthlyChart, computePieKeluar, computePieMasuk, computeDateRange } from "./utils";
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

  // Fetch data dari Supabase via API
  useEffect(() => {
    fetch("/api/transaksi")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Transaksi[]>;
      })
      .then((data) => { setTransaksiList(data); setLoading(false); })
      .catch(() => { setError("Gagal memuat data. Silakan coba lagi."); setLoading(false); });
  }, []);

  // Animasi mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;
    const t = setTimeout(() => setCountStarted(true), 280);
    return () => clearTimeout(t);
  }, [mounted, loading]);

  // Derived data
  const summary     = useMemo(() => computeSummary(transaksiList),     [transaksiList]);
  const monthlyData = useMemo(() => computeMonthlyChart(transaksiList),[transaksiList]);
  const pieKeluar   = useMemo(() => computePieKeluar(transaksiList),   [transaksiList]);
  const pieMasuk    = useMemo(() => computePieMasuk(transaksiList),    [transaksiList]);
  const dateRange   = useMemo(() => computeDateRange(transaksiList),   [transaksiList]);

  // Helpers animasi
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
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-sm text-gray-500 mt-1">Masjid Al-Hidayah · Ketintang, Surabaya</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading / Konten */}
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

            <ChartBatang
              monthlyData={monthlyData}
              aSlide={aSlide}
              aDelay={aDelay}
            />

            <ChartPie
              pieKeluar={pieKeluar}
              pieMasuk={pieMasuk}
              aSlide={aSlide}
              aDelay={aDelay}
            />

            <TransaksiTable
              transaksiList={transaksiList}
              aSlide={aSlide}
              aDelay={aDelay}
            />

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
