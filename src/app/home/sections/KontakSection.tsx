import Link from "next/link";
import { Settings } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import DonasiSection from "../DonasiSection";
import { KONTAK_LIST } from "../constants";

export default function KontakSection() {
  return (
    <section id="contact" className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="Bersama Membangun Masjid" title="Donasi & Hubungi Kami" center />
        <div className="grid md:grid-cols-2 gap-6">
          <DonasiSection />

          <div className="space-y-3">
            {KONTAK_LIST.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-4 items-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {c.label}
                    </p>
                    <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
                      {c.value}
                    </p>
                  </div>
                </div>
              );
            })}

            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-[13px] text-gray-400 hover:border-amber-300 hover:text-amber-600 transition-colors"
            >
              <Settings size={16} />
              Panel Admin Masjid
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
