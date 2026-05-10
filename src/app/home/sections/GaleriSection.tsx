"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { GaleriItem } from "@/lib/controllers/galeriController";

const KEYFRAMES = `
  @keyframes gsHeader {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gsCard {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes kbZoom {
    from { transform: scale(1); }
    to   { transform: scale(1.08); }
  }
  .gs-header { animation: gsHeader 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .gs-card   { animation: gsCard   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .kb-zoom   { animation: kbZoom   6s ease-in-out infinite alternate; }
`;

interface Props {
  galeriList: GaleriItem[];
}

export default function GaleriSection({ galeriList }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = galeriList.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <section ref={sectionRef} id="galeri" className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div
            className={`flex items-end justify-between mb-10 ${visible ? "gs-header" : "opacity-0"}`}
          >
            <div>
              <p className="text-amber-600 font-semibold text-[11px] uppercase tracking-[0.18em] mb-1">
                Dokumentasi
              </p>
              <h2 className="text-[26px] font-bold text-gray-900 leading-tight">
                Galeri Foto
              </h2>
            </div>
            <Link
              href="/galeri"
              className="hidden sm:flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-amber-600 transition-colors shrink-0 mb-1"
            >
              Lihat semua
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((item, idx) => (
              <Link
                key={item.id}
                href="/galeri"
                className={`group relative aspect-4/3 rounded-2xl overflow-hidden block bg-gray-200 ${
                  visible ? "gs-card" : "opacity-0"
                }`}
                style={{ animationDelay: `${80 + idx * 75}ms` }}
              >
                {/* Ken-burns per foto dengan offset berbeda */}
                <div
                  className="absolute inset-0 kb-zoom"
                  style={{ animationDelay: `${idx * -1.2}s` }}
                >
                  <Image
                    src={item.image_url}
                    alt={item.judul}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400" />

                {/* Shimmer line top */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

                {/* Info muncul dari bawah */}
                <div className="absolute inset-x-0 bottom-0 px-3 py-3 bg-linear-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                  <p className="text-white text-[12px] font-semibold leading-snug line-clamp-1">
                    {item.judul}
                  </p>
                  <p className="text-white/65 text-[10.5px] mt-0.5">{item.kategori}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile lihat semua */}
          <div
            className={`mt-5 flex sm:hidden justify-center ${visible ? "gs-header" : "opacity-0"}`}
            style={{ animationDelay: "560ms" }}
          >
            <Link
              href="/galeri"
              className="flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-amber-600 transition-colors"
            >
              Lihat semua foto
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
