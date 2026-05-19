"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CalendarClock, Phone } from "lucide-react";

const AYAT = [
  {
    text: "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka.",
    ref: "QS. At-Taubah: 103",
  },
  {
    text: "Dan dirikanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.",
    ref: "QS. Al-Baqarah: 43",
  },
  {
    text: "Sesungguhnya yang memakmurkan masjid-masjid Allah hanyalah orang-orang yang beriman kepada Allah.",
    ref: "QS. At-Taubah: 18",
  },
  {
    text: "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai.",
    ref: "QS. Al-Baqarah: 261",
  },
];

const navLinks = [
  { label: "Beranda",          href: "/"              },
  { label: "Profil",           href: "/#profil"       },
  { label: "Kajian",           href: "/#kajian"       },
  { label: "Fasilitas",        href: "/#fasilitas"    },
  { label: "Jadwal Sholat",    href: "/jadwal-sholat" },
  { label: "Kalkulator Zakat", href: "/zakat"         },
  { label: "Kontak",           href: "/#contact"      },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen,    setIsOpen]    = useState(false);
  const [ayatIdx,   setAyatIdx]   = useState(0);
  const [fade,      setFade]      = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setAyatIdx((i) => (i + 1) % AYAT.length);
        setFade(true);
      }, 400);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  function isActive(href: string) {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const ayat = AYAT[ayatIdx];

  return (
    <nav className="fixed top-0 inset-x-0 z-50">

      {/* ── Top announcement bar ── */}
      <div className="bg-stone-900 h-8 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex items-center justify-between gap-4">
          {/* Ayat — tengah/kiri, fade transition */}
          <p
            className="text-[11px] text-stone-300 truncate transition-opacity duration-400 flex-1 min-w-0"
            style={{ opacity: fade ? 1 : 0 }}
          >
            <span className="text-amber-400/80 mr-1">"</span>
            {ayat.text}
            <span className="text-amber-400/80 ml-1">"</span>
            <span className="text-stone-500 ml-2">({ayat.ref})</span>
          </p>

          {/* Quick links — kanan */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <Link href="/jadwal-sholat" className="flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-200 transition-colors">
              <CalendarClock size={11} strokeWidth={2} />
              Jadwal Sholat
            </Link>
            <span className="text-stone-700">·</span>
            <Link href="/#contact" className="flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-200 transition-colors">
              <Phone size={11} strokeWidth={2} />
              Kontak
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-[65px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <Image src="/logo.png" width={18} height={18} alt="Masjid Al-Hidayah Logo" />
            </div>
            <span className="font-bold text-[14px] text-gray-900 tracking-tight">Masjid Al-Hidayah</span>
          </Link>

          {/* Nav Links – desktop */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-amber-700 bg-amber-50"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Kanan */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/laporan-keuangan"
              className={`hidden md:block text-[13px] font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                pathname === "/laporan-keuangan"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              Laporan Keuangan
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            >
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-250 bg-white border-t border-gray-100 ${isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="px-4 py-3 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-amber-700 bg-amber-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 mt-1 border-t border-gray-100">
              <Link
                href="/laporan-keuangan"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-amber-500 hover:bg-amber-600 text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Laporan Keuangan
              </Link>
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
}
