"use client";

import { useEffect, useState } from "react";
import CopyNorekCard from "./CopyNorekCard";
import { CreditCard, QrCode, Download, Loader2, Heart } from "lucide-react";

interface Rekening {
  id: string;
  bank: string;
  norek: string;
  atas: string;
}

type Tab = "transfer" | "qris";

export default function DonasiSection() {
  const [tab,      setTab]      = useState<Tab>("transfer");
  const [rekening, setRekening] = useState<Rekening[]>([]);
  const [qrisUrl,  setQrisUrl]  = useState<string | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/rekening?aktif=true").then((r) => r.json()).catch(() => []),
      fetch("/api/pengaturan?key=qris_url").then((r) => r.json()).catch(() => ({})),
    ]).then(([rek, pengaturan]) => {
      setRekening(Array.isArray(rek) ? rek : []);
      setQrisUrl(pengaturan?.value ?? null);
    }).finally(() => setLoading(false));
  }, []);

  function downloadQris() {
    if (!qrisUrl) return;
    const a = document.createElement("a");
    a.href = qrisUrl;
    a.download = "QRIS-Masjid-Al-Hidayah.jpg";
    a.target = "_blank";
    a.click();
  }

  return (
    <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Heart size={16} className="text-white/80" fill="currentColor" strokeWidth={0} />
        <h3 className="font-bold text-[17px]">Donasi &amp; Wakaf</h3>
      </div>
      <p className="text-white/80 text-[13px] mb-5 leading-relaxed">
        Setiap rupiah yang Anda sumbangkan menjadi amal jariyah yang mengalir tanpa henti.
        Jazakumullahu Khairan.
      </p>

      {/* Tab switcher — selalu tampil */}
      <div className="flex bg-white/15 rounded-xl p-1 mb-5 gap-1">
        <button
          onClick={() => setTab("transfer")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            tab === "transfer"
              ? "bg-white text-amber-600 shadow-sm"
              : "text-white/80 hover:text-white"
          }`}
        >
          <CreditCard size={14} strokeWidth={2} />
          Transfer Bank
        </button>
        <button
          onClick={() => setTab("qris")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            tab === "qris"
              ? "bg-white text-amber-600 shadow-sm"
              : "text-white/80 hover:text-white"
          }`}
        >
          <QrCode size={14} strokeWidth={2} />
          QRIS
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="text-white/60 animate-spin" />
        </div>
      )}

      {/* ── Tab: Transfer Bank ── */}
      {!loading && tab === "transfer" && (
        <div className="space-y-3">
          {rekening.length > 0 ? rekening.map((acc) => (
            <CopyNorekCard
              key={acc.id}
              bank={acc.bank}
              norek={acc.norek}
              atas={acc.atas}
            />
          )) : (
            <p className="text-white/60 text-[13px] text-center py-6">
              Info rekening belum tersedia.
            </p>
          )}
        </div>
      )}

      {/* ── Tab: QRIS ── */}
      {!loading && tab === "qris" && (
        qrisUrl ? (
          <div className="flex flex-col items-center gap-4">
            {/* QR Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xl w-full max-w-xs mx-auto">
              <p className="text-center text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-3">
                Scan untuk Berdonasi
              </p>
              <div className="bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                <img
                  src={qrisUrl}
                  alt="QRIS Donasi Masjid Al-Hidayah"
                  className="w-full max-w-55 h-auto aspect-square object-contain"
                />
              </div>
              <p className="text-center text-[12px] text-gray-700 font-semibold mt-3">
                Masjid Al-Hidayah
              </p>
              <p className="text-center text-[11px] text-gray-400 mt-0.5">
                Semua bank &amp; e-wallet
              </p>
            </div>

            {/* Langkah scan */}
            <div className="w-full space-y-2">
              {[
                "Buka aplikasi bank atau e-wallet",
                "Pilih menu Scan / Bayar",
                "Arahkan kamera ke QR di atas",
                "Masukkan nominal donasi &amp; konfirmasi",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-white/90 leading-snug"
                    dangerouslySetInnerHTML={{ __html: step }} />
                </div>
              ))}
            </div>

            {/* Download */}
            <button
              onClick={downloadQris}
              className="flex items-center gap-2 text-[13px] font-semibold text-amber-600 bg-white hover:bg-amber-50 px-4 py-2.5 rounded-xl transition-colors w-full justify-center shadow-sm"
            >
              <Download size={15} strokeWidth={2} />
              Simpan / Cetak QRIS
            </button>
          </div>
        ) : (
          /* Placeholder kalau QRIS belum diupload */
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-24 h-24 rounded-2xl bg-white/15 flex items-center justify-center">
              <QrCode size={40} className="text-white/40" strokeWidth={1.2} />
            </div>
            <p className="text-white/70 text-[13px] text-center leading-relaxed">
              QRIS belum tersedia.<br />
              <span className="text-white/50 text-[12px]">
                Silakan hubungi pengurus masjid untuk info lebih lanjut.
              </span>
            </p>
          </div>
        )
      )}

      <p className="text-[12px] text-white/70 mt-5 pt-4 border-t border-white/20">
        Konfirmasi via WhatsApp:{" "}
        <span className="font-semibold text-white">0812-3456-7890</span>
      </p>
    </div>
  );
}
