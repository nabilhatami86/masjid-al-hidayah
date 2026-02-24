"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import { type Khatib, type Jadwal, type TransaksiAdmin } from "@/lib/adminTypes";
import Link from "next/link";
import {
  UserCheck,
  CalendarCheck,
  TrendingUp,
  Wallet,
  UserPlus,
  CalendarPlus,
  PlusCircle,
  BarChart2,
  Users,
  Globe,
  type LucideIcon,
} from "lucide-react";

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const BADGE: Record<string, string> = {
  "Khutbah Jumat":    "bg-amber-100 text-amber-700",
  "Kajian Sabtu":     "bg-blue-100 text-blue-700",
  "Tahsin Al-Qur'an": "bg-emerald-100 text-emerald-700",
  "TPA Al-Hidayah":   "bg-purple-100 text-purple-700",
  "Tahfidz":          "bg-pink-100 text-pink-700",
  "Maulid & Kegiatan Khusus": "bg-red-100 text-red-700",
};

interface StatCard {
  label: string;
  value: string;
  sub: string;
  color: string;
  iconColor: string;
  icon: LucideIcon;
}

interface QuickAction {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

export default function DashboardPage() {
  const [khatib,    setKhatib]    = useState<Khatib[]>([]);
  const [upcoming,  setUpcoming]  = useState<Jadwal[]>([]);
  const [transaksi, setTransaksi] = useState<TransaksiAdmin[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/khatib").then((r) => r.json()),
      fetch("/api/jadwal?mendatang=true&limit=4").then((r) => r.json()),
      fetch("/api/transaksi").then((r) => r.json()),
    ]).then(([k, j, t]) => {
      setKhatib(Array.isArray(k) ? k : []);
      setUpcoming(Array.isArray(j) ? j : []);
      setTransaksi(Array.isArray(t) ? t : []);
    }).finally(() => setLoading(false));
  }, []);

  const khatibAktif = khatib.filter((k) => k.aktif).length;
  const recentTx    = transaksi.slice(0, 6);

  let totalMasuk = 0, totalKeluar = 0;
  for (const t of transaksi) {
    if (t.jenis === "masuk") totalMasuk  += t.jumlah;
    else                     totalKeluar += t.jumlah;
  }
  const saldo = totalMasuk - totalKeluar;

  const stats: StatCard[] = [
    { label: "Khatib Aktif",    value: loading ? "…" : String(khatibAktif),    sub: `dari ${khatib.length} terdaftar`, color: "bg-blue-50",    iconColor: "text-blue-500",    icon: UserCheck    },
    { label: "Jadwal Terdekat", value: loading ? "…" : String(upcoming.length), sub: "kegiatan akan datang",            color: "bg-purple-50",  iconColor: "text-purple-500",  icon: CalendarCheck },
    { label: "Total Pemasukan", value: loading ? "…" : rupiah(totalMasuk),      sub: "sepanjang tahun",                 color: "bg-emerald-50", iconColor: "text-emerald-500", icon: TrendingUp    },
    { label: "Saldo Kas",       value: loading ? "…" : rupiah(saldo),           sub: "per hari ini",                    color: "bg-amber-50",   iconColor: "text-amber-500",   icon: Wallet        },
  ];

  const quickActions: QuickAction[] = [
    { href: "/admin/khatib",     label: "Tambah Khatib",  icon: UserPlus,    color: "hover:bg-blue-50 hover:border-blue-200",     iconColor: "text-blue-500"    },
    { href: "/admin/jadwal",     label: "Buat Jadwal",    icon: CalendarPlus, color: "hover:bg-purple-50 hover:border-purple-200", iconColor: "text-purple-500"  },
    { href: "/admin/keuangan",   label: "Input Keuangan", icon: PlusCircle,  color: "hover:bg-emerald-50 hover:border-emerald-200", iconColor: "text-emerald-500" },
    { href: "/laporan-keuangan", label: "Laporan Publik", icon: BarChart2,   color: "hover:bg-amber-50 hover:border-amber-200",   iconColor: "text-amber-500"   },
    { href: "/admin/khatib",     label: "Daftar Ustadz",  icon: Users,       color: "hover:bg-blue-50 hover:border-blue-200",     iconColor: "text-blue-400"    },
    { href: "/",                 label: "Lihat Website",  icon: Globe,       color: "hover:bg-gray-100 hover:border-gray-300",    iconColor: "text-gray-400"    },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-5 py-8 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Selamat datang kembali, Administrator —{" "}
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
                      <Icon size={18} className={s.iconColor} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
                      <p className="text-xl font-bold text-gray-900 leading-tight mt-0.5 break-all">{s.value}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Jadwal Terdekat */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[15px] text-gray-800">Jadwal Terdekat</h2>
                  <Link href="/admin/jadwal" className="text-[12px] text-amber-600 font-semibold hover:underline">Kelola →</Link>
                </div>
                {loading ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Memuat…</p>
                ) : upcoming.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Belum ada jadwal.</p>
                ) : (
                  <ul className="space-y-3">
                    {upcoming.map((j) => (
                      <li key={j.id} className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-amber-600 leading-none">
                            {new Date(j.tanggal + "T00:00").getDate()}
                          </span>
                          <span className="text-[9px] text-amber-500 uppercase">
                            {MONTHS_ID[new Date(j.tanggal + "T00:00").getMonth()].slice(0, 3)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${BADGE[j.jenisKegiatan] ?? "bg-gray-100 text-gray-600"}`}>
                              {j.jenisKegiatan}
                            </span>
                            <span className="text-[11px] text-gray-400">{j.waktu} WIB</span>
                          </div>
                          <p className="text-[13px] font-semibold text-gray-800 mt-0.5 truncate">{j.topik}</p>
                          <p className="text-[12px] text-gray-500 truncate">{j.khatibNama}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Transaksi Terbaru */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[15px] text-gray-800">Transaksi Terbaru</h2>
                  <Link href="/admin/keuangan" className="text-[12px] text-amber-600 font-semibold hover:underline">Kelola →</Link>
                </div>
                {loading ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Memuat…</p>
                ) : (
                  <ul className="space-y-2">
                    {recentTx.map((t) => (
                      <li key={t.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="text-[13px] text-gray-700 truncate">{t.keterangan}</p>
                          <p className="text-[11px] text-gray-400">
                            {new Date(t.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                            {" · "}{t.kategori}
                          </p>
                        </div>
                        <span className={`text-[13px] font-bold shrink-0 ${t.jenis === "masuk" ? "text-emerald-600" : "text-red-500"}`}>
                          {t.jenis === "masuk" ? "+" : "-"}{rupiah(t.jumlah)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-[15px] text-gray-800 mb-4">Aksi Cepat</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link key={a.label} href={a.href}
                      className={`flex items-center gap-3 p-3 rounded-xl border border-gray-100 transition-all text-[13.5px] font-medium text-gray-700 ${a.color}`}>
                      <Icon size={18} className={a.iconColor} strokeWidth={1.8} />
                      {a.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
