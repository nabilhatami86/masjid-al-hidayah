"use client";

import { useEffect, useState, useMemo } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Plus, Pencil, Trash2, AlertTriangle,
  UserCheck, UserX, Eye, EyeOff, ShieldCheck,
} from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  nama: string;
  aktif: boolean;
  created_at: string;
}

const EMPTY_FORM = { username: "", nama: "", password: "", konfirmasi: "" };

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request gagal.");
  return json as T;
}

export default function AdminAkunPage() {
  const [list, setList]             = useState<AdminUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [showPass, setShowPass] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  // Username akun yang sedang login (disimpan saat login)
  const currentUsername = typeof window !== "undefined"
    ? localStorage.getItem("admin_username") ?? ""
    : "";

  useEffect(() => {
    fetch("/api/admin/akun")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          if (res.status === 503) setNeedsMigration(true);
          else setError(json.error ?? "Gagal memuat data akun.");
          return;
        }
        setList(Array.isArray(json) ? json : []);
      })
      .catch(() => setError("Gagal terhubung ke server."))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError(null);
    setShowPass(false);
    setShowKonfirmasi(false);
    setModalOpen(true);
  }

  function openEdit(u: AdminUser) {
    setForm({ username: u.username, nama: u.nama, password: "", konfirmasi: "" });
    setEditId(u.id);
    setError(null);
    setShowPass(false);
    setShowKonfirmasi(false);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!editId && !form.password) {
      setError("Password wajib diisi untuk akun baru.");
      return;
    }
    if (form.password && form.password !== form.konfirmasi) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        username: form.username,
        nama: form.nama,
      };
      if (form.password) body.password = form.password;

      if (editId) {
        const updated = await api<AdminUser>(`/api/admin/akun/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        setList((prev) => prev.map((u) => (u.id === editId ? updated : u)));
      } else {
        const created = await api<AdminUser>("/api/admin/akun", {
          method: "POST",
          body: JSON.stringify(body),
        });
        setList((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan akun.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAktif(u: AdminUser) {
    if (u.username === currentUsername && u.aktif) {
      setError("Tidak bisa menonaktifkan akun yang sedang digunakan.");
      return;
    }
    try {
      const updated = await api<AdminUser>(`/api/admin/akun/${u.id}`, {
        method: "PUT",
        body: JSON.stringify({ aktif: !u.aktif }),
      });
      setList((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah status akun.");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setSaving(true);
    try {
      await api(`/api/admin/akun/${deleteId}`, { method: "DELETE" });
      setList((prev) => prev.filter((u) => u.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus akun.");
    } finally {
      setSaving(false);
    }
  }

  const deleteTarget = useMemo(
    () => list.find((u) => u.id === deleteId),
    [list, deleteId],
  );

  const isSelf = (u: AdminUser) => u.username === currentUsername;

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Akun</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? "Memuat…" : `${list.length} akun terdaftar`}
                </p>
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} />
                Tambah Akun
              </button>
            </div>

            {needsMigration && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 space-y-1">
                <p className="font-bold">Tabel belum dibuat di Supabase</p>
                <p>Jalankan file <code className="font-mono bg-amber-100 px-1 rounded">supabase/migration_admin_users.sql</code> di <strong>Supabase → SQL Editor → New Query</strong>, lalu refresh halaman ini.</p>
              </div>
            )}

            {error && !modalOpen && !deleteId && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-5 py-3">Nama</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3">Username</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase px-4 py-3 hidden sm:table-cell">Dibuat</th>
                    <th className="text-center text-[11px] font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                    <th className="text-right text-[11px] font-semibold text-gray-400 uppercase px-5 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">Memuat data…</td>
                    </tr>
                  )}
                  {!loading && list.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">Belum ada akun.</td>
                    </tr>
                  )}
                  {list.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <ShieldCheck size={15} className="text-amber-600" strokeWidth={2} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-gray-800">{u.nama || "—"}</p>
                            {isSelf(u) && (
                              <p className="text-[10px] text-amber-600 font-medium">Akun Anda</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-600 font-mono">{u.username}</td>
                      <td className="px-4 py-3 text-[12px] text-gray-400 hidden sm:table-cell whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleAktif(u)}
                          disabled={isSelf(u)}
                          title={isSelf(u) ? "Tidak bisa mengubah akun sendiri" : u.aktif ? "Nonaktifkan" : "Aktifkan"}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            u.aktif
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          } disabled:opacity-50 disabled:cursor-default`}
                        >
                          {u.aktif
                            ? <><UserCheck size={11} /> Aktif</>
                            : <><UserX size={11} /> Nonaktif</>}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Pencil size={15} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => setDeleteId(u.id)}
                            disabled={isSelf(u)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-default"
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

            <p className="text-[12px] text-gray-400 text-center">
              Password disimpan terenkripsi · Hapus akun tidak bisa dibatalkan
            </p>
          </div>
        </main>
      </div>

      {/* ── MODAL FORM ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5">
              {editId ? "Edit Akun" : "Tambah Akun Baru"}
            </h2>
            {error && <p className="text-red-500 text-[13px] mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3.5">

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Mis. Ahmad Fauzi"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                  placeholder="contoh: admin2"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 font-mono focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                  Password {editId ? <span className="text-gray-400 font-normal">(kosongkan jika tidak diganti)</span> : <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editId ? "••••••••" : "Min. 6 karakter"}
                    className="w-full border border-gray-200 rounded-xl px-3.5 pr-10 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <button type="button" onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {form.password && (
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                    Konfirmasi Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKonfirmasi ? "text" : "password"}
                      value={form.konfirmasi}
                      onChange={(e) => setForm({ ...form, konfirmasi: e.target.value })}
                      placeholder="Ulangi password"
                      className={`w-full border rounded-xl px-3.5 pr-10 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                        form.konfirmasi && form.password !== form.konfirmasi
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                    />
                    <button type="button" onClick={() => setShowKonfirmasi((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showKonfirmasi ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {form.konfirmasi && form.password !== form.konfirmasi && (
                    <p className="text-red-500 text-[11px] mt-1">Password tidak cocok</p>
                  )}
                </div>
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1">Hapus Akun?</h3>
            <p className="text-[13px] text-gray-500 mb-1">
              Akun <span className="font-mono font-semibold text-gray-700">{deleteTarget?.username}</span> akan dihapus permanen.
            </p>
            <p className="text-[12px] text-gray-400 mb-5">Data tidak bisa dikembalikan.</p>
            {error && <p className="text-red-500 text-[12px] mb-3">{error}</p>}
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
