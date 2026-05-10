"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { PlusCircle, Trash2, Edit2, Newspaper, X, Check } from "lucide-react";
import { type BeritaDB, KATEGORI_BERITA, formatTanggalBerita } from "@/lib/controllers/beritaController";

function toSlug(judul: string) {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const EMPTY_FORM = {
  judul: "",
  ringkasan: "",
  konten: "",
  kategori: "Pengumuman",
  tanggal: new Date().toISOString().slice(0, 10),
  slug: "",
};

export default function AdminBeritaPage() {
  const [list,     setList]     = useState<BeritaDB[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showModal,setShowModal]= useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/berita");
    if (res.ok) setList(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(item: BeritaDB) {
    setEditId(item.id);
    setForm({
      judul:     item.judul,
      ringkasan: item.ringkasan,
      konten:    item.konten,
      kategori:  item.kategori,
      tanggal:   item.tanggal,
      slug:      item.slug,
    });
    setShowModal(true);
  }

  async function save() {
    if (!form.judul.trim() || !form.ringkasan.trim()) return;
    setSaving(true);
    const payload = { ...form, slug: form.slug || toSlug(form.judul) };
    const url    = editId ? `/api/berita/${editId}` : "/api/berita";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setShowModal(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Hapus berita ini?")) return;
    setDeleting(id);
    await fetch(`/api/berita/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  }

  return (
    <div className="md:pl-56 min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="p-6 pt-20 md:pt-6 max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Newspaper size={20} className="text-amber-500" strokeWidth={2} />
              Berita &amp; Pengumuman
            </h1>
            <p className="text-[13px] text-gray-400 mt-0.5">Kelola artikel berita dan pengumuman masjid</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <PlusCircle size={15} />
            Tambah Berita
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Memuat...</div>
        ) : list.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
            Belum ada berita. Klik &quot;Tambah Berita&quot; untuk mulai.
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {item.kategori}
                    </span>
                    <span className="text-[11px] text-gray-400">{formatTanggalBerita(item.tanggal)}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-gray-800 truncate">{item.judul}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1">{item.ringkasan}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    disabled={deleting === item.id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-10 px-4 overflow-y-auto pb-10">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-[15px]">
                {editId ? "Edit Berita" : "Tambah Berita"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-gray-600 block mb-1">Judul *</label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value, slug: toSlug(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-amber-400"
                  placeholder="Judul berita..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-gray-600 block mb-1">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-amber-400"
                  >
                    {KATEGORI_BERITA.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-600 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-600 block mb-1">Ringkasan *</label>
                <textarea
                  value={form.ringkasan}
                  onChange={(e) => setForm((f) => ({ ...f, ringkasan: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Ringkasan singkat berita..."
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-600 block mb-1">Konten</label>
                <textarea
                  value={form.konten}
                  onChange={(e) => setForm((f) => ({ ...f, konten: e.target.value }))}
                  rows={7}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-amber-400 resize-y"
                  placeholder="Isi artikel lengkap...&#10;&#10;Pisahkan paragraf dengan baris kosong."
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-600 block mb-1">Slug URL</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="url-berita-ini"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Diisi otomatis dari judul. Harus unik.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={save}
                disabled={saving || !form.judul.trim() || !form.ringkasan.trim()}
                className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-[13px] font-semibold rounded-xl transition-colors"
              >
                {saving ? "Menyimpan..." : <><Check size={14} /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
