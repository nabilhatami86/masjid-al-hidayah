"use client";

import Link from "next/link";
import { Settings, MapPin, Clock, Phone, Smartphone, ExternalLink, MessageCircle, Mail, Instagram, Youtube } from "lucide-react";
import DonasiSection from "../DonasiSection";

const CONTACT_CARDS = [
  {
    icon: MapPin,
    label: "Alamat",
    lines: [
      { text: "Jl. Ketintang Baru XV No.20" },
      { text: "Kec. Gayungan, Surabaya 60231" },
      { text: "Jawa Timur, Indonesia" },
    ],
    action: { label: "Buka di Google Maps", icon: ExternalLink, href: "https://maps.google.com/?q=Masjid+Al-Hidayah+Surabaya" },
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    lines: [
      { text: "Senin – Minggu, 04:00 – 21:00 WIB" },
      { text: "Shalat 5 waktu berjamaah setiap hari" },
    ],
    action: null,
  },
  {
    icon: Phone,
    label: "Hubungi Kami",
    lines: [
      { icon: MessageCircle, text: "0812-3456-7890",         href: "https://wa.me/6281234567890" },
      { icon: Mail,          text: "info@masjidalhidayah.id", href: "mailto:info@masjidalhidayah.id" },
    ],
    action: null,
  },
  {
    icon: Smartphone,
    label: "Media Sosial",
    lines: [
      { icon: Instagram, text: "@masjidalhidayah.id",        href: "#" },
      { icon: Youtube,   text: "Masjid Al-Hidayah Surabaya", href: "#" },
    ],
    action: null,
  },
];

export default function KontakSection() {
  return (
    <section id="contact" className="px-4 py-16 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-stone-400 font-medium text-[11px] uppercase tracking-[0.22em] mb-2">Donasi &amp; Kontak</p>
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">Donasi &amp; Hubungi Kami</h2>
          <p className="text-gray-400 text-[13.5px] mt-2 max-w-sm leading-relaxed">
            Dukung kegiatan masjid dan jangan ragu untuk menghubungi kami.
          </p>
        </div>

        {/* 2-kolom */}
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Kiri — Donasi */}
          <DonasiSection />

          {/* Kanan — Info Kontak */}
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {CONTACT_CARDS.map((card) => {
              const CardIcon = card.icon;
              return (
                <div key={card.label} className="px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <CardIcon size={14} className="text-stone-400 shrink-0" strokeWidth={1.8} />
                    <p className="font-semibold text-[11.5px] text-gray-500 uppercase tracking-[0.15em]">{card.label}</p>
                  </div>

                  <div className="space-y-1.5 ml-0.5">
                    {card.lines.map((line, i) => {
                      const LineIcon = "icon" in line ? line.icon : null;
                      if ("href" in line && line.href) {
                        return (
                          <a key={i} href={line.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                            {LineIcon && <LineIcon size={12} className="text-gray-400 shrink-0" strokeWidth={1.8} />}
                            <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors underline-offset-2 group-hover:underline">
                              {line.text}
                            </span>
                          </a>
                        );
                      }
                      return (
                        <div key={i} className="flex items-start gap-2">
                          {LineIcon && <LineIcon size={12} className="text-gray-400 mt-0.5 shrink-0" strokeWidth={1.8} />}
                          <span className="text-[13px] text-gray-600 leading-snug">{line.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {card.action && (
                    <a href={card.action.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2.5 text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors">
                      <card.action.icon size={11} strokeWidth={2} />
                      {card.action.label}
                    </a>
                  )}
                </div>
              );
            })}

            <div className="px-5 py-3">
              <Link href="/admin" className="flex items-center gap-2 text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
                <Settings size={13} strokeWidth={1.8} />
                Panel Admin Masjid
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
