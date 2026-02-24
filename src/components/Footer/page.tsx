"use client";

import Image from "next/image";
import Link from "next/link";

const menuLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/#profil" },
  { label: "Kajian", href: "/#kajian" },
  { label: "Fasilitas", href: "/#fasilitas" },
  { label: "Berita", href: "/#berita" },
  { label: "Contact Us", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-4">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="Masjid Al-Hidayah Logo"
            />
            <div>
              <p className="font-bold text-[13px] leading-tight text-white">
                Masjid
              </p>
              <p className="font-bold text-[13px] leading-tight text-white">
                Al-Hidayah
              </p>
            </div>
          </Link>
          <p className="text-[13px] leading-relaxed text-gray-400">
            Masjid Al-Hidayah — Ketintang, Surabaya, Jawa Timur. Pusat kegiatan
            keislaman dan pemberdayaan umat.
          </p>
          <Link
            href="/laporan-keuangan"
            className="inline-block mt-4 text-[12px] text-amber-400 hover:text-amber-300 transition-colors font-semibold"
          >
            Laporan Keuangan →
          </Link>
        </div>

        {/* Menu Links */}
        <div>
          <h4 className="text-white font-semibold text-[14px] mb-3">Menu</h4>
          <ul className="space-y-2 text-[13px]">
            {menuLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="text-white font-semibold text-[14px] mb-3">Kontak</h4>
          <ul className="space-y-2 text-[13px] text-gray-400">
            <li>Jl. Ketintang Baru XV No.20</li>
            <li>Kec. Gayungan, Surabaya 60231</li>
            <li>Jawa Timur, Indonesia</li>
            <li className="pt-1">
              <a
                href="mailto:info@masjidalhidayah.id"
                className="hover:text-amber-400 transition-colors"
              >
                info@masjidalhidayah.id
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/6281234567890"
                className="hover:text-amber-400 transition-colors"
              >
                WhatsApp: 0812-3456-7890
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-[12px] text-gray-500">
        © {new Date().getFullYear()} Masjid Al-Hidayah. Hak cipta dilindungi.
      </div>
    </footer>
  );
}
