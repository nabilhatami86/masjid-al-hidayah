import SectionHeader from "../shared/SectionHeader";
import { FASILITAS } from "../constants";

export default function FasilitasSection() {
  return (
    <section id="fasilitas" className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="Sarana & Prasarana" title="Fasilitas Masjid" center />

        {/* Row 1 — 3 kolom setara */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
          {FASILITAS.slice(0, 3).map((f) => (
            <div key={f.title} className="bg-white px-6 py-5 hover:bg-gray-50/70 transition-colors">
              <f.icon size={22} className="text-stone-400 mb-3" strokeWidth={1.6} />
              <h4 className="font-semibold text-[14px] text-gray-800 mb-1">{f.title}</h4>
              <p className="text-[12.5px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Row 2 — 3 kolom setara */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 mt-3">
          {FASILITAS.slice(3).map((f) => (
            <div key={f.title} className="bg-white px-6 py-5 hover:bg-gray-50/70 transition-colors">
              <f.icon size={22} className="text-stone-400 mb-3" strokeWidth={1.6} />
              <h4 className="font-semibold text-[14px] text-gray-800 mb-1">{f.title}</h4>
              <p className="text-[12.5px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
