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
      { icon: MessageCircle, text: "0812-3456-7890",        href: "https://wa.me/6281234567890" },
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
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-3">
            Donasi & Kontak
          </span>
          <h2 className="text-3xl font-bold text-gray-900">Donasi &amp; Hubungi Kami</h2>
          <p className="text-gray-400 text-[14px] mt-2 max-w-md mx-auto leading-relaxed">
            Dukung kegiatan masjid dan jangan ragu untuk menghubungi kami.
          </p>
        </div>

        {/* 2-kolom: Donasi kiri, Kontak kanan */}
        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* Kiri — Donasi */}
          <DonasiSection />

          {/* Kanan — Info Kontak */}
          <div className="space-y-3">
            {CONTACT_CARDS.map((card) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <CardIcon size={15} className="text-amber-600" strokeWidth={2} />
                    </div>
                    <p className="font-bold text-[12px] text-gray-600 uppercase tracking-wide">{card.label}</p>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    {card.lines.map((line, i) => {
                      const LineIcon = "icon" in line ? line.icon : null;
                      if ("href" in line && line.href) {
                        return (
                          <a key={i} href={line.href} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 group">
                            {LineIcon && <LineIcon size={13} className="text-gray-400 shrink-0" strokeWidth={1.8} />}
                            <span className="text-[13px] text-gray-600 group-hover:text-amber-600 group-hover:underline underline-offset-2 transition-colors">
                              {line.text}
                            </span>
                          </a>
                        );
                      }
                      return (
                        <div key={i} className="flex items-start gap-2">
                          {LineIcon && <LineIcon size={13} className="text-gray-400 mt-0.5 shrink-0" strokeWidth={1.8} />}
                          <span className="text-[13px] text-gray-600 leading-snug">{line.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {card.action && (
                    <a href={card.action.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                      <card.action.icon size={12} strokeWidth={2.5} />
                      {card.action.label}
                    </a>
                  )}
                </div>
              );
            })}

            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-dashed border-gray-200 text-[12px] text-gray-400 hover:border-amber-300 hover:text-amber-500 transition-colors"
            >
              <Settings size={14} strokeWidth={1.8} />
              Panel Admin Masjid
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
