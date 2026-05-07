import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="pt-[65px]">
      <div className="relative w-full h-170 md:h-215">
        <Image
          src="/background.png"
          alt="Masjid Al-Hidayah"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-36 md:pb-48 px-4 text-center">
          <p className="text-amber-300 font-semibold text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
            Ketintang Baru XV No.20 · Surabaya
          </p>
          <h1 className="text-white font-bold text-4xl md:text-6xl mb-4 drop-shadow-lg">
            Masjid Al-Hidayah
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
            Pusat Kegiatan Keislaman &amp; Pemberdayaan Umat
          </p>
          <div className="flex gap-3 mt-7 flex-wrap justify-center">
            <a
              href="#kajian"
              className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
            >
              Jadwal Kegiatan
            </a>
            <a
              href="#contact"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors border border-white/30"
            >
              Donasi Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
