"use client";

import { useEffect, useRef, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import { type Rekening } from "@/lib/adminTypes";
import { supabase } from "@/lib/supabase";
import {
  Plus, Pencil, Trash2, AlertTriangle, CreditCard,
  GripVertical, QrCode, ImagePlus, X, Loader2, Check,
} from "lucide-react";

const QRIS_BUCKET = "qris";
const QRIS_PATH   = "masjid-qris";
const QRIS_KEY    = "qris_url";

const EMPTY: Omit<Rekening, "id"> = {
  bank: "", norek: "", atas: "", urutan: 0, aktif: true,
};

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res  = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request gagal.");
  return json as T;
}

async function uploadQris(file: File): Promise<string> {
  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `${QRIS_PATH}.${ext}`;
  const { error } = await supabase.storage
    .from(QRIS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error("Upload QRIS gagal: " + error.message);
  const { data } = supabase.storage.from(QRIS_BUCKET).getPublicUrl(path);
  return data.publicUrl + "?t=" + Date.now();
}

async function deleteQrisStorage(url: string) {
  try {
    const parts = url.split(`/${QRIS_BUCKET}/`);
    if (parts[1]) {
      const path = parts[1].split("?")[0];
      await supabase.storage.from(QRIS_BUCKET).remove([path]);
    }
  } catch { /* abaikan */ }
}

export default function RekeningPage() {
  const [list,        setList]        = useState<Rekening[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [form,        setForm]        = useState<Omit<Rekening, "id">>(EMPTY);
  const [editId,      setEditId]      = useState<string | null>(null);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  // ── QRIS state ──
  const [qrisUrl,     setQrisUrl]     = useState<string | null>(null);
  const [qrisLoading, setQrisLoading] = useState(true);
  const [qrisFile,    setQrisFile]    = useState<File | null>(null);
  const [qrisPreview, setQrisPreview] = useState<string | null>(null);
  const [qrisSaving,  setQrisSaving]  = useState(false);
  const [qrisError,   setQrisError]   = useState<string | null>(null);
  const [qrisSaved,   setQrisSaved]   = useState(false);
  const qrisInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api<Rekening[]>("/api/rekening")
      .then(setList)
      .catch(() => setError("Gagal memuat data. Cek koneksi Supabase."))
      .finally(() => setLoading(false));

    fetch(`/api/pengaturan?key=${QRIS_KEY}`)
      .then((r) => r.json())
      .then((d) => setQrisUrl(d.value ?? null))
      .catch(() => {})
      .finally(() => setQrisLoading(false));
  }, []);

  function openAdd() {
    const nextUrutan = list.length > 0 ? Math.max(...list.map((r) => r.urutan)) + 1 : 0;
    setForm({ ...EMPTY, urutan: nextUrutan });
    setEditId(null); setError(null); setModalOpen(true);
  }

  function openEdit(r: Rekening) {
    const { id, ...rest } = r;
    setForm(rest); setEditId(id); setError(null); setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      if (editId) {
        const updated = await api<Rekening>(`/api/rekening/${editId}`, {
          method: "PUT", body: JSON.stringify(form),
        });
        setList(list.map((r) => (r.id === editId ? updated : r)));
      } else {
        const created = await api<Rekening>("/api/rekening", {
          method: "POST", body: JSON.stringify(form),
        });
        setList([...list, created].sort((a, b) => a.urutan - b.urutan));
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setSaving(true);
    try {
      await api(`/api/rekening/${deleteId}`, { method: "DELETE" });
      setList(list.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Gagal menghapus data.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAktif(id: string, current: boolean) {
    try {
      const updated = await api<Rekening>(`/api/rekening/${id}`, {
        method: "PATCH", body: JSON.stringify({ aktif: !current }),
      });
      setList(list.map((r) => (r.id === id ? updated : r)));
    } catch {
      setError("Gagal mengubah status.");
    }
  }

  // ── QRIS handlers ──
  function handleQrisFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setQrisError("Ukuran file max 3 MB."); return; }
    setQrisFile(file);
    setQrisPreview(URL.createObjectURL(file));
    setQrisError(null);
  }

  function cancelQrisChange() {
    setQrisFile(null);
    setQrisPreview(null);
    if (qrisInputRef.current) qrisInputRef.current.value = "";
  }

  async function saveQris() {
    if (!qrisFile) return;
    setQrisSaving(true); setQrisError(null);
    try {
      const url = await uploadQris(qrisFile);
      await fetch("/api/pengaturan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: QRIS_KEY, value: url }),
      });
      setQrisUrl(url);
      setQrisFile(null);
      setQrisPreview(null);
      setQrisSaved(true);
      setTimeout(() => setQrisSaved(false), 2000);
      if (qrisInputRef.current) qrisInputRef.current.value = "";
    } catch (err) {
      setQrisError(err instanceof Error ? err.message : "Gagal upload QRIS.");
    } finally {
      setQrisSaving(false);
    }
  }

  async function deleteQris() {
    if (!qrisUrl) return;
    setQrisSaving(true); setQrisError(null);
    try {
      await deleteQrisStorage(qrisUrl);
      await fetch("/api/pengaturan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: QRIS_KEY, value: null }),
      });
      setQrisUrl(null);
    } catch {
      setQrisError("Gagal menghapus QRIS.");
    } finally {
      setQrisSaving(false);
    }
  }

  const sorted = [...list].sort((a, b) => a.urutan - b.urutan);
  const previewSrc = qrisPreview ?? qrisUrl;

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nomor Rekening & QRIS</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? "Memuat…" : `${list.filter((r) => r.aktif).length} rekening aktif · ${list.length} total`}
                </p>
              </div>
              <button onClick={openAdd}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0">
                <Plus size={16} strokeWidth={2.5} />
                Tambah Rekening
              </button>
            </div>

            {error && !modalOpen && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            {/* Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-[13px] text-amber-800">
              Rekening dan QRIS yang ditampilkan di halaman donasi/waqaf. Urutan menentukan posisi tampil (angka kecil = atas).
            </div>

            {/* ── QRIS CARD ── */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <QrCode size={18} className="text-amber-500" strokeWidth={2} />
                <h2 className="font-bold text-gray-900 text-[15px]">QRIS Donasi</h2>
              </div>

              {qrisError && (
                <p className="text-red-500 text-[13px] mb-3">{qrisError}</p>
              )}

              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Preview */}
                <div className="shrink-0">
                  {qrisLoading ? (
                    <div className="w-40 h-40 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Loader2 size={22} className="text-gray-300 animate-spin" />
                    </div>
                  ) : previewSrc ? (
                    <div className="relative">
                      <img
                        src={previewSrc}
                        alt="QRIS"
                        className={`w-40 h-40 object-contain rounded-xl border-2 ${
                          qrisPreview ? "border-amber-400 border-dashed" : "border-gray-200"
                        }`}
                      />
                      {qrisPreview && (
                        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Baru
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-300">
                      <QrCode size={36} strokeWidth={1.2} />
                      <span className="text-[11px]">Belum ada QRIS</span>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-3">
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    Upload foto/gambar QRIS masjid. Gambar akan ditampilkan di halaman donasi agar jamaah bisa scan langsung.
                  </p>

                  <input
                    ref={qrisInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleQrisFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => qrisInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-600 hover:text-amber-700 border border-amber-300 hover:border-amber-400 px-3 py-2 rounded-xl transition-colors"
                    >
                      <ImagePlus size={14} strokeWidth={2} />
                      {qrisUrl ? "Ganti QRIS" : "Upload QRIS"}
                    </button>

                    {qrisFile && (
                      <>
                        <button
                          type="button"
                          onClick={saveQris}
                          disabled={qrisSaving}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
                        >
                          {qrisSaving
                            ? <Loader2 size={14} className="animate-spin" />
                            : qrisSaved
                            ? <Check size={14} strokeWidth={2.5} />
                            : null}
                          {qrisSaving ? "Menyimpan…" : "Simpan QRIS"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelQrisChange}
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl transition-colors"
                        >
                          <X size={14} strokeWidth={2} />
                          Batal
                        </button>
                      </>
                    )}

                    {qrisUrl && !qrisFile && (
                      <button
                        type="button"
                        onClick={deleteQris}
                        disabled={qrisSaving}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
                      >
                        <Trash2 size={14} strokeWidth={2} />
                        Hapus QRIS
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Format: JPG, PNG, WebP — maks 3 MB
                  </p>
                </div>
              </div>
            </div>

            {/* ── REKENING TABLE ── */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-5 py-3 w-8">#</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3">Bank</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 hidden sm:table-cell">No. Rekening</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 hidden md:table-cell">Atas Nama</th>
                      <th className="text-center text-[11px] font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase px-5 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading && (
                      <tr><td colSpan={6} className="text-center py-10 text-gray-400">Memuat data…</td></tr>
                    )}
                    {!loading && sorted.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10">
                          <CreditCard size={32} className="mx-auto text-gray-200 mb-2" />
                          <p className="text-gray-400 text-sm">Belum ada rekening. Tambahkan sekarang.</p>
                        </td>
                      </tr>
                    )}
                    {sorted.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <GripVertical size={14} className="text-gray-300" />
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-gray-800 text-[13px]">{r.bank}</p>
                          <p className="text-[11px] text-gray-400 sm:hidden">{r.norek}</p>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-600 hidden sm:table-cell font-mono tracking-wide">{r.norek}</td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-600 hidden md:table-cell">a.n. {r.atas}</td>
                        <td className="px-4 py-3.5 text-center">
                          <button onClick={() => toggleAktif(r.id, r.aktif)}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                              r.aktif
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${r.aktif ? "bg-emerald-500" : "bg-gray-400"}`} />
                            {r.aktif ? "Aktif" : "Nonaktif"}
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(r)} title="Edit"
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Pencil size={15} strokeWidth={2} />
                            </button>
                            <button onClick={() => setDeleteId(r.id)} title="Hapus"
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                              <Trash2 size={15} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL FORM ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5">
              {editId ? "Edit Rekening" : "Tambah Rekening"}
            </h2>
            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Nama Bank <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.bank}
                  onChange={(e) => setForm({ ...form, bank: e.target.value })}
                  placeholder="Contoh: BSI (Bank Syariah Indonesia)"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300" />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Nomor Rekening <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.norek}
                  onChange={(e) => setForm({ ...form, norek: e.target.value })}
                  placeholder="Contoh: 7 1234 5678 9"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300 font-mono tracking-wide" />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Atas Nama <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.atas}
                  onChange={(e) => setForm({ ...form, atas: e.target.value })}
                  placeholder="Contoh: Masjid Al-Hidayah"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300" />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Urutan Tampil</label>
                <input type="number" min={0} value={form.urutan}
                  onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300" />
                <p className="text-[11px] text-gray-400 mt-1">Angka kecil = tampil lebih atas</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.aktif}
                  onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
                  className="w-4 h-4 accent-amber-500" />
                <span className="text-[13px] font-medium text-gray-700">Tampilkan di halaman donasi</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600 hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold disabled:opacity-60">
                  {saving ? "Menyimpan…" : editId ? "Simpan" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={22} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1">Hapus Rekening?</h3>
            <p className="text-[13px] text-gray-500 mb-5">
              Rekening{" "}
              <span className="font-semibold text-gray-700">
                {list.find((r) => r.id === deleteId)?.bank}
              </span>{" "}
              akan dihapus dari halaman donasi.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={confirmDelete} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[14px] font-semibold disabled:opacity-60">
                {saving ? "Menghapus…" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
