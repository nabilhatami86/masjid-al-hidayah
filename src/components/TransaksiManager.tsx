"use client";

import { useEffect, useState, useMemo } from "react";
import {
  KATEGORI_MASUK,
  KATEGORI_KELUAR,
  type TransaksiAdmin,
} from "@/lib/adminTypes";
import { exportCSV, exportExcel, printLaporan } from "@/lib/controllers/exportController";
import {
  Plus, Search, Pencil, Trash2, AlertTriangle,
  FileDown, Sheet, Printer, TrendingUp, TrendingDown,
} from "lucide-react";

const MONTHS_ID = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const PER_PAGE = 12;

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);
}

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" }, ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request gagal.");
  return json as T;
}

const EMPTY_FORM = (jenis: "masuk" | "keluar"): Omit<TransaksiAdmin, "id"> => ({
  tanggal: new Date().toISOString().split("T")[0],
  keterangan: "",
  kategori: jenis === "masuk" ? KATEGORI_MASUK[0] : KATEGORI_KELUAR[0],
  jenis,
  jumlah: 0,
});

interface Props {
  jenis: "masuk" | "keluar";
}

export default function TransaksiManager({ jenis }: Props) {
  const isMasuk    = jenis === "masuk";
  const accentColor = isMasuk ? "emerald" : "red";
  const label       = isMasuk ? "Pemasukan" : "Pengeluaran";
  const kategoriOpts = isMasuk ? KATEGORI_MASUK : KATEGORI_KELUAR;

  const [allList,  setAllList]  = useState<TransaksiAdmin[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form,     setForm]     = useState<Omit<TransaksiAdmin, "id">>(EMPTY_FORM(jenis));
  const [editId,   setEditId]   = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterTahun, setFilterTahun] = useState("semua");
  const [filterBulan, setFilterBulan] = useState("semua");
  const [halaman,  setHalaman]  = useState(1);
  const [search,   setSearch]   = useState("");
  const [error,    setError]    = useState<string | null>(null);

  // Hanya transaksi sesuai jenis
  const list = useMemo(
    () => allList.filter((t) => t.jenis === jenis),
    [allList, jenis],
  );

  useEffect(() => {
    api<TransaksiAdmin[]>("/api/transaksi")
      .then(setAllList)
      .catch(() => setError("Gagal memuat data."))
      .finally(() => setLoading(false));
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set(list.map((t) => t.tanggal.slice(0, 4)));
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [list]);

  const availableMonths = useMemo(() => {
    const base = filterTahun === "semua" ? list : list.filter((t) => t.tanggal.startsWith(filterTahun));
    const months = new Set(base.map((t) => t.tanggal.slice(5, 7)));
    return Array.from(months).sort();
  }, [list, filterTahun]);

  const BULAN_OPTIONS = [
    { val: "semua", label: "Semua Bulan" },
    ...availableMonths.map((m) => ({ val: m, label: MONTHS_ID[parseInt(m) - 1] })),
  ];

  const filtered = useMemo(() =>
    list.filter((t) => {
      const y = t.tanggal.slice(0, 4);
      const m = t.tanggal.slice(5, 7);
      return (
        (filterTahun === "semua" || y === filterTahun) &&
        (filterBulan === "semua" || m === filterBulan) &&
        (search === "" ||
          t.keterangan.toLowerCase().includes(search.toLowerCase()) ||
          t.kategori.toLowerCase().includes(search.toLowerCase()))
      );
    }),
    [list, filterTahun, filterBulan, search],
  );

  const total       = useMemo(() => filtered.reduce((s, t) => s + t.jumlah, 0), [filtered]);
  const totalAll    = useMemo(() => list.reduce((s, t) => s + t.jumlah, 0), [list]);

  const totalHalaman = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage     = Math.min(halaman, totalHalaman);
  const pageData     = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function handleTahunChange(y: string) {
    setFilterTahun(y);
    setFilterBulan("semua");
    setHalaman(1);
  }

  function openAdd() {
    setForm(EMPTY_FORM(jenis));
    setEditId(null);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(t: TransaksiAdmin) {
    const { id, ...rest } = t;
    setForm(rest);
    setEditId(id);
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editId) {
        const updated = await api<TransaksiAdmin>(`/api/transaksi/${editId}`, {
          method: "PUT", body: JSON.stringify(form),
        });
        setAllList(allList.map((t) => (t.id === editId ? updated : t)));
      } else {
        const created = await api<TransaksiAdmin>("/api/transaksi", {
          method: "POST", body: JSON.stringify(form),
        });
        setAllList([created, ...allList]);
      }
      setModalOpen(false);
      setHalaman(1);
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
      await api(`/api/transaksi/${deleteId}`, { method: "DELETE" });
      setAllList(allList.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Gagal menghapus transaksi.");
    } finally {
      setSaving(false);
    }
  }

  function exportLabel() {
    const tahun = filterTahun === "semua" ? "Semua Tahun" : `Tahun ${filterTahun}`;
    const bulan = filterBulan === "semua" ? "" : MONTHS_ID[parseInt(filterBulan) - 1];
    return bulan ? `${bulan} ${filterTahun === "semua" ? "" : filterTahun}`.trim() : tahun;
  }

  function exportFilename(ext: string) {
    const tahun = filterTahun === "semua" ? "semua" : filterTahun;
    const bulan = filterBulan === "semua" ? "" : `-${filterBulan}`;
    return `laporan-${jenis}-${tahun}${bulan}.${ext}`;
  }

  const summaryForExport = { masuk: isMasuk ? total : 0, keluar: isMasuk ? 0 : total, saldo: isMasuk ? total : -total };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{label}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? "Memuat…" : `${list.length} transaksi · Total ${rupiah(totalAll)}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Export */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => exportCSV(filtered, exportFilename("csv"))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FileDown size={14} strokeWidth={2} /> CSV
            </button>
            <button
              onClick={() => exportExcel(filtered, exportLabel(), summaryForExport, exportFilename("xlsx"))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <Sheet size={14} strokeWidth={2} /> Excel
            </button>
            <button
              onClick={() => printLaporan(filtered, exportLabel(), summaryForExport)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Printer size={14} strokeWidth={2} /> Print
            </button>
          </div>
          {/* Tambah */}
          <button
            onClick={openAdd}
            className={`flex items-center gap-2 text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl transition-colors ${
              isMasuk
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <Plus size={16} strokeWidth={2.5} />
            Tambah {label}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Summary Card */}
      <div className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 ${isMasuk ? "border-emerald-400" : "border-red-400"} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isMasuk ? "bg-emerald-50" : "bg-red-50"}`}>
            {isMasuk
              ? <TrendingUp  size={20} className="text-emerald-500" strokeWidth={2} />
              : <TrendingDown size={20} className="text-red-500"    strokeWidth={2} />
            }
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total {label}</p>
            <p className={`text-xl font-bold mt-0.5 ${isMasuk ? "text-emerald-600" : "text-red-600"}`}>
              {loading ? "…" : rupiah(totalAll)}
            </p>
          </div>
        </div>
        {filterTahun !== "semua" || filterBulan !== "semua" || search ? (
          <div className="text-right">
            <p className="text-[11px] text-gray-400">Filter aktif</p>
            <p className={`text-[15px] font-bold ${isMasuk ? "text-emerald-600" : "text-red-600"}`}>
              {rupiah(total)}
            </p>
            <p className="text-[11px] text-gray-400">{filtered.length} transaksi</p>
          </div>
        ) : null}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
          <input
            type="text"
            placeholder={`Cari ${label.toLowerCase()}…`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setHalaman(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>
        <select
          value={filterTahun}
          onChange={(e) => handleTahunChange(e.target.value)}
          className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          <option value="semua">Semua Tahun</option>
          {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={filterBulan}
          onChange={(e) => { setFilterBulan(e.target.value); setHalaman(1); }}
          className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          {BULAN_OPTIONS.map((b) => <option key={b.val} value={b.val}>{b.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-5 py-3 whitespace-nowrap">Tanggal</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3">Keterangan</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 hidden sm:table-cell">Kategori</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 whitespace-nowrap">Jumlah</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Memuat data…</td></tr>
              )}
              {!loading && pageData.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Tidak ada data {label.toLowerCase()}.</td></tr>
              )}
              {pageData.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-[12px] text-gray-500 whitespace-nowrap">
                    {new Date(t.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-700 max-w-56">
                    <p className="truncate">{t.keterangan}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                      isMasuk ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {t.kategori}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-bold text-[13px] whitespace-nowrap ${isMasuk ? "text-emerald-600" : "text-red-500"}`}>
                    {isMasuk ? "+" : "−"}{rupiah(t.jumlah)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => setDeleteId(t.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalHalaman > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-[12px] text-gray-400">
              {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} dari {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setHalaman((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >‹</button>
              {Array.from({ length: Math.min(totalHalaman, 5) }, (_, i) => {
                const p = totalHalaman <= 5
                  ? i + 1
                  : Math.max(1, Math.min(safePage - 2, totalHalaman - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setHalaman(p)}
                    className={`w-8 h-8 text-[12px] rounded-lg border transition-colors ${
                      p === safePage ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >{p}</button>
                );
              })}
              <button
                onClick={() => setHalaman((p) => Math.min(totalHalaman, p + 1))}
                disabled={safePage === totalHalaman}
                className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >›</button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL FORM ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5">
              {editId ? `Edit ${label}` : `Tambah ${label}`}
            </h2>
            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Jenis — read-only badge */}
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl ${isMasuk ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                {isMasuk
                  ? <TrendingUp  size={15} className="text-emerald-600" strokeWidth={2} />
                  : <TrendingDown size={15} className="text-red-500"    strokeWidth={2} />
                }
                <span className={`text-[13px] font-semibold ${isMasuk ? "text-emerald-700" : "text-red-600"}`}>
                  {label}
                </span>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Kategori <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {kategoriOpts.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Keterangan <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  placeholder="Deskripsi transaksi"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                    Tanggal <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                    Jumlah (Rp) <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.jumlah || ""}
                    onChange={(e) => setForm({ ...form, jumlah: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
              {form.jumlah > 0 && (
                <p className="text-[12px] text-gray-400 -mt-1">= {rupiah(form.jumlah)}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 py-2.5 rounded-xl text-white text-[14px] font-semibold disabled:opacity-60 ${
                    isMasuk ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
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
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1">Hapus Transaksi?</h3>
            <p className="text-[13px] text-gray-500 mb-5">Data tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[14px] font-semibold disabled:opacity-60"
              >
                {saving ? "Menghapus…" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
