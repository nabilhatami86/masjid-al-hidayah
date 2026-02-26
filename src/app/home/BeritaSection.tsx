"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { beritaList } from "@/app/berita/data";

// ─── CSS KEYFRAMES ─────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes bSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bSlideLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes bSlideRight {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes bFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .b-slide-up   { animation: bSlideUp    0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .b-slide-left { animation: bSlideLeft  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .b-slide-right{ animation: bSlideRight 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .b-fade       { animation: bFade       0.45s ease-out both; }
`;

// ─── SCROLL REVEAL HOOK ────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── KOMPONEN ─────────────────────────────────────────────────────────────────
export default function BeritaSection() {
  const section = useInView(0.08);
  const featured = beritaList[0];
  const sideItems = beritaList.slice(1);

  return (
    <>
      <style>{KEYFRAMES}</style>

      <section ref={section.ref} id="berita" className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* Header row */}
          <div
            className={`flex items-end justify-between mb-8 ${section.visible ? "b-slide-up" : "opacity-0"}`}
            style={{ animationDelay: "0ms" }}
          >
            <div>
              <p className="text-amber-600 font-semibold text-[11px] uppercase tracking-[0.18em] mb-1">
                Informasi Terkini
              </p>
              <h2 className="text-[26px] font-bold text-gray-900 leading-tight">
                Berita &amp; Pengumuman
              </h2>
            </div>
            <Link
              href="/berita"
              className="hidden sm:flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-amber-600 transition-colors shrink-0 mb-1"
            >
              Lihat semua
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Featured + side layout */}
          <div className="grid sm:grid-cols-[1.4fr_1fr] gap-4">

            {/* Featured card */}
            <Link
              href={`/berita/${featured.slug}`}
              className={`group flex flex-col bg-gray-50 hover:bg-amber-50/60 border border-gray-100 hover:border-amber-200/80 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                section.visible ? "b-slide-left" : "opacity-0"
              }`}
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-sm shrink-0 ${featured.dotColor}`} />
                <span className={`text-[10.5px] font-bold uppercase tracking-widest ${featured.labelColor}`}>
                  {featured.kategori}
                </span>
              </div>
              <h3 className="text-[16.5px] font-bold text-gray-900 leading-snug mb-3 group-hover:text-amber-800 transition-colors">
                {featured.judul}
              </h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed flex-1 mb-5">
                {featured.ringkasan}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200/80">
                <span className="text-[11px] text-gray-400">{featured.tanggal}</span>
                <span className="text-[11.5px] font-semibold text-amber-600 flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-150">
                  Selengkapnya <ChevronRight size={13} strokeWidth={2.5} />
                </span>
              </div>
            </Link>

            {/* Side stack */}
            <div className="flex flex-col gap-4">
              {sideItems.map((b, i) => (
                <Link
                  key={b.slug}
                  href={`/berita/${b.slug}`}
                  className={`group flex flex-col bg-gray-50 hover:bg-amber-50/60 border border-gray-100 hover:border-amber-200/80 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex-1 ${
                    section.visible ? "b-slide-right" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${180 + i * 90}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`w-1.5 h-1.5 rounded-sm shrink-0 ${b.dotColor}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${b.labelColor}`}>
                      {b.kategori}
                    </span>
                  </div>
                  <h4 className="text-[13.5px] font-bold text-gray-900 leading-snug group-hover:text-amber-800 transition-colors flex-1 mb-3">
                    {b.judul}
                  </h4>
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-200/80">
                    <span className="text-[11px] text-gray-400">{b.tanggal}</span>
                    <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5 group-hover:gap-1 transition-all duration-150">
                      Baca <ChevronRight size={12} strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile "lihat semua" */}
          <div
            className={`mt-5 flex sm:hidden justify-center ${section.visible ? "b-fade" : "opacity-0"}`}
            style={{ animationDelay: "380ms" }}
          >
            <Link
              href="/berita"
              className="flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-amber-600 transition-colors"
            >
              Lihat semua berita
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
