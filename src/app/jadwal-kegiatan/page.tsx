import { getAllJadwal } from "@/lib/controllers/jadwalController";
import PageWrapper from "@/components/global/PageWrapper";
import { CalendarDays, Clock } from "lucide-react";

export const metadata = {
  title: "Jadwal Kegiatan | Masjid Al-Hidayah",
  description: "Jadwal kegiatan dan agenda Masjid Al-Hidayah Ketintang Surabaya.",
};

export const dynamic = "force-dynamic";

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_ID   = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

const BADGE: Record<string, string> = {
  "Khutbah Jumat":   "bg-amber-100 text-amber-700",
  "Kajian Sabtu":    "bg-blue-100 text-blue-700",
  "Kajian":          "bg-blue-100 text-blue-700",
  "Tahsin Al-Qur'an":"bg-emerald-100 text-emerald-700",
  "Tahsin":          "bg-emerald-100 text-emerald-700",
  "TPA Al-Hidayah":  "bg-purple-100 text-purple-700",
  "Pengajian":       "bg-blue-100 text-blue-700",
};

function badgeClass(jenis: string) {
  return BADGE[jenis] ?? "bg-gray-100 text-gray-600";
}

export default async function JadwalKegiatanPage() {
  const today = new Date().toISOString().slice(0, 10);
  const allJadwal = await getAllJadwal().catch(() => []);
  const upcoming  = allJadwal.filter((j) => j.tanggal >= today);
  const past      = allJadwal.filter((j) => j.tanggal < today).slice(0, 10);

  function renderCard(j: typeof allJadwal[0], isPast = false) {
    const d = new Date(j.tanggal + "T00:00:00");
    return (
      <div
        key={j.id}
        className={`border rounded-2xl p-4 transition-shadow hover:shadow-md ${
          isPast ? "border-gray-100 bg-white opacity-60" : "border-gray-100 bg-white"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${badgeClass(j.jenisKegiatan)}`}>
            {j.jenisKegiatan}
          </span>
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Clock size={11} /> {j.waktu} WIB
          </span>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center shrink-0">
            <span className="text-[16px] font-bold text-amber-600 leading-none">{d.getDate()}</span>
            <span className="text-[9px] text-amber-400 uppercase font-semibold">
              {MONTHS_ID[d.getMonth()].slice(0, 3)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-bold text-gray-800 leading-snug">{j.topik}</p>
            <p className="text-[12px] text-gray-500 mt-1">
              {DAYS_ID[d.getDay()]} · {j.khatibNama || "Pengurus Masjid"}
            </p>
            {j.keterangan && (
              <p className="text-[11px] text-gray-400 mt-1 italic">{j.keterangan}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            <CalendarDays size={13} />
            Agenda Masjid
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Kegiatan</h1>
          <div className="w-12 h-1 bg-amber-400 rounded-full mt-3" />
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
            Belum ada jadwal kegiatan mendatang.
          </div>
        ) : (
          <>
            <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Mendatang
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {upcoming.map((j) => renderCard(j))}
            </div>
          </>
        )}

        {past.length > 0 && (
          <>
            <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Sudah Berlalu
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map((j) => renderCard(j, true))}
            </div>
          </>
        )}

        <p className="text-center text-[12px] text-gray-400 mt-8">
          Jadwal dapat berubah sewaktu-waktu · Pantau pengumuman di masjid
        </p>
      </div>
    </PageWrapper>
  );
}
