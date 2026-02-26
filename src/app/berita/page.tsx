import Link from "next/link";
import { ArrowLeft, ChevronRight, CalendarDays, Newspaper } from "lucide-react";
import Sidebar from "@/components/Sidebar/page";
import Footer from "@/components/Footer/page";
import { beritaList } from "./data";

export const metadata = {
  title: "Berita & Pengumuman | Masjid Al-Hidayah",
  description:
    "Informasi terkini seputar kegiatan dan pengumuman Masjid Al-Hidayah Ketintang Surabaya.",
};

export default function BeritaListPage() {
  const [featured, ...others] = beritaList;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F1ECE3]">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-52 h-64 w-64 rounded-full bg-orange-100/70 blur-3xl" />

      <Sidebar />

      <main className="relative pt-[65px]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/#berita"
            className="group mb-8 inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-white/80 px-4 py-2 text-[13px] font-medium text-gray-600 backdrop-blur transition-colors hover:text-amber-700"
          >
            <ArrowLeft
              size={15}
              strokeWidth={2.5}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Kembali ke Beranda
          </Link>

          <section className="mb-8 rounded-3xl border border-amber-100 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-8">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              Informasi Terkini
            </p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-[34px]">
                  Berita &amp; Pengumuman
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-[15px]">
                  Update agenda, program, dan pengumuman penting Masjid Al-Hidayah
                  untuk jamaah.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2.5 text-amber-700">
                <Newspaper size={16} strokeWidth={2.2} />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {beritaList.length} Update
                </span>
              </div>
            </div>
          </section>

          {featured ? (
            <Link
              href={`/berita/${featured.slug}`}
              className="group relative mb-5 block overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10.5px] font-bold uppercase tracking-widest ${featured.labelColor}`}
                >
                  <span
                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-sm ${featured.dotColor}`}
                  />
                  {featured.kategori}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <CalendarDays size={12} strokeWidth={1.8} />
                  {featured.tanggal}
                </span>
              </div>

              <h2 className="max-w-3xl text-[20px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-800 sm:text-[24px]">
                {featured.judul}
              </h2>
              <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-gray-600 sm:text-[14px]">
                {featured.ringkasan}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-amber-700">
                Baca Selengkapnya
                <ChevronRight
                  size={16}
                  strokeWidth={2.3}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ) : null}

          <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {others.map((b) => (
              <Link
                key={b.slug}
                href={`/berita/${b.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm transition-all duration-200 hover:border-amber-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span
                    className={`text-[10.5px] font-bold uppercase tracking-widest ${b.labelColor}`}
                  >
                    <span
                      className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-sm ${b.dotColor}`}
                    />
                    {b.kategori}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <CalendarDays size={12} strokeWidth={1.8} />
                    {b.tanggal}
                  </span>
                </div>

                <h3 className="mb-1.5 text-[15px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-800">
                  {b.judul}
                </h3>
                <p className="line-clamp-2 text-[12.5px] leading-relaxed text-gray-500">
                  {b.ringkasan}
                </p>

                <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 transition-colors group-hover:text-amber-600">
                  Detail
                  <ChevronRight
                    size={14}
                    strokeWidth={2.2}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
