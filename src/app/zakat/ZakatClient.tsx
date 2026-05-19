"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Landmark, BriefcaseBusiness, Users, Info, BookOpen, HeartHandshake, ArrowRight } from "lucide-react";

type Tab = "maal" | "penghasilan" | "fitrah";

/* ── formatters ── */
function fmtNum(n: number): string {
  if (!n || isNaN(n)) return "0";
  return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function fmtRp(n: number): string { return "Rp " + fmtNum(n); }

// Tampilkan angka berformat saat user mengetik
function toDisplay(raw: string): string {
  if (!raw) return "";
  const clean = raw.replace(/\./g, "");
  const n = parseInt(clean, 10);
  return isNaN(n) ? "" : fmtNum(n);
}
function fromDisplay(display: string): string {
  return display.replace(/\./g, "").replace(/[^0-9]/g, "");
}

/* ── state types ── */
interface MaalState        { harta: string; hargaEmas: string }
interface PenghasilanState { gaji: string; hargaEmas: string; mode: "bulanan" | "tahunan" }
interface FitrahState      { jiwa: string; hargaBeras: string; metode: "uang" | "beras" }

/* ── CurrencyInput: input teks dengan format 1.000.000 ── */
function CurrencyInput({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[12.5px] font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 bg-white transition-all">
        <span className="px-3 h-11 flex items-center text-[13px] font-semibold text-stone-500 bg-stone-50 border-r border-stone-200 shrink-0">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={toDisplay(value)}
          onChange={(e) => onChange(fromDisplay(e.target.value))}
          placeholder="0"
          className="flex-1 px-3 h-11 text-[14px] font-semibold text-gray-900 outline-none bg-white placeholder:font-normal placeholder:text-stone-300"
        />
      </div>
      {hint && <p className="mt-1.5 text-[11.5px] text-stone-400">{hint}</p>}
    </div>
  );
}

function NumberInput({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[12.5px] font-medium text-gray-600 mb-1.5">{label}</label>
      <input
        type="number" min={1} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 h-11 text-[14px] font-semibold text-gray-900 bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="1"
      />
      {hint && <p className="mt-1.5 text-[11.5px] text-stone-400">{hint}</p>}
    </div>
  );
}

function Toggle<T extends string>({ options, value, onChange }: {
  options: { v: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex bg-stone-100 p-0.5 rounded-lg gap-0.5">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className={`px-4 py-1.5 rounded-md text-[12.5px] font-semibold transition-all ${
            value === o.v ? "bg-white text-gray-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function InfoBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-lg p-3">
      <Info size={14} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
      <p className="text-[12.5px] text-amber-800 leading-relaxed">{text}</p>
    </div>
  );
}

/* ── form sections ── */
function FormMaal({ s, set }: { s: MaalState; set: (v: Partial<MaalState>) => void }) {
  const hargaNum = parseFloat(s.hargaEmas) || 0;
  const nisab    = 85 * hargaNum;
  return (
    <div className="space-y-5">
      <InfoBox text="Zakat Maal dikenakan 2,5% dari total harta yang telah mencapai nisab dan dimiliki penuh selama 1 tahun (haul)." />
      <CurrencyInput
        label="Total harta bersih (tabungan, investasi, piutang, dll)"
        value={s.harta} onChange={(v) => set({ harta: v })}
        hint="Masukkan total harta yang sudah mencapai haul (1 tahun penuh)"
      />
      <CurrencyInput
        label="Harga emas per gram saat ini"
        value={s.hargaEmas} onChange={(v) => set({ hargaEmas: v })}
        hint={hargaNum > 0 ? `Nisab saat ini: ${fmtRp(nisab)} (85 gram emas)` : undefined}
      />
    </div>
  );
}

function FormPenghasilan({ s, set }: { s: PenghasilanState; set: (v: Partial<PenghasilanState>) => void }) {
  const hargaNum   = parseFloat(s.hargaEmas) || 0;
  const nisabTahun = 85 * hargaNum;
  return (
    <div className="space-y-5">
      <InfoBox text="Zakat penghasilan wajib jika pendapatan setahun ≥ nisab (85g emas). Dibayarkan 2,5% setiap bulan atau sekaligus per tahun." />
      <Toggle
        options={[{ v: "bulanan", label: "Per bulan" }, { v: "tahunan", label: "Per tahun" }]}
        value={s.mode} onChange={(v) => set({ mode: v })}
      />
      <CurrencyInput
        label={s.mode === "bulanan" ? "Penghasilan per bulan" : "Penghasilan per tahun"}
        value={s.gaji} onChange={(v) => set({ gaji: v })}
      />
      <CurrencyInput
        label="Harga emas per gram saat ini"
        value={s.hargaEmas} onChange={(v) => set({ hargaEmas: v })}
        hint={hargaNum > 0 ? `Nisab tahunan: ${fmtRp(nisabTahun)}` : undefined}
      />
    </div>
  );
}

function FormFitrah({ s, set }: { s: FitrahState; set: (v: Partial<FitrahState>) => void }) {
  const hargaNum = parseFloat(s.hargaBeras) || 0;
  const perJiwa  = 2.5 * hargaNum;
  return (
    <div className="space-y-5">
      <InfoBox text="Setiap jiwa wajib mengeluarkan 1 sha' (±2,5 kg beras) atau senilai uangnya. Dibayarkan sebelum shalat Idul Fitri." />
      <Toggle
        options={[{ v: "uang", label: "Dalam uang" }, { v: "beras", label: "Dalam beras" }]}
        value={s.metode} onChange={(v) => set({ metode: v })}
      />
      <NumberInput
        label="Jumlah jiwa tanggungan keluarga"
        value={s.jiwa} onChange={(v) => set({ jiwa: v })}
        hint="Termasuk diri sendiri dan semua anggota yang menjadi tanggungan"
      />
      {s.metode === "uang" && (
        <CurrencyInput
          label="Harga beras per kg"
          value={s.hargaBeras} onChange={(v) => set({ hargaBeras: v })}
          hint={perJiwa > 0 ? `Zakat per jiwa: ${fmtRp(perJiwa)}` : "Gunakan harga beras kualitas sedang"}
        />
      )}
    </div>
  );
}

/* ── compute result ── */
interface Hasil {
  wajib: boolean | null;
  zakat: number;
  zakatSub: string;
  rows: { label: string; value: string; bold?: boolean }[];
  catatan?: string;
  /* fitrah */
  fitrah?: boolean;
  perJiwa?: number | string;
  totalJiwa?: number;
  total?: number | string;
}

function computeHasil(tab: Tab, maal: MaalState, pg: PenghasilanState, ft: FitrahState): Hasil {
  if (tab === "maal") {
    const harta    = parseFloat(maal.harta)     || 0;
    const hargaE   = parseFloat(maal.hargaEmas) || 0;
    const nisab    = 85 * hargaE;
    const wajib    = harta <= 0 ? null : harta >= nisab;
    const zakat    = wajib ? harta * 0.025 : 0;
    return {
      wajib, zakat, zakatSub: "2,5% dari total harta bersih",
      rows: [
        { label: "Total Harta Bersih",        value: fmtRp(harta)           },
        { label: "Nisab (85 gram emas)",       value: fmtRp(nisab)           },
        { label: "Persentase Zakat",           value: "2,5%"                 },
        { label: "Zakat yang Harus Dibayarkan", value: fmtRp(zakat), bold: true },
      ],
      catatan: "Pastikan seluruh harta yang dizakati telah mencapai nisab dan dimiliki selama 1 tahun penuh.",
    };
  }
  if (tab === "penghasilan") {
    const gaji     = parseFloat(pg.gaji)      || 0;
    const hargaE   = parseFloat(pg.hargaEmas) || 0;
    const nisabT   = 85 * hargaE;
    const gajiT    = pg.mode === "bulanan" ? gaji * 12 : gaji;
    const gajiB    = pg.mode === "tahunan"  ? gaji / 12 : gaji;
    const wajib    = gaji <= 0 ? null : gajiT >= nisabT;
    const zakatB   = wajib ? gajiB * 0.025 : 0;
    return {
      wajib, zakat: zakatB, zakatSub: "per bulan (2,5%)",
      rows: [
        { label: "Penghasilan Bulanan",         value: fmtRp(gajiB)          },
        { label: "Penghasilan Tahunan",         value: fmtRp(gajiT)          },
        { label: "Nisab Tahunan (85g emas)",    value: fmtRp(nisabT)         },
        { label: "Persentase Zakat",            value: "2,5%"                },
        { label: "Zakat per Bulan",             value: fmtRp(zakatB), bold: true },
      ],
      catatan: "Zakat penghasilan dapat dibayarkan setiap bulan atau diakumulasikan setahun sekali.",
    };
  }
  /* fitrah */
  const jiwa    = parseInt(ft.jiwa)         || 0;
  const hargaB  = parseFloat(ft.hargaBeras) || 0;
  const berasKg = 2.5;
  const perJiwa = ft.metode === "beras" ? `${berasKg} kg` : fmtRp(berasKg * hargaB);
  const total   = ft.metode === "beras" ? `${berasKg * jiwa} kg` : fmtRp(berasKg * hargaB * jiwa);
  const totalNum = ft.metode === "uang" ? berasKg * hargaB * jiwa : 0;
  return {
    wajib: jiwa > 0 ? true : null,
    zakat: totalNum, zakatSub: `untuk ${jiwa} jiwa`,
    fitrah: true, perJiwa, totalJiwa: jiwa, total,
    rows: [
      { label: "Jumlah Jiwa",      value: `${jiwa} orang`  },
      { label: "Takaran per Jiwa", value: `${berasKg} kg beras` },
      { label: "Per Jiwa",         value: String(perJiwa)  },
      { label: "Total",            value: String(total), bold: true },
    ],
    catatan: "Dibayarkan paling lambat sebelum pelaksanaan shalat Idul Fitri.",
  };
}

/* ── right panel ── */
function PanelHasil({ h, tabLabel }: { h: Hasil; tabLabel: string }) {
  return (
    <div className="space-y-5">
      {/* Header panel */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-bold text-gray-800">Estimasi Zakat Anda</p>
        <span className="text-[10.5px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{tabLabel}</span>
      </div>

      {/* Angka besar */}
      <div>
        <p className="text-[32px] font-bold text-gray-900 leading-none tabular-nums">
          {h.wajib === null ? "Rp 0" : h.fitrah && h.total ? String(h.total) : fmtRp(h.zakat)}
        </p>
        {h.wajib !== null && (
          <p className="text-[12px] text-stone-500 mt-1">{h.zakatSub}</p>
        )}
      </div>

      {/* Status nisab */}
      {h.wajib !== null && !h.fitrah && (
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${
          h.wajib ? "bg-amber-50 border-amber-100" : "bg-stone-50 border-stone-200"
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            h.wajib ? "bg-amber-100" : "bg-stone-200"
          }`}>
            <span className="text-[14px]">{h.wajib ? "✓" : "✗"}</span>
          </div>
          <div>
            <p className={`text-[12.5px] font-bold ${h.wajib ? "text-amber-700" : "text-stone-600"}`}>
              {h.wajib ? "Sudah mencapai nisab" : "Belum mencapai nisab"}
            </p>
            <p className="text-[11.5px] text-stone-400 mt-0.5">
              {h.wajib ? "Anda wajib membayar zakat" : `Minimal harta: ${h.rows[1]?.value}`}
            </p>
          </div>
        </div>
      )}

      {/* Tabel breakdown */}
      {h.wajib !== null && (
        <div>
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.15em] mb-3">Informasi Perhitungan</p>
          <div className="space-y-2.5">
            {h.rows.map((row) => (
              <div key={row.label} className={`flex items-center justify-between ${row.bold ? "pt-2 border-t border-stone-100" : ""}`}>
                <span className={`text-[12px] ${row.bold ? "font-semibold text-gray-700" : "text-stone-500"}`}>{row.label}</span>
                <span className={`text-[12px] tabular-nums ${row.bold ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catatan */}
      {h.catatan && h.wajib !== null && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3">
          <Info size={13} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[11.5px] text-amber-800 leading-relaxed">{h.catatan}</p>
        </div>
      )}

      {/* Placeholder saat belum isi */}
      {h.wajib === null && (
        <div className="text-center py-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[18px] mx-auto mb-2">☪</div>
          <p className="text-[12px] text-stone-400">Isi form untuk melihat hasil perhitungan</p>
        </div>
      )}
    </div>
  );
}

/* ── tabs config ── */
const TABS: { id: Tab; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: "maal",        label: "Zakat Maal",       sub: "Harta & simpanan",   Icon: Landmark          },
  { id: "penghasilan", label: "Zakat Penghasilan", sub: "Gaji & honorarium",  Icon: BriefcaseBusiness },
  { id: "fitrah",      label: "Zakat Fitrah",      sub: "Per jiwa / kepala",  Icon: Users             },
];

/* ── bottom info cards ── */
const INFO_CARDS = [
  {
    icon: BookOpen,
    title: "Dasar Hukum",
    desc: "Zakat wajib dikeluarkan berdasarkan Al-Qur'an dan Hadis.",
    link: "Lihat Dalil",
  },
  {
    icon: Users,
    title: "Untuk Siapa Zakat?",
    desc: "Zakat diberikan kepada 8 golongan yang berhak menerima.",
    link: "Lihat Mustahik",
  },
  {
    icon: HeartHandshake,
    title: "Salurkan Zakat Anda",
    desc: "Tunaikan zakat melalui Masjid Al-Hidayah dengan mudah.",
    link: "Salurkan Sekarang",
  },
];

/* ── MAIN ── */
export default function ZakatClient() {
  const [tab, setTab] = useState<Tab>("maal");

  const [maal,        setMaalRaw]        = useState<MaalState>({ harta: "", hargaEmas: "1900000" });
  const [penghasilan, setPenghasilanRaw] = useState<PenghasilanState>({ gaji: "", hargaEmas: "1900000", mode: "bulanan" });
  const [fitrah,      setFitrahRaw]      = useState<FitrahState>({ jiwa: "1", hargaBeras: "15000", metode: "uang" });

  const setMaal        = (v: Partial<MaalState>)        => setMaalRaw(p        => ({ ...p, ...v }));
  const setPenghasilan = (v: Partial<PenghasilanState>) => setPenghasilanRaw(p => ({ ...p, ...v }));
  const setFitrah      = (v: Partial<FitrahState>)      => setFitrahRaw(p      => ({ ...p, ...v }));

  const activeTab  = TABS.find((t) => t.id === tab)!;
  const hasil      = computeHasil(tab, maal, penghasilan, fitrah);

  return (
    <div style={{ background: "#faf8f5" }} className="min-h-[calc(100vh-65px)]">

      {/* Page header */}
      <div className="bg-white border-b border-stone-200/60 relative overflow-hidden">
        {/* subtle geometric background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #92400e 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="max-w-5xl mx-auto px-6 py-7 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-5 text-[12px] text-stone-400">
            <Link href="/" className="hover:text-amber-600 transition-colors flex items-center gap-1">
              <Home size={12} strokeWidth={2} />
              Beranda
            </Link>
            <ChevronRight size={12} strokeWidth={2} className="text-stone-300" />
            <span className="text-stone-600 font-medium">Kalkulator Zakat</span>
          </div>
          {/* Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[22px] shrink-0">
              ☪
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Kalkulator Zakat</h1>
              <p className="text-[13px] text-stone-500 mt-0.5 max-w-lg leading-relaxed">
                Hitung kewajiban zakat maal, penghasilan, dan fitrah secara mudah sesuai syariat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-7">
        <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">

          {/* Kiri: Form */}
          <div className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden">

            {/* Tab bar */}
            <div className="grid grid-cols-3 border-b border-stone-100">
              {TABS.map((t) => {
                const TIcon = t.Icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2.5 px-4 py-3.5 text-left transition-colors relative border-r border-stone-100 last:border-r-0 ${
                      active ? "bg-white" : "bg-stone-50/50 hover:bg-stone-50"
                    }`}
                  >
                    <TIcon size={16} strokeWidth={1.8} className={active ? "text-amber-600" : "text-stone-400"} />
                    <div className="min-w-0">
                      <p className={`text-[12.5px] font-semibold leading-tight truncate ${active ? "text-gray-900" : "text-stone-400"}`}>
                        {t.label}
                      </p>
                      <p className="text-[10.5px] text-stone-400 mt-0.5 hidden sm:block">{t.sub}</p>
                    </div>
                    {active && <div className="absolute bottom-0 inset-x-0 h-[2px] bg-amber-500" />}
                  </button>
                );
              })}
            </div>

            {/* Form body */}
            <div className="p-6">
              {tab === "maal"        && <FormMaal        s={maal}        set={setMaal}        />}
              {tab === "penghasilan" && <FormPenghasilan s={penghasilan} set={setPenghasilan} />}
              {tab === "fitrah"      && <FormFitrah      s={fitrah}      set={setFitrah}      />}
            </div>
          </div>

          {/* Kanan: Result sticky */}
          <div className="lg:sticky lg:top-[80px]">
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
              <PanelHasil h={hasil} tabLabel={activeTab.label} />
            </div>
            <p className="text-[11px] text-stone-400 mt-3 px-1 leading-relaxed">
              * Hasil bersifat estimasi. Konsultasikan dengan ustadz atau lembaga zakat terpercaya.
            </p>
          </div>
        </div>

        {/* Bottom info cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {INFO_CARDS.map((card) => {
            const CardIcon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-2xl border border-stone-200/60 p-5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3">
                  <CardIcon size={16} className="text-amber-600" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[14px] text-gray-800 mb-1">{card.title}</h3>
                <p className="text-[12.5px] text-stone-500 leading-relaxed mb-3">{card.desc}</p>
                <button className="flex items-center gap-1 text-[12.5px] font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                  {card.link}
                  <ArrowRight size={12} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
