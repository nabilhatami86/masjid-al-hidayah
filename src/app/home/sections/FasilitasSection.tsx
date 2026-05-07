import SectionHeader from "../shared/SectionHeader";
import { FASILITAS } from "../constants";

export default function FasilitasSection() {
  return (
    <section id="fasilitas" className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="Sarana & Prasarana" title="Fasilitas Masjid" center />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {FASILITAS.map((f) => (
            <div
              key={f.title}
              className="bg-gray-50 rounded-2xl p-5 hover:shadow-sm transition-shadow border border-gray-100"
            >
              <div className="mb-3">
                <f.icon size={28} className="text-amber-600" />
              </div>
              <h4 className="font-bold text-[14px] text-gray-900 mb-1">{f.title}</h4>
              <p className="text-[12px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
