import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import Sidebar from "@/components/Sidebar/page";
import Footer from "@/components/Footer/page";
import { beritaList, getBeritaBySlug, type BeritaItem } from "../data";

// ─── STATIC PARAMS ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return beritaList.map((b) => ({ slug: b.slug }));
}

// ─── METADATA ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = getBeritaBySlug(slug);
  if (!berita) return { title: "Berita Tidak Ditemukan" };
  return {
    title: `${berita.judul} | Masjid Al-Hidayah`,
    description: berita.ringkasan,
  };
}

// ─── CONTENT RENDERER ─────────────────────────────────────────────────────────
function RenderKonten({ berita }: { berita: BeritaItem }) {
  return (
    <div className="space-y-5 text-gray-700 text-[15px] leading-relaxed">
      {berita.konten.map((block, i) => {
        if (block.type === "p") {
          return <p key={i}>{block.text}</p>;
        }
        if (block.type === "h3") {
          return (
            <h3 key={i} className="text-[17px] font-bold text-gray-900 pt-2">
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "callout") {
          return (
            <div
              key={i}
              className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-[13.5px] text-amber-800 leading-relaxed"
            >
              {block.text}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = getBeritaBySlug(slug);
  if (!berita) notFound();

  const lainnya = beritaList.filter((b) => b.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <Sidebar />
      <div className="pt-[65px]">
        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* ── BACK ── */}
          <Link
            href="/#berita"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-amber-600 transition-colors mb-8 group"
          >
            <ArrowLeft
              size={15}
              strokeWidth={2.5}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Kembali ke Beranda
          </Link>

          {/* ── ARTICLE CARD ── */}
          <article className="bg-white rounded-3xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-7 pt-8 pb-6 border-b border-gray-100">
              {/* Badge + date */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${berita.badgeBg}`}
                >
                  <Tag size={10} strokeWidth={2.5} />
                  {berita.kategori}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  <CalendarDays size={13} strokeWidth={1.8} />
                  {berita.tanggal}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[22px] font-bold text-gray-900 leading-snug">
                {berita.judul}
              </h1>

              {/* Ringkasan */}
              <p className="mt-3 text-[13.5px] text-gray-500 leading-relaxed">
                {berita.ringkasan}
              </p>
            </div>

            {/* Body */}
            <div className="px-7 py-7">
              <RenderKonten berita={berita} />
            </div>
          </article>

          {/* ── BERITA LAINNYA ── */}
          {lainnya.length > 0 && (
            <div className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Berita Lainnya
              </p>
              <div className="space-y-3">
                {lainnya.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/berita/${b.slug}`}
                    className="group flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm border border-transparent hover:border-amber-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${b.labelColor}`}
                      >
                        {b.kategori}
                      </span>
                      <p className="text-[13.5px] font-semibold text-gray-800 group-hover:text-amber-800 transition-colors leading-snug mt-0.5 truncate">
                        {b.judul}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">{b.tanggal}</p>
                    </div>
                    <ArrowLeft
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 rotate-180 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
