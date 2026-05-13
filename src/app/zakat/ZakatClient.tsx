"use client";

import { useState } from "react";
import { Calculator, Info } from "lucide-react";

type Tab = "maal" | "penghasilan" | "fitrah";

const TABS: { id: Tab; label: string }[] = [
  { id: "maal",        label: "Zakat Maal"        },
  { id: "penghasilan", label: "Zakat Penghasilan"  },
  { id: "fitrah",      label: "Zakat Fitrah"       },
];

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function InputField({
  label, value, onChange, prefix, hint,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  prefix?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-semibold text-gray-700">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 bg-white">
        {prefix && (
          <span className="px-3 text-[13px] text-gray-400 bg-gray-50 border-r border-gray-200 py-2.5 shrink-0">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-[14px] text-gray-800 outline-none bg-white"
          placeholder="0"
        />
      </div>
      {hint && <p className="text-[11.5px] text-gray-400 leading-snug">{hint}</p>}
    </div>
  );
}

function ResultCard({ wajib, jumlah, info }: { wajib: boolean | null; jumlah: number; info: string }) {
  if (wajib === null) return null;
  return (
    <div className={`rounded-2xl p-4 border ${wajib ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${wajib ? "bg-amber-500" : "bg-gray-400"}`} />
        <p className={`text-[13px] font-bold ${wajib ? "text-amber-700" : "text-gray-500"}`}>
          {wajib ? "Wajib Zakat" : "Belum Wajib Zakat"}
        </p>
      </div>
      {wajib && (
        <p className="text-2xl font-bold text-gray-900 mb-1">{formatRp(jumlah)}</p>
      )}
      <p className="text-[12.5px] text-gray-500 leading-relaxed">{info}</p>
    </div>
  );
}

/* ── Zakat Maal ── */
function ZakatMaal() {
  const [harta,      setHarta]      = useState("");
  const [hargaEmas,  setHargaEmas]  = useState("1900000");

  const hartaNum     = parseFloat(harta)     || 0;
  const hargaNum     = parseFloat(hargaEmas) || 0;
  const nisab        = 85 * hargaNum;
  const wajib        = hartaNum > 0 && hartaNum >= nisab ? true : hartaNum > 0 ? false : null;
  const jumlah       = wajib ? hartaNum * 0.025 : 0;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex gap-2">
        <Info size={14} className="text-blue-400 shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-[12.5px] text-blue-700 leading-relaxed">
          Nisab zakat maal = 85 gram emas. Kadar zakat 2,5% dari total harta yang telah mencapai haul (1 tahun).
        </p>
      </div>
      <InputField
        label="Total Harta (tabungan, investasi, piutang)"
        value={harta} onChange={setHarta}
        prefix="Rp"
        hint="Masukkan total harta bersih yang dimiliki selama 1 tahun penuh"
      />
      <InputField
        label="Harga Emas per Gram (saat ini)"
        value={hargaEmas} onChange={setHargaEmas}
        prefix="Rp"
        hint={`Nisab saat ini: ${formatRp(nisab)} (85g × ${formatRp(hargaNum)})`}
      />
      <ResultCard
        wajib={wajib}
        jumlah={jumlah}
        info={
          wajib === true
            ? `Harta Rp ${hartaNum.toLocaleString("id-ID")} ≥ nisab ${formatRp(nisab)}, zakat yang harus dibayarkan: 2,5%`
            : wajib === false
            ? `Harta Rp ${hartaNum.toLocaleString("id-ID")} masih di bawah nisab ${formatRp(nisab)}`
            : "Masukkan total harta untuk menghitung"
        }
      />
    </div>
  );
}

/* ── Zakat Penghasilan ── */
function ZakatPenghasilan() {
  const [gaji,      setGaji]      = useState("");
  const [hargaEmas, setHargaEmas] = useState("1900000");
  const [mode,      setMode]      = useState<"bulanan" | "tahunan">("bulanan");

  const gajiNum    = parseFloat(gaji)      || 0;
  const hargaNum   = parseFloat(hargaEmas) || 0;
  const nisabTahun = 85 * hargaNum;
  const nisabBulan = nisabTahun / 12;
  const gajiTahun  = mode === "bulanan" ? gajiNum * 12 : gajiNum;
  const wajib      = gajiNum > 0 && gajiTahun >= nisabTahun ? true : gajiNum > 0 ? false : null;
  const zakatPerBulan = wajib ? (mode === "bulanan" ? gajiNum : gajiNum / 12) * 0.025 : 0;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex gap-2">
        <Info size={14} className="text-blue-400 shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-[12.5px] text-blue-700 leading-relaxed">
          Zakat penghasilan wajib jika penghasilan setahun ≥ nisab (85g emas). Kadar 2,5% per bulan atau per tahun.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["bulanan", "tahunan"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors ${
              mode === m ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {m === "bulanan" ? "Per Bulan" : "Per Tahun"}
          </button>
        ))}
      </div>

      <InputField
        label={mode === "bulanan" ? "Penghasilan Bulanan" : "Penghasilan Tahunan"}
        value={gaji} onChange={setGaji}
        prefix="Rp"
        hint={
          mode === "bulanan"
            ? `Nisab per bulan: ${formatRp(nisabBulan)}`
            : `Nisab per tahun: ${formatRp(nisabTahun)}`
        }
      />
      <InputField
        label="Harga Emas per Gram (saat ini)"
        value={hargaEmas} onChange={setHargaEmas}
        prefix="Rp"
      />
      <ResultCard
        wajib={wajib}
        jumlah={zakatPerBulan}
        info={
          wajib === true
            ? `Zakat yang dibayar ${mode === "bulanan" ? "per bulan" : "per tahun"}: 2,5% × ${formatRp(mode === "bulanan" ? gajiNum : gajiNum)}`
            : wajib === false
            ? `Penghasilan setahun ${formatRp(gajiTahun)} masih di bawah nisab ${formatRp(nisabTahun)}`
            : "Masukkan penghasilan untuk menghitung"
        }
      />
    </div>
  );
}

