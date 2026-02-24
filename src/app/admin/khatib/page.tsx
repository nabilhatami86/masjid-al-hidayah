"use client";

import { useEffect, useRef, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import { type Khatib } from "@/lib/adminTypes";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Pencil, Trash2, AlertTriangle, ImagePlus, X } from "lucide-react";

const BUCKET = "khatib-photos";

const EMPTY: Omit<Khatib, "id"> = {
  nama: "", gelar: "", spesialisasi: "", noHp: "", email: "", aktif: true, fotoUrl: null,
};

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res  = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request gagal.");
  return json as T;
}

async function uploadFoto(file: File, khatibId: string): Promise<string> {
  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `${khatibId}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error("Upload foto gagal: " + error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl + "?t=" + Date.now();
}

async function deleteFoto(fotoUrl: string) {
  try {
    const parts = fotoUrl.split(`/${BUCKET}/`);
    if (parts[1]) {
      const path = parts[1].split("?")[0];
      await supabase.storage.from(BUCKET).remove([path]);
    }
  } catch { /* abaikan jika gagal */ }
}

function KhatibAvatar({ k, size = "md" }: { k: Khatib; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "w-9 h-9 text-[13px]" : size === "lg" ? "w-20 h-20 text-2xl" : "w-12 h-12 text-[15px]";
  if (k.fotoUrl) {
    return (
      <img
        src={k.fotoUrl}
        alt={k.nama}
        className={`${dim} rounded-full object-cover shrink-0 ring-2 ring-amber-100`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 font-bold`}>
      {k.nama.charAt(0)}
    </div>
  );
}

