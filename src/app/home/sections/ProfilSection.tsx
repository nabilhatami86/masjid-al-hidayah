import { Building2, Star, Check } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { PENGURUS, MISI_LIST } from "../constants";

export default function ProfilSection() {
  return (
    <section id="profil" className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="Tentang Kami" title="Masjid Al-Hidayah" center />

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {/* Sejarah */}
          <div className="rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Building2 size={17} className="text-stone-400" strokeWidth={1.7} />
              <h3 className="font-semibold text-[15px] text-gray-800">Sejarah Singkat</h3>
            </div>
            <p className="text-[13.5px] text-gray-600 leading-relaxed mb-3">
              Masjid Al-Hidayah berdiri sejak tahun 1985 atas prakarsa warga
              Ketintang Baru XV sebagai pusat kegiatan keislaman di kawasan
              Gayungan, Surabaya. Berawal dari mushola sederhana, kini hadir
              sebagai masjid yang megah dengan berbagai fasilitas modern.
            </p>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              Selama lebih dari 39 tahun, masjid ini menjadi jangkar spiritual
              ribuan jamaah, menyelenggarakan pendidikan, kajian, dan kegiatan
              sosial kemasyarakatan.
            </p>
          </div>

          {/* Visi & Misi */}
          <div className="rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Star size={17} className="text-stone-400" strokeWidth={1.7} />
              <h3 className="font-semibold text-[15px] text-gray-800">Visi &amp; Misi</h3>
            </div>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.18em] mb-1.5">Visi</p>
            <p className="text-[13.5px] text-gray-700 font-medium mb-5 leading-relaxed">
              Menjadi pusat keislaman yang maju, inklusif, dan memberdayakan
              umat menuju kehidupan baldatun thayyibatun wa rabbun ghafur.
            </p>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.18em] mb-2.5">Misi</p>
            <ul className="space-y-2">
              {MISI_LIST.map((m) => (
                <li key={m} className="flex items-start gap-2 text-[13px] text-gray-600">
                  <Check size={13} className="text-amber-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pengurus */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {PENGURUS.map((p, i) => (
            <div key={p.nama} className="px-6 py-5">
              <p className="text-[10.5px] font-bold text-stone-400 uppercase tracking-[0.18em] mb-2">
                {p.jabatan}
              </p>
              <p className="font-bold text-[15px] text-gray-900 mb-1">{p.nama}</p>
              <p className="text-[12.5px] text-gray-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
