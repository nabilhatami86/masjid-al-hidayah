"use client";

import Link from "next/link";
import { Settings, MapPin, Clock, Phone, Smartphone, ExternalLink, MessageCircle, Mail, Instagram, Youtube } from "lucide-react";
// import DonasiSection from "../DonasiSection";

const CONTACT_CARDS = [
  {
    icon: MapPin,
    label: "Alamat",
    lines: [
      { text: "Jl. Ketintang Baru XV No.20" },
      { text: "Kec. Gayungan, Surabaya 60231" },
      { text: "Jawa Timur, Indonesia" },
    ],
    action: {
      label: "Buka di Google Maps",
      icon: ExternalLink,
      href: "https://maps.google.com/?q=Masjid+Al-Hidayah+Surabaya",
    },
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
      { icon: MessageCircle, text: "0812-3456-7890", href: "https://wa.me/6281234567890", hint: "WhatsApp" },
      { icon: Mail,          text: "info@masjidalhidayah.id", href: "mailto:info@masjidalhidayah.id", hint: "Email" },
    ],
    action: null,
  },
  {
    icon: Smartphone,
    label: "Media Sosial",
    lines: [
      { icon: Instagram, text: "@masjidalhidayah.id",         href: "#", hint: "Instagram" },
      { icon: Youtube,   text: "Masjid Al-Hidayah Surabaya",  href: "#", hint: "YouTube"   },
    ],
    action: null,
  },
];

export default function KontakSection() {
  return (
    <section id="contact" className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-3">
            Hubungi Kami
          </span>
          <h2 className="text-3xl font-bold text-gray-900">Kontak Masjid Al-Hidayah</h2>
          <p className="text-gray-400 text-[14px] mt-2 max-w-md mx-auto leading-relaxed">
            Kami siap melayani jamaah dan masyarakat. Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <MapPin size={26} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="text-center md:text-left flex-1">
            <p className="text-white font-bold text-lg">Masjid Al-Hidayah, Surabaya</p>
            <p className="text-white/75 text-[13px] mt-1 leading-relaxed">
              Pusat ibadah, pendidikan, dan pemberdayaan umat di Kec. Gayungan, Surabaya.
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Masjid+Al-Hidayah+Surabaya"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-white text-amber-600 font-semibold text-[13px] px-4 py-2.5 rounded-xl hover:bg-amber-50 transition-colors"
          >
            <ExternalLink size={14} strokeWidth={2.5} />
            Lihat Lokasi
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTACT_CARDS.map((card) => {
            const CardIcon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-4"
              >
                {/* Card header */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <CardIcon size={17} className="text-amber-600" strokeWidth={2} />
                  </div>
                  <p className="font-bold text-[13px] text-gray-700 uppercase tracking-wide">{card.label}</p>
                </div>

                {/* Lines */}
                <div className="space-y-2.5 flex-1 pl-1">
                  {card.lines.map((line, i) => {
                    const LineIcon = "icon" in line ? line.icon : null;
                    if ("href" in line && line.href) {
                      return (
                        <a
                          key={i}
                          href={line.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 group"
                        >
                          {LineIcon && (
                            <LineIcon size={14} className="text-gray-400 shrink-0" strokeWidth={1.8} />
                          )}
                          <span className="text-[13px] text-gray-600 group-hover:text-amber-600 group-hover:underline underline-offset-2 transition-colors">
                            {line.text}
                          </span>
                        </a>
                      );
                    }
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        {LineIcon && (
                          <LineIcon size={14} className="text-gray-400 mt-0.5 shrink-0" strokeWidth={1.8} />
                        )}
                        <span className="text-[13px] text-gray-600 leading-snug">{line.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action */}
                {card.action && (
                  <a
                    href={card.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <card.action.icon size={13} strokeWidth={2.5} />
                    {card.action.label}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Admin link */}
        <div className="flex justify-center">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-gray-200 text-[12px] text-gray-400 hover:border-amber-300 hover:text-amber-500 transition-colors"
          >
            <Settings size={14} strokeWidth={1.8} />
            Panel Admin Masjid
          </Link>
        </div>

      </div>
    </section>
  );
}
