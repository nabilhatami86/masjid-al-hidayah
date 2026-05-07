import { Building2, Star, User, Check } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { PENGURUS, MISI_LIST } from "../constants";

export default function ProfilSection() {
  return (
    <section id="profil" className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="Tentang Kami" title="Masjid Al-Hidayah" center />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Sejarah */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Building2 size={18} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-[16px] text-gray-900">Sejarah Singkat</h3>
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
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star size={18} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-[16px] text-gray-900">Visi &amp; Misi</h3>
            </div>
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">Visi</p>
            <p className="text-[13.5px] text-gray-700 font-medium mb-4 leading-relaxed">
              Menjadi pusat keislaman yang maju, inklusif, dan memberdayakan
              umat menuju kehidupan baldatun thayyibatun wa rabbun ghafur.
            </p>
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2">Misi</p>
            <ul className="space-y-1.5">
              {MISI_LIST.map((m) => (
                <li key={m} className="flex items-start gap-2 text-[13px] text-gray-600">
                  <Check size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pengurus */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PENGURUS.map((p) => (
            <div key={p.nama} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <User size={28} className="text-amber-700" />
              </div>
              <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
                {p.jabatan}
              </p>
              <p className="font-bold text-[14px] text-gray-900">{p.nama}</p>
              <p className="text-[12px] text-gray-500 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
