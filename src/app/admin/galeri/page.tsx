"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import { KATEGORI_GALERI } from "@/lib/controllers/galeriController";
import type { GaleriItem } from "@/lib/controllers/galeriController";
import { Upload, Trash2, Loader2, ImagePlus, X } from "lucide-react";

function ModalTambah({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [judul, setJudul]       = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState<string>(KATEGORI_GALERI[0]);
  const [tanggal, setTanggal]   = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState("");

  function handleFile(f: File) {
    if (f.size > 4 * 1024 * 1024) { setErr("Ukuran file maksimal 4 MB"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setErr("");
  }

  async function handleSave() {
    if (!file || !judul || !tanggal) { setErr("Judul, foto, dan tanggal wajib diisi"); return; }
    setSaving(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("galeri").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("galeri").getPublicUrl(path);
      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, deskripsi, image_url: urlData.publicUrl, kategori, tanggal }),
      });
      if (!res.ok) throw new Error();
      onSaved();
      onClose();
    } catch {
      setErr("Gagal menyimpan. Pastikan bucket 'galeri' sudah dibuat di Supabase.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Tambah Foto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Preview / upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-amber-300 transition-colors flex flex-col items-center justify-center gap-2 min-h-[140px] relative overflow-hidden"
          >
            {preview ? (
              <Image src={preview} alt="preview" fill className="object-cover rounded-xl" />
            ) : (
              <>
                <ImagePlus size={32} className="text-gray-300" />
                <p className="text-[13px] text-gray-400">Klik untuk pilih foto (maks 4 MB)</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul foto *"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-300" />

          <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi (opsional)" rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />

          <div className="grid grid-cols-2 gap-3">
            <select value={kategori} onChange={(e) => setKategori(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-300">
              {KATEGORI_GALERI.map((k) => <option key={k}>{k}</option>)}
            </select>
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>

          {err && <p className="text-red-500 text-[12px]">{err}</p>}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminGaleriPage() {
  const [items, setItems]         = useState<GaleriItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/galeri").catch(() => null);
    const d   = res ? await res.json().catch(() => []) : [];
    setItems(Array.isArray(d) ? d : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(item: GaleriItem) {
    if (!confirm(`Hapus foto "${item.judul}"?`)) return;
    setDeleting(item.id);
    // hapus dari storage
    const path = item.image_url.split("/galeri/")[1];
    if (path) await supabase.storage.from("galeri").remove([path]);
    // hapus dari DB
    await fetch(`/api/galeri/${item.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setDeleting(null);
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 md:pl-56">
        <AdminSidebar />
        <main className="pt-14 md:pt-0 px-4 md:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Galeri Foto</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola foto kegiatan masjid</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-colors shadow-sm"
              >
                <ImagePlus size={16} />
                Tambah Foto
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <ImagePlus size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Belum ada foto</p>
                <p className="text-sm mt-1">Klik &quot;Tambah Foto&quot; untuk mengunggah</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="relative aspect-square">
                      <Image src={item.image_url} alt={item.judul} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-[12px] font-semibold text-gray-800 line-clamp-1">{item.judul}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.kategori} · {new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleting === item.id}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleting === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {showModal && <ModalTambah onClose={() => setShowModal(false)} onSaved={load} />}
    </AdminGuard>
  );
}
