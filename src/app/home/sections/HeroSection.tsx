import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="pt-[97px]">
      <div className="relative w-full h-170 md:h-215">
        <Image
          src="/background.png"
          alt="Masjid Al-Hidayah"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-36 md:pb-48 px-4 text-center">
          <p className="text-white/50 font-medium text-xs md:text-sm uppercase tracking-[0.3em] mb-3">
            Ketintang Baru XV · Surabaya
          </p>
          <h1 className="text-white font-bold text-[38px] md:text-[60px] tracking-tight mb-3">
            Masjid Al-Hidayah
          </h1>
          <p className="text-white/65 text-[14px] md:text-base max-w-md leading-relaxed">
            Pusat Kegiatan Keislaman &amp; Pemberdayaan Umat
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a
              href="#kajian"
              className="bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-full text-[13.5px] transition-all hover:bg-white/90"
            >
              Jadwal Kegiatan
            </a>
            <a
              href="#contact"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-6 py-2.5 rounded-full text-[13.5px] transition-all border border-white/20"
            >
              Donasi Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
