"use client";

import { useEffect, useRef, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { ImagePlus, Upload, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

const BUCKET = "program-images";

const PROGRAMS: { key: string; title: string; desc: string }[] = [
  { key: "tpa-al-hidayah",   title: "TPA Al-Hidayah",   desc: "Pendidikan Al-Qur'an untuk anak usia 5–15 tahun" },
  { key: "kajian-sabtu",     title: "Kajian Sabtu",     desc: "Kajian rutin setiap Sabtu pagi" },
  { key: "wakaf-produktif",  title: "Wakaf Produktif",  desc: "Program wakaf untuk kemandirian ekonomi umat" },
  { key: "tahsin-alquran",   title: "Tahsin Al-Qur'an", desc: "Perbaikan bacaan Al-Qur'an sesuai tajwid" },
];

async function uploadImage(file: File, key: string): Promise<string> {
  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `${key}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error("Upload gambar gagal: " + error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl + "?t=" + Date.now();
}

async function saveImageUrl(key: string, imageUrl: string) {
  const { error } = await supabase
    .from("program_images")
    .upsert({ key, image_url: imageUrl });
  if (error) throw new Error(error.message);
}

interface ProgramState {
  imageUrl: string | null;
  uploading: boolean;
  success: boolean;
  error: string | null;
  preview: string | null;
}

export default function ProgramPage() {
  const [states, setStates] = useState<Record<string, ProgramState>>(() =>
    Object.fromEntries(
      PROGRAMS.map((p) => [
        p.key,
        { imageUrl: null, uploading: false, success: false, error: null, preview: null },
      ]),
    ),
  );
  const [loading, setLoading] = useState(true);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch("/api/program-images")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (!Array.isArray(data)) return;
        setStates((prev) => {
          const next = { ...prev };
          for (const item of data as { key: string; imageUrl: string | null }[]) {
            if (next[item.key]) {
              next[item.key] = { ...next[item.key], imageUrl: item.imageUrl };
            }
          }
          return next;
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function setState(key: string, patch: Partial<ProgramState>) {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  async function handleFile(key: string, file: File) {
    if (file.size > 3 * 1024 * 1024) {
      setState(key, { error: "Ukuran file max 3 MB." });
      return;
    }
    const preview = URL.createObjectURL(file);
    setState(key, { preview, uploading: true, error: null, success: false });
    try {
      const url = await uploadImage(file, key);
      await saveImageUrl(key, url);
      setState(key, { imageUrl: url, uploading: false, success: true, preview: null });
      setTimeout(() => setState(key, { success: false }), 3000);
    } catch (e) {
      setState(key, { uploading: false, error: (e as Error).message, preview: null });
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 md:ml-56 p-5 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[22px] font-bold text-gray-900">Program Unggulan</h1>
            <p className="text-[13px] text-gray-500 mt-1">
              Upload foto untuk setiap program yang tampil di halaman utama.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {PROGRAMS.map((prog) => {
                const s = states[prog.key];
                const displayImg = s.preview ?? s.imageUrl;

                return (
                  <div key={prog.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Image preview area */}
                    <div className="relative h-44 bg-gray-100">
                      {displayImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={displayImg}
                          alt={prog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                          <ImagePlus size={32} />
                          <span className="text-[12px]">Belum ada foto</span>
                        </div>
                      )}

                      {/* Uploading overlay */}
                      {s.uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 size={28} className="text-white animate-spin" />
                        </div>
                      )}

                      {/* Success flash */}
                      {s.success && (
                        <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                          <CheckCircle size={32} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <p className="font-bold text-[14px] text-gray-900">{prog.title}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5 mb-3">{prog.desc}</p>

                      {s.error && (
                        <div className="flex items-center gap-1.5 text-red-600 text-[11px] mb-2">
                          <AlertTriangle size={13} />
                          {s.error}
                        </div>
                      )}

                      <input
                        ref={(el) => { fileRefs.current[prog.key] = el; }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFile(prog.key, f);
                          e.target.value = "";
                        }}
                      />

                      <button
                        disabled={s.uploading}
                        onClick={() => fileRefs.current[prog.key]?.click()}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-colors"
                      >
                        <Upload size={14} />
                        {s.uploading ? "Mengupload…" : displayImg ? "Ganti Foto" : "Upload Foto"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-gray-400 mt-6 text-center">
            Format: JPG, PNG, WebP · Ukuran maks 3 MB · Rasio ideal 16:9
          </p>
        </main>
      </div>
    </AdminGuard>
  );
}
