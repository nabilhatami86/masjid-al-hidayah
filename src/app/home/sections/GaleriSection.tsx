import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { GaleriItem } from "@/lib/controllers/galeriController";
import SectionHeader from "../shared/SectionHeader";

interface Props {
  galeriList: GaleriItem[];
}

export default function GaleriSection({ galeriList }: Props) {
  if (galeriList.length === 0) return null;

  const items = galeriList.slice(0, 6);

  return (
    <section id="galeri" className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader label="Dokumentasi" title="Galeri Foto" />
          <Link
            href="/galeri"
            className="text-[13px] text-amber-600 font-semibold hover:underline hidden sm:flex items-center gap-0.5 mb-1"
          >
            Lihat semua <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href="/galeri"
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden block bg-gray-200"
            >
              <Image
                src={item.image_url}
                alt={item.judul}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute inset-x-0 bottom-0 p-3 text-white text-[11.5px] font-semibold leading-snug line-clamp-2 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {item.judul}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex sm:hidden justify-center">
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
  );
}
