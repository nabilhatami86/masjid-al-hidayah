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
  ArrowUpRight,
} from "lucide-react";

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const MONTHS_ID = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const BADGE: Record<string, string> = {
  "Khutbah Jumat":          "bg-amber-50 text-amber-700 border border-amber-100",
  "Kajian Sabtu":           "bg-sky-50 text-sky-700 border border-sky-100",
  "Tahsin Al-Qur'an":       "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "TPA Al-Hidayah":         "bg-violet-50 text-violet-700 border border-violet-100",
  "Tahfidz":                "bg-pink-50 text-pink-700 border border-pink-100",
  "Maulid & Kegiatan Khusus": "bg-rose-50 text-rose-700 border border-rose-100",
};

interface StatCard { label: string; value: string; sub: string; icon: LucideIcon; iconColor: string; }
interface QuickAction { href: string; label: string; icon: LucideIcon; }

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
    { label: "Khatib Aktif",    value: loading ? "—" : String(khatibAktif),    sub: `${khatib.length} terdaftar`,  icon: UserCheck,    iconColor: "text-blue-500"    },
    { label: "Jadwal Terdekat", value: loading ? "—" : String(upcoming.length), sub: "kegiatan akan datang",        icon: CalendarCheck, iconColor: "text-violet-500"  },
    { label: "Total Pemasukan", value: loading ? "—" : rupiah(totalMasuk),      sub: "sepanjang periode",           icon: TrendingUp,   iconColor: "text-emerald-600" },
    { label: "Saldo Kas",       value: loading ? "—" : rupiah(saldo),           sub: "per hari ini",                icon: Wallet,       iconColor: "text-stone-500"   },
  ];

  const quickActions: QuickAction[] = [
    { href: "/admin/khatib",     label: "Tambah Khatib",  icon: UserPlus    },
    { href: "/admin/jadwal",     label: "Buat Jadwal",    icon: CalendarPlus },
    { href: "/admin/keuangan",   label: "Input Keuangan", icon: PlusCircle  },
    { href: "/admin/laporan",    label: "Arus Kas",       icon: BarChart2   },
    { href: "/admin/khatib",     label: "Daftar Ustadz",  icon: Users       },
    { href: "/",                 label: "Lihat Website",  icon: Globe       },
  ];

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50/70">
        <AdminSidebar />

        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-5 py-8 space-y-7">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-[12.5px] text-gray-400 mt-0.5">{today}</p>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} className={s.iconColor} strokeWidth={1.8} />
                      <p className="text-[11px] text-gray-400 font-medium truncate">{s.label}</p>
                    </div>
                    <p className="text-[19px] font-bold text-gray-900 leading-none break-all">{s.value}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5">{s.sub}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Jadwal Terdekat — lebih lebar */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[14px] text-gray-800">Jadwal Terdekat</h2>
                  <Link href="/admin/jadwal" className="flex items-center gap-0.5 text-[11.5px] text-gray-400 hover:text-gray-700 transition-colors font-medium">
                    Kelola <ArrowUpRight size={12} strokeWidth={2} />
                  </Link>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />)}
                  </div>
                ) : upcoming.length === 0 ? (
                  <p className="text-[12.5px] text-gray-400 py-6 text-center">Belum ada jadwal.</p>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {upcoming.map((j) => {
                      const d = new Date(j.tanggal + "T00:00");
                      return (
                        <li key={j.id} className="flex gap-3 items-center py-2.5 first:pt-0 last:pb-0">
                          <div className="w-9 shrink-0 text-center">
                            <p className="text-[17px] font-bold text-gray-800 leading-none">{d.getDate()}</p>
                            <p className="text-[9.5px] text-gray-400 uppercase font-medium mt-0.5">{MONTHS_ID[d.getMonth()]}</p>
                          </div>
                          <div className="w-px h-8 bg-gray-100 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${BADGE[j.jenisKegiatan] ?? "bg-gray-50 text-gray-500 border border-gray-100"}`}>
                                {j.jenisKegiatan}
                              </span>
                              <span className="text-[10.5px] text-gray-400">{j.waktu}</span>
                            </div>
                            <p className="text-[12.5px] font-semibold text-gray-700 truncate">{j.topik}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Transaksi Terbaru — lebih sempit */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[14px] text-gray-800">Transaksi Terbaru</h2>
                  <Link href="/admin/keuangan" className="flex items-center gap-0.5 text-[11.5px] text-gray-400 hover:text-gray-700 transition-colors font-medium">
                    Kelola <ArrowUpRight size={12} strokeWidth={2} />
                  </Link>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-50 rounded-lg animate-pulse" />)}
                  </div>
                ) : (
                  <ul className="space-y-0">
                    {recentTx.map((t) => (
                      <li key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-[12px] text-gray-700 truncate font-medium">{t.keterangan}</p>
                          <p className="text-[10.5px] text-gray-400 mt-0.5">
                            {new Date(t.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                            {" · "}{t.kategori}
                          </p>
                        </div>
                        <span className={`text-[12px] font-bold shrink-0 tabular-nums ${t.jenis === "masuk" ? "text-emerald-600" : "text-red-500"}`}>
                          {t.jenis === "masuk" ? "+" : "−"}{rupiah(t.jumlah)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-[14px] text-gray-800 mb-3">Aksi Cepat</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link
                      key={a.label}
                      href={a.href}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-center"
                    >
                      <Icon size={16} className="text-gray-500" strokeWidth={1.8} />
                      <span className="text-[11px] font-medium text-gray-600 leading-tight">{a.label}</span>
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
