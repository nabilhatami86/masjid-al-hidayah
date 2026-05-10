"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/global/SectionHeader";
import SkeletonBox from "@/components/global/SkeletonBox";
import { KATEGORI_GALERI } from "@/lib/controllers/galeriController";
import type { GaleriItem } from "@/lib/controllers/galeriController";

const KEYFRAMES = `
  @keyframes gFadeIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gSlideLeft {
    from { opacity: 0; transform: translateX(70px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes gSlideRight {
    from { opacity: 0; transform: translateX(-70px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes lbOpen {
    from { opacity: 0; transform: scale(0.95) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes lbBgIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .g-fade-in     { animation: gFadeIn     0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .g-slide-left  { animation: gSlideLeft  0.32s cubic-bezier(0.22,1,0.36,1) both; }
  .g-slide-right { animation: gSlideRight 0.32s cubic-bezier(0.22,1,0.36,1) both; }
  .lb-open       { animation: lbOpen      0.28s cubic-bezier(0.22,1,0.36,1) both; }
  .lb-bg-in      { animation: lbBgIn      0.22s ease-out both; }
`;

export default function GaleriClient() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState<string>("Semua");
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    fetch("/api/galeri")
      .then((r) => r.json())
      .then((d) => {
        setItems(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (kategori === "Semua") return items;
    return items.filter((i) => i.kategori === kategori);
  }, [items, kategori]);

  const openLightbox = (index: number) => {
    setSlideDir(null);
    setLbIndex(index);
  };

  const closeLightbox = () => setLbIndex(null);

  const goPrev = useCallback(() => {
    setSlideDir("right");
    setLbIndex((prev) =>
      prev === null ? null : (prev - 1 + filtered.length) % filtered.length
    );
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setSlideDir("left");
    setLbIndex((prev) =>
      prev === null ? null : (prev + 1) % filtered.length
    );
  }, [filtered.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lbIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lbIndex, goPrev, goNext]);

  const allKategori = ["Semua", ...KATEGORI_GALERI];
  const lbItem = lbIndex !== null ? filtered[lbIndex] : null;

  const slideClass =
    slideDir === "left"
      ? "g-slide-left"
      : slideDir === "right"
      ? "g-slide-right"
      : "lb-open";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <style>{KEYFRAMES}</style>
      <SectionHeader label="Dokumentasi Kegiatan" title="Galeri Foto" />

      {/* Filter kategori */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allKategori.map((k) => (
          <button
            key={k}
            onClick={() => setKategori(k)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
              kategori === k
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBox key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      )}

      {/* Grid foto */}
      {!loading && filtered.length > 0 && (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="g-fade-in relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group"
              style={{ animationDelay: `${Math.min(idx * 55, 420)}ms` }}
            >
              <Image
                src={item.image_url}
                alt={item.judul}
                width={400}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <ZoomIn
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-[12px] font-semibold line-clamp-1">
                  {item.judul}
                </p>
                <p className="text-white/70 text-[11px]">{item.kategori}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Belum ada foto</p>
          <p className="text-sm mt-1">Foto kegiatan akan ditampilkan di sini</p>
        </div>
      )}

      {/* Lightbox */}
      {lbItem && lbIndex !== null && (
        <div
          className="lb-bg-in fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="lb-open relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tutup */}
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Counter */}
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/40 text-white text-[11px] font-semibold tabular-nums">
              {lbIndex + 1} / {filtered.length}
            </div>

            {/* Panah kiri */}
            {filtered.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 flex items-center justify-center text-white transition-colors"
                aria-label="Sebelumnya"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Panah kanan */}
            {filtered.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 flex items-center justify-center text-white transition-colors"
                aria-label="Berikutnya"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Gambar — key berubah tiap slide supaya animasi trigger ulang */}
            <div
              key={lbIndex}
              className={`relative w-full aspect-video ${slideClass}`}
            >
              <Image
                src={lbItem.image_url}
                alt={lbItem.judul}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                  {lbItem.kategori}
                </span>
                <span className="text-[12px] text-gray-400">
                  {new Date(lbItem.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-[15px]">
                {lbItem.judul}
              </h3>
              {lbItem.deskripsi && (
                <p className="text-[13px] text-gray-600 mt-1">
                  {lbItem.deskripsi}
                </p>
              )}
            </div>

            {/* Dot indicator */}
            {filtered.length > 1 && filtered.length <= 20 && (
              <div className="flex justify-center gap-1.5 pb-4">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSlideDir(i > lbIndex ? "left" : "right");
                      setLbIndex(i);
                    }}
                    className={`rounded-full transition-all duration-200 ${
                      i === lbIndex
                        ? "w-4 h-1.5 bg-amber-500"
                        : "w-1.5 h-1.5 bg-gray-300 hover:bg-amber-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
