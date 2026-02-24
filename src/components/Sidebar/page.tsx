"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/#profil" },
  { label: "Kajian", href: "/#kajian" },
  { label: "Fasilitas", href: "/#fasilitas" },
  { label: "Berita", href: "/#berita" },
  { label: "Contact Us", href: "/#contact" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href.split("#")[0];
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-amber-50/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-[65px] flex items-center justify-between">
        {/* Logo → Beranda */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="Masjid Al-Hidayah Logo"
          />
          <div>
            <p className="font-bold text-[14px] leading-tight text-gray-900">
              Masjid
            </p>
            <p className="font-bold text-[14px] leading-tight text-gray-900">
              Al-Hidayah
            </p>
          </div>
        </Link>

        {/* Nav Links – desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`text-[13.5px] font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-amber-600 font-semibold"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Kanan: Laporan Keuangan + Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/laporan-keuangan"
            className={`hidden md:block text-[13.5px] font-semibold px-5 py-2 rounded-full transition-colors ${
              pathname === "/laporan-keuangan"
                ? "bg-amber-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Laporan Keuangan
          </Link>

          {/* Hamburger – mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-amber-50 border-t border-amber-100 ${
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-6 py-4 flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2.5 text-[15px] font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-amber-600 font-semibold"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-3 mt-2 border-t border-amber-100">
            <Link
              href="/laporan-keuangan"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Laporan Keuangan
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
