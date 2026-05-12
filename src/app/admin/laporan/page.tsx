"use client";

import { useEffect, useState, useMemo } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import KeuanganWidget from "@/components/KeuanganWidget";
import { type TransaksiAdmin } from "@/lib/adminTypes";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileDown,
  Sheet,
  Printer,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function exportCSVAlurKas(rows: MonthlyRow[], tahun: string) {
  const header = ["Bulan", "Pemasukan", "Pengeluaran", "Arus Kas Bersih", "Saldo Kumulatif"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([
      r.label,
      r.masuk,
      r.keluar,
      r.net,
      r.saldo,
    ].join(","));
  }
  const total = rows.reduce((acc, r) => ({
    masuk: acc.masuk + r.masuk,
    keluar: acc.keluar + r.keluar,
  }), { masuk: 0, keluar: 0 });
  lines.push(["TOTAL", total.masuk, total.keluar, total.masuk - total.keluar, ""].join(","));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `alur-kas-${tahun}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function printAlurKas(rows: MonthlyRow[], tahun: string) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const total = rows.reduce((acc, r) => ({
    masuk: acc.masuk + r.masuk,
    keluar: acc.keluar + r.keluar,
  }), { masuk: 0, keluar: 0 });

  const rows_html = rows
    .map(
      (r) => `<tr>
        <td>${r.label}</td>
        <td style="color:#10b981">${r.masuk > 0 ? fmt(r.masuk) : "-"}</td>
        <td style="color:#ef4444">${r.keluar > 0 ? fmt(r.keluar) : "-"}</td>
        <td style="color:${r.net >= 0 ? "#d97706" : "#ef4444"}">${fmt(r.net)}</td>
        <td style="font-weight:600;color:${r.saldo >= 0 ? "#1d4ed8" : "#dc2626"}">${fmt(r.saldo)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Laporan Alur Kas ${tahun}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; margin: 24px; }
    h2 { margin: 0 0 4px; }
    p { margin: 0 0 16px; color: #666; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f59e0b; color: white; padding: 8px 12px; text-align: left; font-size: 12px; }
    td { padding: 7px 12px; border-bottom: 1px solid #f0f0f0; }
    tr:last-child td { font-weight: bold; border-top: 2px solid #e5e7eb; background: #fafafa; }
    @media print { button { display: none; } }
  </style></head><body>
  <h2>Laporan Alur Kas Masjid Al-Hidayah</h2>
  <p>Periode: ${tahun === "semua" ? "Semua Tahun" : `Tahun ${tahun}`}</p>
  <table>
    <thead><tr><th>Bulan</th><th>Pemasukan</th><th>Pengeluaran</th><th>Arus Kas Bersih</th><th>Saldo Kumulatif</th></tr></thead>
    <tbody>${rows_html}
    <tr>
      <td>TOTAL</td>
      <td style="color:#10b981">${fmt(total.masuk)}</td>
      <td style="color:#ef4444">${fmt(total.keluar)}</td>
      <td style="color:${total.masuk - total.keluar >= 0 ? "#d97706" : "#ef4444"}">${fmt(total.masuk - total.keluar)}</td>
      <td>—</td>
    </tr>
    </tbody>
  </table>
  <script>window.onload=()=>window.print();<\/script>
  </body></html>`;

  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); }
}

interface MonthlyRow {
  bulan: number;
  label: string;
  masuk: number;
  keluar: number;
  net: number;
  saldo: number;
}

export default function LaporanAlurKasPage() {
  const [list, setList] = useState<TransaksiAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTahun, setFilterTahun] = useState(String(new Date().getFullYear()));

  useEffect(() => {
    fetch("/api/transaksi")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set(list.map((t) => t.tanggal.slice(0, 4)));
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [list]);

  const filtered = useMemo(() =>
    filterTahun === "semua" ? list : list.filter((t) => t.tanggal.startsWith(filterTahun)),
    [list, filterTahun]
  );

  const monthlyRows = useMemo((): MonthlyRow[] => {
    if (filterTahun === "semua") {
      const yearMap: Record<string, { masuk: number; keluar: number }> = {};
      for (const t of list) {
        const y = t.tanggal.slice(0, 4);
        if (!yearMap[y]) yearMap[y] = { masuk: 0, keluar: 0 };
        if (t.jenis === "masuk") yearMap[y].masuk += t.jumlah;
        else yearMap[y].keluar += t.jumlah;
      }
      const rows: MonthlyRow[] = [];
      let cumSaldo = 0;
      for (const y of Object.keys(yearMap).sort()) {
        const { masuk, keluar } = yearMap[y];
        const net = masuk - keluar;
        cumSaldo += net;
        rows.push({ bulan: parseInt(y), label: `Tahun ${y}`, masuk, keluar, net, saldo: cumSaldo });
      }
      return rows;
    }

    const monthMap: Record<number, { masuk: number; keluar: number }> = {};
    for (const t of filtered) {
      const m = parseInt(t.tanggal.slice(5, 7));
      if (!monthMap[m]) monthMap[m] = { masuk: 0, keluar: 0 };
      if (t.jenis === "masuk") monthMap[m].masuk += t.jumlah;
      else monthMap[m].keluar += t.jumlah;
    }

    const rows: MonthlyRow[] = [];
    let cumSaldo = 0;
    for (let m = 1; m <= 12; m++) {
      const { masuk = 0, keluar = 0 } = monthMap[m] ?? {};
      const net = masuk - keluar;
      cumSaldo += net;
      rows.push({ bulan: m, label: MONTHS_ID[m - 1], masuk, keluar, net, saldo: cumSaldo });
    }
    return rows;
  }, [list, filtered, filterTahun]);

  const activeRows = monthlyRows.filter((r) => r.masuk > 0 || r.keluar > 0 || filterTahun === "semua");

  const summary = useMemo(() => {
    const masuk = filtered.reduce((s, t) => t.jenis === "masuk" ? s + t.jumlah : s, 0);
    const keluar = filtered.reduce((s, t) => t.jenis === "keluar" ? s + t.jumlah : s, 0);
    return { masuk, keluar, saldo: masuk - keluar };
  }, [filtered]);

  const periodLabel = filterTahun === "semua" ? "Semua Tahun" : `Tahun ${filterTahun}`;

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Laporan Alur Kas</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? "Memuat…" : `${periodLabel} · ${filtered.length} transaksi`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value)}
                  className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="semua">Semua Tahun</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => exportCSVAlurKas(activeRows, filterTahun)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FileDown size={14} strokeWidth={2} />
                    CSV
                  </button>
                  <button
                    onClick={() => printAlurKas(activeRows, filterTahun)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Printer size={14} strokeWidth={2} />
                    Print
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-emerald-400">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-emerald-500" strokeWidth={2} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pemasukan</p>
                </div>
                <p className="text-xl font-bold text-emerald-600 break-all">
                  {loading ? "…" : rupiah(summary.masuk)}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-red-400">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={16} className="text-red-500" strokeWidth={2} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pengeluaran</p>
                </div>
                <p className="text-xl font-bold text-red-500 break-all">
                  {loading ? "…" : rupiah(summary.keluar)}
                </p>
              </div>
              <div className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${summary.saldo >= 0 ? "border-amber-400" : "border-red-500"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={16} className={summary.saldo >= 0 ? "text-amber-500" : "text-red-500"} strokeWidth={2} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saldo Akhir</p>
                </div>
                <p className={`text-xl font-bold break-all ${summary.saldo >= 0 ? "text-amber-600" : "text-red-600"}`}>
                  {loading ? "…" : rupiah(summary.saldo)}
                </p>
              </div>
            </div>

            {/* Alur Kas Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-[15px]">Rincian Alur Kas</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">Saldo kumulatif dihitung dari awal periode</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">
                        {filterTahun === "semua" ? "Tahun" : "Bulan"}
                      </th>
                      <th className="text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">
                        Pemasukan
                      </th>
                      <th className="text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">
                        Pengeluaran
                      </th>
                      <th className="text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">
                        Arus Bersih
                      </th>
                      <th className="text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">
                        Saldo Kumulatif
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 5 }).map((_, j) => (
                            <td key={j} className="px-5 py-3">
                              <div className="h-4 bg-gray-100 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : monthlyRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400 text-[13px]">
                          Belum ada data transaksi untuk periode ini.
                        </td>
                      </tr>
                    ) : (
                      monthlyRows.map((row) => {
                        const isEmpty = row.masuk === 0 && row.keluar === 0;
                        return (
                          <tr
                            key={row.bulan}
                            className={`transition-colors ${isEmpty ? "opacity-40" : "hover:bg-gray-50/60"}`}
                          >
                            <td className="px-5 py-3">
                              <span className={`text-[13px] font-semibold ${isEmpty ? "text-gray-400" : "text-gray-800"}`}>
                                {row.label}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className={`text-[13px] font-medium ${row.masuk > 0 ? "text-emerald-600" : "text-gray-300"}`}>
                                {row.masuk > 0 ? rupiah(row.masuk) : "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className={`text-[13px] font-medium ${row.keluar > 0 ? "text-red-500" : "text-gray-300"}`}>
                                {row.keluar > 0 ? rupiah(row.keluar) : "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              {isEmpty ? (
                                <span className="text-gray-300 text-[13px]">—</span>
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  {row.net > 0 ? (
                                    <ChevronUp size={14} className="text-emerald-500" strokeWidth={2.5} />
                                  ) : row.net < 0 ? (
                                    <ChevronDown size={14} className="text-red-500" strokeWidth={2.5} />
                                  ) : (
                                    <Minus size={14} className="text-gray-400" strokeWidth={2.5} />
                                  )}
                                  <span className={`text-[13px] font-semibold ${row.net > 0 ? "text-emerald-600" : row.net < 0 ? "text-red-500" : "text-gray-500"}`}>
                                    {rupiah(Math.abs(row.net))}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {isEmpty ? (
                                <span className="text-gray-300 text-[13px]">—</span>
                              ) : (
                                <span className={`text-[13px] font-bold ${row.saldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
                                  {rupiah(row.saldo)}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {!loading && monthlyRows.length > 0 && (
                    <tfoot>
                      <tr className="bg-amber-50 border-t-2 border-amber-200">
                        <td className="px-5 py-3 text-[13px] font-bold text-gray-800">Total</td>
                        <td className="px-5 py-3 text-right text-[13px] font-bold text-emerald-600">
                          {rupiah(summary.masuk)}
                        </td>
                        <td className="px-5 py-3 text-right text-[13px] font-bold text-red-500">
                          {rupiah(summary.keluar)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`text-[13px] font-bold ${summary.saldo >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                            {rupiah(summary.saldo)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`text-[13px] font-bold ${summary.saldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
                            {rupiah(summary.saldo)}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-[12px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <ChevronUp size={14} className="text-emerald-500" strokeWidth={2.5} />
                <span>Arus bersih positif (pemasukan &gt; pengeluaran)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ChevronDown size={14} className="text-red-500" strokeWidth={2.5} />
                <span>Arus bersih negatif (pengeluaran &gt; pemasukan)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Saldo kumulatif (akumulasi dari awal periode)</span>
              </div>
            </div>

            {/* Widget Transaksi */}
            <KeuanganWidget transaksi={list} loading={loading} maxRows={8} />

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