export default function KhatibPage() {
  const [list,        setList]      = useState<Khatib[]>([]);
  const [loading,     setLoading]   = useState(true);
  const [saving,      setSaving]    = useState(false);
  const [modalOpen,   setModalOpen] = useState(false);
  const [form,        setForm]      = useState<Omit<Khatib, "id">>(EMPTY);
  const [editId,      setEditId]    = useState<string | null>(null);
  const [deleteId,    setDeleteId]  = useState<string | null>(null);
  const [search,      setSearch]    = useState("");
  const [error,       setError]     = useState<string | null>(null);
  const [fotoFile,    setFotoFile]  = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api<Khatib[]>("/api/khatib")
      .then(setList)
      .catch(() => setError("Gagal memuat data. Cek koneksi Supabase."))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setForm(EMPTY); setEditId(null); setError(null);
    setFotoFile(null); setFotoPreview(null);
    setModalOpen(true);
  }

  function openEdit(k: Khatib) {
    const { id, ...rest } = k;
    setForm(rest); setEditId(id); setError(null);
    setFotoFile(null); setFotoPreview(k.fotoUrl ?? null);
    setModalOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Ukuran foto max 2 MB."); return; }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
    setError(null);
  }

  function removePhoto() {
    setFotoFile(null);
    setFotoPreview(null);
    setForm({ ...form, fotoUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      let fotoUrl = form.fotoUrl ?? null;

      if (editId) {
        if (fotoFile) {
          if (form.fotoUrl) await deleteFoto(form.fotoUrl);
          fotoUrl = await uploadFoto(fotoFile, editId);
        }
        const updated = await api<Khatib>(`/api/khatib/${editId}`, {
          method: "PUT",
          body: JSON.stringify({ ...form, fotoUrl }),
        });
        setList(list.map((k) => (k.id === editId ? updated : k)));
      } else {
        const created = await api<Khatib>("/api/khatib", {
          method: "POST",
          body: JSON.stringify({ ...form, fotoUrl: null }),
        });
        if (fotoFile) {
          fotoUrl = await uploadFoto(fotoFile, created.id);
          const withFoto = await api<Khatib>(`/api/khatib/${created.id}`, {
            method: "PUT",
            body: JSON.stringify({ fotoUrl }),
          });
          setList([...list, withFoto]);
        } else {
          setList([...list, created]);
        }
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
      const target = list.find((k) => k.id === deleteId);
      if (target?.fotoUrl) await deleteFoto(target.fotoUrl);
      await api(`/api/khatib/${deleteId}`, { method: "DELETE" });
      setList(list.filter((k) => k.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Gagal menghapus data.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAktif(id: string, current: boolean) {
    try {
      const updated = await api<Khatib>(`/api/khatib/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ aktif: !current }),
      });
      setList(list.map((k) => (k.id === id ? updated : k)));
    } catch {
      setError("Gagal mengubah status.");
    }
  }

  const filtered = list.filter(
    (k) => k.nama.toLowerCase().includes(search.toLowerCase()) ||
           k.spesialisasi.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Khatib & Ustadz</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? "Memuat…" : `${list.filter((k) => k.aktif).length} aktif · ${list.length} total`}
                </p>
              </div>
              <button onClick={openAdd}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0">
                <Plus size={16} strokeWidth={2.5} />
                Tambah
              </button>
            </div>

            {error && !modalOpen && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
              <input type="text" placeholder="Cari nama atau spesialisasi..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-5 py-3">Nama</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 hidden sm:table-cell">Spesialisasi</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 hidden md:table-cell">Kontak</th>
                      <th className="text-center text-[11px] font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase px-5 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading && <tr><td colSpan={5} className="text-center py-10 text-gray-400">Memuat data…</td></tr>}
                    {!loading && filtered.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400">Tidak ada data.</td></tr>}
                    {filtered.map((k) => (
                      <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <KhatibAvatar k={k} size="sm" />
                            <div>
                              <p className="font-semibold text-gray-800 text-[13px]">{k.nama}</p>
                              {k.gelar && <p className="text-[11px] text-gray-400">{k.gelar}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-600 hidden sm:table-cell">{k.spesialisasi}</td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-[12px] text-gray-600">{k.noHp}</p>
                          <p className="text-[12px] text-gray-400">{k.email}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button onClick={() => toggleAktif(k.id, k.aktif)}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                              k.aktif ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${k.aktif ? "bg-emerald-500" : "bg-gray-400"}`} />
                            {k.aktif ? "Aktif" : "Nonaktif"}
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(k)} title="Edit"
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Pencil size={15} strokeWidth={2} />
                            </button>
                            <button onClick={() => setDeleteId(k.id)} title="Hapus"
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[92vh] overflow-y-auto">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5">{editId ? "Edit Khatib" : "Tambah Khatib"}</h2>
            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* ── FOTO UPLOAD ── */}
              <div className="flex flex-col items-center gap-3 pb-1">
                <div className="relative">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="preview"
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-2xl ring-4 ring-amber-50">
                      {form.nama ? form.nama.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
                  {fotoPreview && (
                    <button type="button" onClick={removePhoto}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                      <X size={10} strokeWidth={3} />
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 hover:text-amber-700 border border-amber-300 hover:border-amber-400 px-3 py-1.5 rounded-lg transition-colors">
                    <ImagePlus size={13} strokeWidth={2} />
                    {fotoPreview ? "Ganti Foto" : "Pilih Foto"}
                  </button>
                  <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WebP — maks 2 MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange} className="hidden" />
              </div>

              {/* ── FIELD TEKS ── */}
              {([
                { key: "nama",         label: "Nama Lengkap",  required: true,  placeholder: "Nama ustadz / khatib" },
                { key: "gelar",        label: "Gelar",         required: false, placeholder: "Misal: Lc., M.A." },
                { key: "spesialisasi", label: "Spesialisasi",  required: true,  placeholder: "Misal: Tafsir & Hadist" },
                { key: "noHp",         label: "No. HP / WA",   required: false, placeholder: "08xxx" },
                { key: "email",        label: "Email",         required: false, placeholder: "email@example.com" },
              ] as const).map(({ key, label, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                    {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <input type={key === "email" ? "email" : "text"} required={required}
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              ))}

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.aktif}
                  onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
                  className="w-4 h-4 accent-amber-500" />
                <span className="text-[13px] font-medium text-gray-700">Status Aktif</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600 hover:bg-gray-50">Batal</button>
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
            {(() => {
              const target = list.find((k) => k.id === deleteId);
              return target ? (
                <div className="flex justify-center mb-4">
                  <KhatibAvatar k={target} size="lg" />
                </div>
              ) : null;
            })()}
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={22} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1">Hapus Khatib?</h3>
            <p className="text-[13px] text-gray-500 mb-5">
              {list.find((k) => k.id === deleteId)?.nama && (
                <span className="font-semibold text-gray-700">{list.find((k) => k.id === deleteId)?.nama}</span>
              )}{" "}akan dihapus beserta fotonya.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600 hover:bg-gray-50">Batal</button>
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
