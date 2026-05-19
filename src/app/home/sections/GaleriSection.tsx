"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { GaleriItem } from "@/lib/controllers/galeriController";

interface Props {
  galeriList: GaleriItem[];
}

export default function GaleriSection({ galeriList }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = galeriList.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} id="galeri" className="px-4 py-16 bg-[#F5F3EE]">
      <div className="max-w-4xl mx-auto">

        <div className={`flex items-end justify-between mb-8 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div>
            <p className="text-stone-400 font-medium text-[11px] uppercase tracking-[0.22em] mb-2">Dokumentasi</p>
            <h2 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">Galeri Foto</h2>
          </div>
          <Link href="/galeri" className="hidden sm:flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors shrink-0 mb-1">
            Lihat semua <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Masonry-style: baris pertama 2 besar + 1, baris kedua 3 kecil */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Foto 0 — tall, spans 2 rows */}
          <Link
            href="/galeri"
            className={`group relative col-span-1 row-span-2 rounded-xl overflow-hidden block bg-gray-200 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ aspectRatio: "3/4", transitionDelay: "80ms" }}
          >
            <Image src={items[0]?.image_url ?? ""} alt={items[0]?.judul ?? ""} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-[11px] font-semibold line-clamp-1">{items[0]?.judul}</p>
            </div>
          </Link>

          {/* Foto 1 & 2 — landscape */}
          {items.slice(1, 3).map((item, idx) => (
            <Link
              key={item.id}
              href="/galeri"
              className={`group relative col-span-1 rounded-xl overflow-hidden block bg-gray-200 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ aspectRatio: "4/3", transitionDelay: `${(idx + 1) * 80}ms` }}
            >
              <Image src={item.image_url} alt={item.judul} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-[10.5px] font-semibold line-clamp-1">{item.judul}</p>
              </div>
            </Link>
          ))}

          {/* Foto 3, 4, 5 — bottom row */}
          {items.slice(3, 6).map((item, idx) => (
            <Link
              key={item.id}
              href="/galeri"
              className={`group relative col-span-1 rounded-xl overflow-hidden block bg-gray-200 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ aspectRatio: "4/3", transitionDelay: `${(idx + 3) * 80}ms` }}
            >
              <Image src={item.image_url} alt={item.judul} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-[10.5px] font-semibold line-clamp-1">{item.judul}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={`mt-5 flex sm:hidden justify-center transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "480ms" }}>
          <Link href="/galeri" className="flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors">
            Lihat semua foto <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
