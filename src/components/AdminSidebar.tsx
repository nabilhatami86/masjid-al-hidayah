"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Wallet,
  Images,
  Newspaper,
  ExternalLink,
  LogOut,
  UserCircle,
  Menu,
  X,
  // KeyRound,
  LayoutGrid,
  BarChart2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

// Sub-item di bawah Transaksi
const TRANSAKSI_SUB = [
  { href: "/admin/keuangan/pemasukan",  label: "Pemasukan",   icon: TrendingUp,  color: "text-emerald-600" },
  { href: "/admin/keuangan/pengeluaran", label: "Pengeluaran", icon: TrendingDown, color: "text-red-500"     },
  { href: "/admin/laporan",             label: "Arus Kas",    icon: BarChart2,   color: "text-blue-600"    },
];

const navGroups = [
  {
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Konten",
    items: [
      { href: "/admin/khatib",   label: "Khatib & Ustadz",  icon: Users        },
      { href: "/admin/jadwal",   label: "Jadwal Kegiatan",  icon: CalendarDays },
      { href: "/admin/berita",   label: "Berita",           icon: Newspaper    },
      { href: "/admin/galeri",   label: "Galeri Foto",      icon: Images       },
      { href: "/admin/program",  label: "Program Unggulan", icon: LayoutGrid   },
    ],
  },
  {
    label: "Keuangan",
    items: [
      // { href: "/admin/rekening", label: "Nomor Rekening", icon: CreditCard }, // belum dipakai
    ],
    withTransaksi: true,
  },
  // {
  //   label: "Pengaturan",
  //   items: [
  //     { href: "/admin/akun", label: "Kelola Akun", icon: KeyRound },
  //   ],
  // },
];

function NavLink({
  href, label, icon: Icon, active, onClose,
}: {
  href: string; label: string; icon: React.ElementType;
  active: boolean; onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
        active
          ? "bg-amber-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
      {label}
    </Link>
  );
}

function TransaksiNav({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const isAnySubActive = TRANSAKSI_SUB.some(
    (s) => pathname === s.href || pathname.startsWith(s.href + "/"),
  );
  const [open, setOpen] = useState(isAnySubActive);

  return (
    <div>
      {/* Parent button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
          isAnySubActive
            ? "bg-amber-50 text-amber-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Wallet size={16} strokeWidth={isAnySubActive ? 2.5 : 1.8} />
        <span className="flex-1 text-left">Transaksi</span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sub-items */}
      {open && (
        <div className="mt-0.5 ml-3 pl-4 border-l border-gray-100 space-y-0.5">
          {TRANSAKSI_SUB.map(({ href, label, icon: Icon, color }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12.5px] font-medium transition-all ${
                  active
                    ? "bg-amber-500 text-white shadow-sm"
                    : `text-gray-500 hover:bg-gray-100 hover:text-gray-800`
                }`}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 1.8} className={active ? "" : color} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  pathname, onClose, onLogout,
}: {
  pathname: string; onClose: () => void; onLogout: () => void;
}) {
  const adminNama     = typeof window !== "undefined" ? localStorage.getItem("admin_nama")     ?? "" : "";
  const adminUsername = typeof window !== "undefined" ? localStorage.getItem("admin_username") ?? "admin" : "admin";

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
          <Image src="/logo.png" width={22} height={22} alt="Logo" />
        </div>
        <div>
          <p className="font-bold text-[13px] leading-tight text-gray-900">Masjid Al-Hidayah</p>
          <p className="text-[11px] text-gray-400">Panel Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {/* Transaksi collapsible — hanya di grup Keuangan */}
              {"withTransaksi" in group && group.withTransaksi && (
                <TransaksiNav pathname={pathname} onClose={onClose} />
              )}
              {group.items.map(({ href, label, icon }) => (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  icon={icon}
                  active={pathname === href || pathname.startsWith(href + "/")}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Lihat Website */}
        <div className="border-t border-gray-100 pt-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <ExternalLink size={16} strokeWidth={1.8} />
            Lihat Website
          </Link>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="shrink-0 px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 mb-2">
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <UserCircle size={16} className="text-amber-600" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-gray-800 truncate leading-tight">
              {adminNama || "Administrator"}
            </p>
            <p className="text-[10.5px] text-gray-400 truncate font-mono leading-tight">
              {adminUsername}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} strokeWidth={2} />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_nama");
    router.replace("/admin/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-100 z-40">
        <SidebarContent pathname={pathname} onClose={() => {}} onLogout={logout} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
            <Image src="/logo.png" width={18} height={18} alt="Logo" />
          </div>
          <span className="font-bold text-[13px] text-gray-900">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-56 bg-white shadow-xl">
            <SidebarContent
              pathname={pathname}
              onClose={() => setMobileOpen(false)}
              onLogout={logout}
            />
          </aside>
        </div>
      )}
    </>
  );
}
