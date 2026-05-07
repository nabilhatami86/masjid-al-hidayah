import Image from "next/image";
import SectionHeader from "../shared/SectionHeader";
import type { Program } from "../types";

interface Props {
  programs: Program[];
}

export default function ProgramSection({ programs }: Props) {
  return (
    <section id="program" className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="Program Kami" title="Program Unggulan" center />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {programs.map((program) => (
            <div
              key={program.title}
              className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <Image
                src={program.image}
                alt={program.title}
                fill
                className={`object-cover ${program.objectPos} group-hover:scale-105 transition-transform duration-500`}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-white text-[17px] font-bold">{program.title}</h3>
                <p className="text-white/75 text-[12px] mt-1 leading-snug">{program.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
