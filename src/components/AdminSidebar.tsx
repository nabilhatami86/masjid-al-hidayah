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
  ExternalLink,
  LogOut,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard",        icon: LayoutDashboard },
  { href: "/admin/khatib",    label: "Khatib & Ustadz",  icon: Users           },
  { href: "/admin/jadwal",    label: "Jadwal Kegiatan",  icon: CalendarDays    },
  { href: "/admin/keuangan",  label: "Keuangan",         icon: Wallet          },
  { href: "/admin/program",   label: "Program Unggulan", icon: Images          },
];

function SidebarContent({
  pathname,
  onClose,
  onLogout,
}: {
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
          <Image src="/logo.png" width={22} height={22} alt="Logo" />
        </div>
        <div>
          <p className="font-bold text-[13px] leading-tight text-gray-900">Masjid Al-Hidayah</p>
          <p className="text-[11px] text-gray-400">Panel Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                active
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}

        <div className="pt-3 border-t border-gray-100 mt-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <ExternalLink size={17} strokeWidth={1.8} />
            Lihat Website
          </Link>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2.5 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <UserCircle size={18} className="text-amber-600" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-800">Administrator</p>
            <p className="text-[11px] text-gray-400">Pengurus Masjid</p>
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
  const pathname    = usePathname();
  const router      = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function logout() {
    localStorage.removeItem("admin_token");
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
