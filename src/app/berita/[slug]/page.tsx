import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import Sidebar from "@/components/Sidebar/page";
import Footer from "@/components/Footer/page";
import {
  getAllBerita, getBeritaBySlugDB,
  getBeritaColors, formatTanggalBerita,
} from "@/lib/controllers/beritaController";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const berita = await getBeritaBySlugDB(slug);
  if (!berita) return { title: "Berita Tidak Ditemukan" };
  return {
    title: `${berita.judul} | Masjid Al-Hidayah`,
    description: berita.ringkasan,
  };
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const berita = await getBeritaBySlugDB(slug);
  if (!berita) notFound();

  const colors = getBeritaColors(berita.kategori);
  const allBerita = await getAllBerita().catch(() => []);
  const lainnya = allBerita.filter((b) => b.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <Sidebar />
      <div className="pt-[97px]">
        <div className="max-w-2xl mx-auto px-4 py-10">

          <Link
            href="/#berita"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-amber-600 transition-colors mb-8 group"
          >
            <ArrowLeft size={15} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Beranda
          </Link>

          <article className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="px-7 pt-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${colors.badgeBg}`}>
                  <Tag size={10} strokeWidth={2.5} />
                  {berita.kategori}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  <CalendarDays size={13} strokeWidth={1.8} />
                  {formatTanggalBerita(berita.tanggal)}
                </span>
              </div>
              <h1 className="text-[22px] font-bold text-gray-900 leading-snug">{berita.judul}</h1>
              <p className="mt-3 text-[13.5px] text-gray-500 leading-relaxed">{berita.ringkasan}</p>
            </div>

            <div className="px-7 py-7">
              <div className="space-y-4 text-gray-700 text-[15px] leading-relaxed">
                {berita.konten.split("\n\n").filter(Boolean).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">{para}</p>
                ))}
              </div>
            </div>
          </article>

          {lainnya.length > 0 && (
            <div className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Berita Lainnya
              </p>
              <div className="space-y-3">
                {lainnya.map((b) => {
                  const bc = getBeritaColors(b.kategori);
                  return (
                    <Link
                      key={b.id}
                      href={`/berita/${b.slug}`}
                      className="group flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm border border-transparent hover:border-amber-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${bc.labelColor}`}>
                          {b.kategori}
                        </span>
                        <p className="text-[13.5px] font-semibold text-gray-800 group-hover:text-amber-800 transition-colors leading-snug mt-0.5 truncate">
                          {b.judul}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">{formatTanggalBerita(b.tanggal)}</p>
                      </div>
                      <ArrowLeft
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 rotate-180 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