/* ── Zakat Fitrah ── */
function ZakatFitrah() {
  const [jiwa,        setJiwa]        = useState("1");
  const [hargaBeras,  setHargaBeras]  = useState("15000");
  const [metode,      setMetode]      = useState<"beras" | "uang">("uang");

  const jiwaNum       = parseInt(jiwa)       || 0;
  const hargaNum      = parseFloat(hargaBeras) || 0;
  const berasKg       = 2.5;
  const zakatPerJiwa  = metode === "beras" ? berasKg : berasKg * hargaNum;
  const totalZakat    = jiwaNum * zakatPerJiwa;
  const wajib         = jiwaNum > 0 ? true : null;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex gap-2">
        <Info size={14} className="text-blue-400 shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-[12.5px] text-blue-700 leading-relaxed">
          Zakat fitrah wajib dikeluarkan setiap jiwa sebesar 1 sha' (±2,5 kg beras) atau diuangkan sesuai harga beras setempat.
        </p>
      </div>

      {/* Metode toggle */}
      <div className="flex gap-2">
        {(["uang", "beras"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetode(m)}
            className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors ${
              metode === m ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {m === "uang" ? "Dalam Uang" : "Dalam Beras"}
          </button>
        ))}
      </div>

      <InputField
        label="Jumlah Jiwa (tanggungan)"
        value={jiwa} onChange={setJiwa}
        hint="Hitung semua anggota keluarga yang menjadi tanggungan"
      />
      {metode === "uang" && (
        <InputField
          label="Harga Beras per Kg"
          value={hargaBeras} onChange={setHargaBeras}
          prefix="Rp"
          hint="Gunakan harga beras kualitas sedang yang biasa dikonsumsi"
        />
      )}

      {wajib && (
        <div className="rounded-2xl p-4 border bg-amber-50 border-amber-200 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <p className="text-[13px] font-bold text-amber-700">Wajib Zakat Fitrah</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-amber-100">
              <p className="text-[11px] text-gray-400 mb-0.5">Per Jiwa</p>
              <p className="text-[15px] font-bold text-gray-800">
                {metode === "beras" ? `${berasKg} kg` : formatRp(zakatPerJiwa)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-100">
              <p className="text-[11px] text-gray-400 mb-0.5">Total ({jiwaNum} jiwa)</p>
              <p className="text-[15px] font-bold text-gray-800">
                {metode === "beras" ? `${totalZakat} kg` : formatRp(totalZakat)}
              </p>
            </div>
          </div>
          <p className="text-[12px] text-gray-500">
            Dibayarkan sebelum shalat Idul Fitri, paling lambat malam takbiran.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main ── */
export default function ZakatClient() {
  const [tab, setTab] = useState<Tab>("maal");

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 mb-4">
          <Calculator size={22} className="text-amber-600" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Kalkulator Zakat</h1>
        <p className="text-[13.5px] text-gray-400 max-w-sm mx-auto leading-relaxed">
          Hitung kewajiban zakat Anda dengan mudah. Pilih jenis zakat di bawah ini.
        </p>
      </div>

      {/* Tab */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-[12.5px] font-semibold transition-all ${
              tab === t.id
                ? "bg-white text-amber-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        {tab === "maal"        && <ZakatMaal />}
        {tab === "penghasilan" && <ZakatPenghasilan />}
        {tab === "fitrah"      && <ZakatFitrah />}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[11.5px] text-gray-400 mt-5 leading-relaxed">
        Perhitungan ini bersifat indikatif. Untuk kepastian hukum, konsultasikan dengan ustadz atau lembaga zakat terpercaya.
      </p>
    </div>
  );
}
