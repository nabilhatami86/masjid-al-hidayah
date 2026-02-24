"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TOKEN, ADMIN_USERNAME, ADMIN_PASSWORD } from "@/lib/adminTypes";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, LogIn, Info } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm]         = useState({ username: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (form.username === ADMIN_USERNAME && form.password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_token", ADMIN_TOKEN);
        router.replace("/admin/dashboard");
      } else {
        setError("Username atau password salah.");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200 mb-4">
            <Image src="/logo.png" width={40} height={40} alt="Logo" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Selamat Datang</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke Panel Admin Masjid Al-Hidayah</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 transition-shadow"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 transition-shadow"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass
                    ? <EyeOff size={15} strokeWidth={2} />
                    : <Eye size={15} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[13px] px-3 py-2.5 rounded-xl">
                <Info size={14} strokeWidth={2} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-[15px] mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn size={16} strokeWidth={2.5} />
              )}
              {loading ? "Memverifikasi…" : "Masuk"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">Kredensial Demo</p>
              <div className="space-y-0.5">
                <p className="text-[12px] text-amber-600">Username: <code className="font-mono bg-amber-100 px-1 rounded">admin</code></p>
                <p className="text-[12px] text-amber-600">Password: <code className="font-mono bg-amber-100 px-1 rounded">admin123</code></p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-6">
          © {new Date().getFullYear()} Masjid Al-Hidayah
        </p>
      </div>
    </div>
  );
}
