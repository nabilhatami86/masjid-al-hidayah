"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import { JENIS_KEGIATAN, type Khatib, type Jadwal } from "@/lib/adminTypes";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_ID   = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

const BADGE: Record<string, string> = {
  "Khutbah Jumat":           "bg-amber-100 text-amber-700",
  "Kajian Sabtu":            "bg-blue-100 text-blue-700",
  "Tahsin Al-Qur'an":        "bg-emerald-100 text-emerald-700",
  "TPA Al-Hidayah":          "bg-purple-100 text-purple-700",
  "Tahfidz":                 "bg-pink-100 text-pink-700",
  "Maulid & Kegiatan Khusus":"bg-red-100 text-red-700",
};

const EMPTY_FORM = { tanggal: "", jenisKegiatan: JENIS_KEGIATAN[0], khatibId: "", topik: "", waktu: "11:30", keterangan: "" };

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request gagal.");
  return json as T;
}

export default function JadwalPage() {
  const [list,        setList]        = useState<Jadwal[]>([]);
  const [khatibList,  setKhatibList]  = useState<Khatib[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [editId,      setEditId]      = useState<string | null>(null);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);
  const [filterBulan, setFilterBulan] = useState("semua");
  const [filterJenis, setFilterJenis] = useState("semua");
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api<Jadwal[]>("/api/jadwal"),
      api<Khatib[]>("/api/khatib?aktif=true"),
    ]).then(([j, k]) => { setList(j); setKhatibList(k); })
      .catch(() => setError("Gagal memuat data. Cek koneksi Supabase."))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setForm({ ...EMPTY_FORM, khatibId: khatibList[0]?.id ?? "" });
    setEditId(null); setError(null); setModalOpen(true);
  }
  function openEdit(j: Jadwal) {
    const { id, khatibNama, ...rest } = j;
    setForm(rest); setEditId(id); setError(null); setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      if (editId) {
        const updated = await api<Jadwal>(`/api/jadwal/${editId}`, { method: "PUT", body: JSON.stringify(form) });
        setList(list.map((j) => (j.id === editId ? updated : j)));
      } else {
        const created = await api<Jadwal>("/api/jadwal", { method: "POST", body: JSON.stringify(form) });
        setList([...list, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan jadwal.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setSaving(true);
    try {
      await api(`/api/jadwal/${deleteId}`, { method: "DELETE" });
      setList(list.filter((j) => j.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Gagal menghapus jadwal.");
    } finally {
      setSaving(false);
    }
  }

  const BULAN_OPTIONS = [
    { val: "semua", label: "Semua Bulan" },
    ...Array.from({ length: 12 }, (_, i) => ({ val: String(i + 1).padStart(2, "0"), label: MONTHS_ID[i] })),
  ];

  const filtered = list
    .filter((j) => {
      const m = j.tanggal.split("-")[1];
      return (filterBulan === "semua" || m === filterBulan) &&
             (filterJenis === "semua" || j.jenisKegiatan === filterJenis);
    })
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jadwal Kegiatan</h1>
                <p className="text-sm text-gray-500 mt-0.5">{loading ? "Memuat…" : `${list.length} jadwal terdaftar`}</p>
              </div>
              <button onClick={openAdd}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0">
                <Plus size={16} strokeWidth={2.5} />
                Buat Jadwal
              </button>
            </div>

            {error && !modalOpen && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)}
                className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
                {BULAN_OPTIONS.map((b) => <option key={b.val} value={b.val}>{b.label}</option>)}
              </select>
              <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)}
                className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
                <option value="semua">Semua Kegiatan</option>
                {JENIS_KEGIATAN.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            {/* Cards */}
            {loading ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">Memuat jadwal…</div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">Tidak ada jadwal untuk filter ini.</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((j) => (
                  <div key={j.id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-start">
                    {/* Date badge */}
                    <div className="w-14 shrink-0 text-center">
                      <div className="rounded-xl bg-amber-50 py-2">
                        <p className="text-2xl font-bold text-amber-600 leading-none">
                          {new Date(j.tanggal + "T00:00").getDate()}
                        </p>
                        <p className="text-[10px] text-amber-500 uppercase font-semibold mt-0.5">
                          {MONTHS_ID[new Date(j.tanggal + "T00:00").getMonth()].slice(0, 3)}
                        </p>
                        <p className="text-[10px] text-amber-400">{new Date(j.tanggal + "T00:00").getFullYear()}</p>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${BADGE[j.jenisKegiatan] ?? "bg-gray-100 text-gray-600"}`}>
                          {j.jenisKegiatan}
                        </span>
                        <span className="text-[12px] text-gray-400">
                          {DAYS_ID[new Date(j.tanggal + "T00:00").getDay()]} · {j.waktu} WIB
                        </span>
                      </div>
                      <p className="font-bold text-[15px] text-gray-900 truncate">{j.topik}</p>
                      <p className="text-[13px] text-gray-500 mt-0.5 font-medium">{j.khatibNama}</p>
                      {j.keterangan && <p className="text-[12px] text-gray-400 mt-1 italic">{j.keterangan}</p>}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(j)} className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button onClick={() => setDeleteId(j.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── MODAL FORM ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5">{editId ? "Edit Jadwal" : "Buat Jadwal Baru"}</h2>
            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Jenis Kegiatan <span className="text-red-400">*</span></label>
                <select required value={form.jenisKegiatan} onChange={(e) => setForm({ ...form, jenisKegiatan: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300">
                  {JENIS_KEGIATAN.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Khatib / Ustadz <span className="text-red-400">*</span></label>
                <select required value={form.khatibId} onChange={(e) => setForm({ ...form, khatibId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300">
                  <option value="">-- Pilih Khatib --</option>
                  {khatibList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Topik / Judul <span className="text-red-400">*</span></label>
                <input required type="text" value={form.topik} onChange={(e) => setForm({ ...form, topik: e.target.value })}
                  placeholder="Judul kajian atau khutbah"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Tanggal <span className="text-red-400">*</span></label>
                  <input required type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Waktu <span className="text-red-400">*</span></label>
                  <input required type="time" value={form.waktu} onChange={(e) => setForm({ ...form, waktu: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Keterangan Tambahan</label>
                <textarea rows={2} value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  placeholder="Opsional..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold disabled:opacity-60">
                  {saving ? "Menyimpan…" : editId ? "Simpan" : "Buat Jadwal"}
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
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1">Hapus Jadwal?</h3>
            <p className="text-[13px] text-gray-500 mb-5">Data tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600">Batal</button>
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
