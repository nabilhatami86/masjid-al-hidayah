"use client";

import { useEffect, useState, useMemo } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import {
  KATEGORI_MASUK,
  KATEGORI_KELUAR,
  type TransaksiAdmin,
} from "@/lib/adminTypes";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const PER_PAGE = 12;
const PIE_COLORS = [
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f43f5e",
  "#06b6d4",
  "#84cc16",
  "#fb923c",
];

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatAxis(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "jt";
  if (n >= 1_000) return Math.round(n / 1_000) + "rb";
  return String(n);
}

const EMPTY_FORM: Omit<TransaksiAdmin, "id"> = {
  tanggal: new Date().toISOString().split("T")[0],
  keterangan: "",
  kategori: KATEGORI_MASUK[0],
  jenis: "masuk",
  jumlah: 0,
};

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request gagal.");
  return json as T;
}

export default function KeuanganAdminPage() {
  const [list, setList] = useState<TransaksiAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<TransaksiAdmin, "id">>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterBulan, setFilterBulan] = useState("semua");
  const [filterJenis, setFilterJenis] = useState<"semua" | "masuk" | "keluar">(
    "semua",
  );
  const [halaman, setHalaman] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<TransaksiAdmin[]>("/api/transaksi")
      .then(setList)
      .catch(() => setError("Gagal memuat data. Cek koneksi Supabase."))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
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
          method: "PUT",
          body: JSON.stringify(form),
        });
        setList(list.map((t) => (t.id === editId ? updated : t)));
      } else {
        const created = await api<TransaksiAdmin>("/api/transaksi", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setList([created, ...list]);
      }
      setModalOpen(false);
      setHalaman(1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan transaksi.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setSaving(true);
    try {
      await api(`/api/transaksi/${deleteId}`, { method: "DELETE" });
      setList(list.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Gagal menghapus transaksi.");
    } finally {
      setSaving(false);
    }
  }

  function handleJenisChange(j: "masuk" | "keluar") {
    setForm({
      ...form,
      jenis: j,
      kategori: j === "masuk" ? KATEGORI_MASUK[0] : KATEGORI_KELUAR[0],
    });
  }

  const BULAN_OPTIONS = [
    { val: "semua", label: "Semua Bulan" },
    ...Array.from({ length: 12 }, (_, i) => ({
      val: String(i + 1).padStart(2, "0"),
      label: MONTHS_ID[i],
    })),
  ];

  const filtered = useMemo(
    () =>
      list.filter((t) => {
        const m = t.tanggal.split("-")[1];
        return (
          (filterBulan === "semua" || m === filterBulan) &&
          (filterJenis === "semua" || t.jenis === filterJenis) &&
          (search === "" ||
            t.keterangan.toLowerCase().includes(search.toLowerCase()) ||
            t.kategori.toLowerCase().includes(search.toLowerCase()))
        );
      }),
    [list, filterBulan, filterJenis, search],
  );

  const totalHalaman = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(halaman, totalHalaman);
  const pageData = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );

  const summary = useMemo(() => {
    let masuk = 0,
      keluar = 0;
    for (const t of filtered) {
      if (t.jenis === "masuk") masuk += t.jumlah;
      else keluar += t.jumlah;
    }
    return { masuk, keluar, saldo: masuk - keluar };
  }, [filtered]);

  const totalSummary = useMemo(() => {
    let masuk = 0,
      keluar = 0;
    for (const t of list) {
      if (t.jenis === "masuk") masuk += t.jumlah;
      else keluar += t.jumlah;
    }
    return { masuk, keluar, saldo: masuk - keluar };
  }, [list]);

  const monthlyData = useMemo(() => {
    const months = MONTHS_ID.map((label) => ({
      bulan: label.slice(0, 3),
      Pemasukan: 0,
      Pengeluaran: 0,
    }));
    for (const t of list) {
      const m = parseInt(t.tanggal.split("-")[1]) - 1;
      if (m >= 0 && m < 12) {
        if (t.jenis === "masuk") months[m].Pemasukan += t.jumlah;
        else months[m].Pengeluaran += t.jumlah;
      }
    }
    return months;
  }, [list]);

  const kategoriMasukData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of list.filter((t) => t.jenis === "masuk")) {
      map[t.kategori] = (map[t.kategori] ?? 0) + t.jumlah;
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [list]);

  const kategoriKeluarData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of list.filter((t) => t.jenis === "keluar")) {
      map[t.kategori] = (map[t.kategori] ?? 0) + t.jumlah;
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [list]);

  const kategoriOpts =
    form.jenis === "masuk" ? KATEGORI_MASUK : KATEGORI_KELUAR;

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manajemen Keuangan
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? "Memuat…" : `${list.length} transaksi tercatat`}
                </p>
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                <Plus size={16} strokeWidth={2.5} />
                Tambah Transaksi
              </button>
            </div>

            {error && !modalOpen && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-emerald-400">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Total Pemasukan
                </p>
                <p className="text-lg font-bold text-emerald-600 mt-1 break-all">
                  {loading ? "…" : rupiah(totalSummary.masuk)}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-red-400">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Total Pengeluaran
                </p>
                <p className="text-lg font-bold text-red-500 mt-1 break-all">
                  {loading ? "…" : rupiah(totalSummary.keluar)}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-amber-400">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Saldo Kas
                </p>
                <p
                  className={`text-lg font-bold mt-1 break-all ${totalSummary.saldo >= 0 ? "text-amber-600" : "text-red-600"}`}
                >
                  {loading ? "…" : rupiah(totalSummary.saldo)}
                </p>
              </div>
            </div>

            {/* Filter + Search */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-45">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="Cari keterangan / kategori..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHalaman(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <select
                value={filterBulan}
                onChange={(e) => {
                  setFilterBulan(e.target.value);
                  setHalaman(1);
                }}
                className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                {BULAN_OPTIONS.map((b) => (
                  <option key={b.val} value={b.val}>
                    {b.label}
                  </option>
                ))}
              </select>
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                {(["semua", "masuk", "keluar"] as const).map((j) => (
                  <button
                    key={j}
                    onClick={() => {
                      setFilterJenis(j);
                      setHalaman(1);
                    }}
                    className={`px-3 py-2 text-[12px] font-medium transition-colors capitalize ${
                      filterJenis === j
                        ? j === "masuk"
                          ? "bg-emerald-500 text-white"
                          : j === "keluar"
                            ? "bg-red-500 text-white"
                            : "bg-gray-700 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {j === "semua"
                      ? "Semua"
                      : j === "masuk"
                        ? "Masuk"
                        : "Keluar"}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-summary filter */}
            {(filterBulan !== "semua" || filterJenis !== "semua" || search) && (
              <div className="flex gap-4 text-[13px] bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100">
                <span className="text-emerald-600 font-semibold">
                  Masuk: {rupiah(summary.masuk)}
                </span>
                <span className="text-red-500 font-semibold">
                  Keluar: {rupiah(summary.keluar)}
                </span>
                <span
                  className={`font-bold ${summary.saldo >= 0 ? "text-amber-600" : "text-red-600"}`}
                >
                  Selisih: {rupiah(summary.saldo)}
                </span>
                <span className="text-gray-400 ml-auto">
                  {filtered.length} transaksi
                </span>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-5 py-3 whitespace-nowrap">
                        Tanggal
                      </th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3">
                        Keterangan
                      </th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 hidden sm:table-cell">
                        Kategori
                      </th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 whitespace-nowrap">
                        Jumlah
                      </th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase px-5 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-400"
                        >
                          Memuat data…
                        </td>
                      </tr>
                    )}
                    {!loading && pageData.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-400"
                        >
                          Tidak ada transaksi.
                        </td>
                      </tr>
                    )}
                    {pageData.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3 text-[12px] text-gray-500 whitespace-nowrap">
                          {new Date(t.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-gray-700 max-w-55">
                          <p className="truncate">{t.keterangan}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {t.kategori}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-bold text-[13px] whitespace-nowrap ${t.jenis === "masuk" ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {t.jenis === "masuk" ? "+" : "-"}
                          {rupiah(t.jumlah)}
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
                    {(safePage - 1) * PER_PAGE + 1}–
                    {Math.min(safePage * PER_PAGE, filtered.length)} dari{" "}
                    {filtered.length}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setHalaman((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                      ‹
                    </button>
                    {Array.from(
                      { length: Math.min(totalHalaman, 5) },
                      (_, i) => {
                        const p =
                          totalHalaman <= 5
                            ? i + 1
                            : Math.max(
                                1,
                                Math.min(safePage - 2, totalHalaman - 4),
                              ) + i;
                        return (
                          <button
                            key={p}
                            onClick={() => setHalaman(p)}
                            className={`w-8 h-8 text-[12px] rounded-lg border transition-colors ${p === safePage ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                          >
                            {p}
                          </button>
                        );
                      },
                    )}
                    <button
                      onClick={() =>
                        setHalaman((p) => Math.min(totalHalaman, p + 1))
                      }
                      disabled={safePage === totalHalaman}
                      className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL FORM ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5">
              {editId ? "Edit Transaksi" : "Tambah Transaksi"}
            </h2>
            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Jenis Toggle */}
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                  Jenis Transaksi
                </label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleJenisChange("masuk")}
                    className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors ${form.jenis === "masuk" ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    + Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleJenisChange("keluar")}
                    className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors ${form.jenis === "keluar" ? "bg-red-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    − Pengeluaran
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Kategori <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={form.kategori}
                  onChange={(e) =>
                    setForm({ ...form, kategori: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {kategoriOpts.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
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
                  onChange={(e) =>
                    setForm({ ...form, keterangan: e.target.value })
                  }
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
                    onChange={(e) =>
                      setForm({ ...form, tanggal: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({
                        ...form,
                        jumlah: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
              {form.jumlah > 0 && (
                <p className="text-[12px] text-gray-400 -mt-1">
                  = {rupiah(form.jumlah)}
                </p>
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
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold disabled:opacity-60"
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
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle
                size={22}
                className="text-red-500"
                strokeWidth={2}
              />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1">
              Hapus Transaksi?
            </h3>
            <p className="text-[13px] text-gray-500 mb-5">
              Data tidak bisa dikembalikan.
            </p>
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
    </AdminGuard>
  );
}
