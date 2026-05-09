"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import SectionHeader from "@/components/global/SectionHeader";
import SkeletonBox from "@/components/global/SkeletonBox";
import { KATEGORI_GALERI } from "@/lib/controllers/galeriController";
import type { GaleriItem } from "@/lib/controllers/galeriController";

export default function GaleriClient() {
  const [items, setItems]           = useState<GaleriItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [kategori, setKategori]     = useState<string>("Semua");
  const [lightbox, setLightbox]     = useState<GaleriItem | null>(null);

  useEffect(() => {
    fetch("/api/galeri")
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (kategori === "Semua") return items;
    return items.filter((i) => i.kategori === kategori);
  }, [items, kategori]);

  // tutup lightbox dengan Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const allKategori = ["Semua", ...KATEGORI_GALERI];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
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
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightbox(item)}
              className="relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group"
            >
              <Image
                src={item.image_url}
                alt={item.judul}
                width={400}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[12px] font-semibold line-clamp-1">{item.judul}</p>
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
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="relative w-full aspect-video">
              <Image
                src={lightbox.image_url}
                alt={lightbox.judul}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                  {lightbox.kategori}
                </span>
                <span className="text-[12px] text-gray-400">
                  {new Date(lightbox.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-[15px]">{lightbox.judul}</h3>
              {lightbox.deskripsi && (
                <p className="text-[13px] text-gray-600 mt-1">{lightbox.deskripsi}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
