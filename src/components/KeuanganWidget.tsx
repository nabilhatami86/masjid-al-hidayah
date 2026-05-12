"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { type TransaksiAdmin } from "@/lib/adminTypes";

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  transaksi: TransaksiAdmin[];
  loading?: boolean;
  maxRows?: number;
}

export default function KeuanganWidget({ transaksi, loading = false, maxRows = 6 }: Props) {
  let totalMasuk = 0, totalKeluar = 0;
  for (const t of transaksi) {
    if (t.jenis === "masuk") totalMasuk  += t.jumlah;
    else                     totalKeluar += t.jumlah;
  }
  const saldo    = totalMasuk - totalKeluar;
  const recentTx = transaksi.slice(0, maxRows);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className="font-bold text-[15px] text-gray-800">Kas & Keuangan</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Ringkasan seluruh transaksi</p>
        </div>
        <Link
          href="/admin/keuangan"
          className="flex items-center gap-1 text-[12px] text-amber-600 font-semibold hover:underline"
        >
          Kelola <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

      <div className="p-5 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 border-l-4 border-emerald-400">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp size={13} className="text-emerald-500" strokeWidth={2.5} />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Pemasukan</p>
            </div>
            <p className="text-[13px] font-bold text-emerald-700 break-all leading-tight">
              {loading ? "…" : rupiah(totalMasuk)}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-3 border-l-4 border-red-400">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingDown size={13} className="text-red-500" strokeWidth={2.5} />
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Pengeluaran</p>
            </div>
            <p className="text-[13px] font-bold text-red-600 break-all leading-tight">
              {loading ? "…" : rupiah(totalKeluar)}
            </p>
          </div>

          <div className={`rounded-xl p-3 border-l-4 ${saldo >= 0 ? "bg-amber-50 border-amber-400" : "bg-red-50 border-red-500"}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Wallet size={13} className={saldo >= 0 ? "text-amber-500" : "text-red-500"} strokeWidth={2.5} />
              <p className={`text-[10px] font-bold uppercase tracking-wide ${saldo >= 0 ? "text-amber-600" : "text-red-600"}`}>Saldo</p>
            </div>
            <p className={`text-[13px] font-bold break-all leading-tight ${saldo >= 0 ? "text-amber-700" : "text-red-600"}`}>
              {loading ? "…" : rupiah(saldo)}
            </p>
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Transaksi Terbaru</p>
          {loading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-16 shrink-0" />
                </div>
              ))}
            </div>
          ) : recentTx.length === 0 ? (
            <p className="text-[13px] text-gray-400 text-center py-4">Belum ada transaksi.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentTx.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  {/* Jenis badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    t.jenis === "masuk" ? "bg-emerald-100" : "bg-red-100"
                  }`}>
                    {t.jenis === "masuk"
                      ? <TrendingUp  size={14} className="text-emerald-600" strokeWidth={2.5} />
                      : <TrendingDown size={14} className="text-red-500"    strokeWidth={2.5} />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-700 font-medium truncate">{t.keterangan}</p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(t.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                      {" · "}
                      <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full text-[10px]">
                        {t.kategori}
                      </span>
                    </p>
                  </div>

                  {/* Jumlah */}
                  <span className={`text-[13px] font-bold shrink-0 ${
                    t.jenis === "masuk" ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {t.jenis === "masuk" ? "+" : "−"}{rupiah(t.jumlah)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer links */}
        <div className="flex gap-3 pt-1 border-t border-gray-100">
          <Link
            href="/admin/keuangan"
            className="flex-1 text-center text-[12px] font-semibold text-gray-600 hover:text-amber-600 py-2 rounded-xl hover:bg-amber-50 transition-colors"
          >
            Input Transaksi
          </Link>
          <Link
            href="/admin/laporan"
            className="flex-1 text-center text-[12px] font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 py-2 rounded-xl transition-colors"
          >
            Lihat Alur Kas
          </Link>
        </div>
      </div>
    </div>
  );
}
