"use client";

import { useState, useMemo } from "react";
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
  Sector,
  LineChart,
  Line,
} from "recharts";
import {
  transaksiList,
  getMonthlyChart,
  getPieData,
  getPieMasukData,
  getSummary,
  type Transaksi,
} from "./data";

// ─── WARNA ───────────────────────────────────────────────────────────────────
const PIE_COLORS_KELUAR = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#06b6d4",
  "#8b5cf6",
];
const PIE_COLORS_MASUK = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#14b8a6",
];

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
function rupiahShort(n: number) {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp${(n / 1_000).toFixed(0)}rb`;
  return `Rp${n}`;
}

// ─── CUSTOM TOOLTIP BAR ───────────────────────────────────────────────────────
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="leading-relaxed">
          {p.name}: <span className="font-bold">{rupiah(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

// ─── CUSTOM PIE LABEL ─────────────────────────────────────────────────────────
function renderPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

// ─── ACTIVE PIE SHAPE ─────────────────────────────────────────────────────────
function ActiveShape(props: any) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * ((startAngle + endAngle) / 2));
  const cos = Math.cos(-RADIAN * ((startAngle + endAngle) / 2));
  const sx = cx + (outerRadius + 8) * cos;
  const sy = cy + (outerRadius + 8) * sin;
  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#374151"
        fontSize={12}
        fontWeight={600}
      >
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize={11}>
        {rupiah(value)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

// ─── KOMPONEN UTAMA ───────────────────────────────────────────────────────────
export default function LaporanKeuanganClient() {
  const summary = useMemo(() => getSummary(), []);
  const monthlyData = useMemo(() => getMonthlyChart(), []);
  const pieKeluar = useMemo(() => getPieData(), []);
  const pieMasuk = useMemo(() => getPieMasukData(), []);

  // Filter transaksi
  const [bulanFilter, setBulanFilter] = useState<string>("semua");
  const [jenisFilter, setJenisFilter] = useState<"semua" | "masuk" | "keluar">(
    "semua",
  );
  const [halaman, setHalaman] = useState(1);
  const [activePieK, setActivePieK] = useState(0);
  const [activePieM, setActivePieM] = useState(0);

  const BULAN_LIST = [
    { val: "semua", label: "Semua Bulan" },
    ...[
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ].map((m, i) => ({
      val: m,
      label: [
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
      ][i],
    })),
  ];

  const PER_PAGE = 10;

  const filtered: Transaksi[] = useMemo(() => {
    return transaksiList
      .filter((t) => {
        const bulanT = t.tanggal.split("-")[1];
        const cocokBulan = bulanFilter === "semua" || bulanT === bulanFilter;
        const cocokJenis = jenisFilter === "semua" || t.jenis === jenisFilter;
        return cocokBulan && cocokJenis;
      })
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [bulanFilter, jenisFilter]);

  const totalHalaman = Math.ceil(filtered.length / PER_PAGE);
  const tabelData = filtered.slice(
    (halaman - 1) * PER_PAGE,
    halaman * PER_PAGE,
  );

  function handleFilterBulan(v: string) {
    setBulanFilter(v);
    setHalaman(1);
  }
  function handleFilterJenis(v: "semua" | "masuk" | "keluar") {
    setJenisFilter(v);
    setHalaman(1);
  }

  const summaryFiltered = useMemo(() => {
    let m = 0,
      k = 0;
    for (const t of filtered) {
      if (t.jenis === "masuk") m += t.jumlah;
      else k += t.jumlah;
    }
    return { masuk: m, keluar: k };
  }, [filtered]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* ── HEADER ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Masjid Al-Hidayah · Ketintang, Surabaya · Tahun 2026
        </p>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pemasukan */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-emerald-400">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Pemasukan
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            {rupiah(summary.masuk)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Januari – Desember 2024</p>
        </div>
        {/* Pengeluaran */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-red-400">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Pengeluaran
          </p>
          <p className="text-2xl font-bold text-red-500">
            {rupiah(summary.keluar)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Januari – Desember 2024</p>
        </div>
        {/* Saldo */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-amber-400">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Saldo Akhir
          </p>
          <p
            className={`text-2xl font-bold ${summary.saldo >= 0 ? "text-amber-600" : "text-red-600"}`}
          >
            {rupiah(summary.saldo)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Per 31 Desember 2024</p>
        </div>
      </div>

      {/* ── BAR CHART (Pemasukan vs Pengeluaran per Bulan) ── */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-gray-800 mb-4">
          Pemasukan & Pengeluaran per Bulan
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={monthlyData}
            margin={{ top: 0, right: 8, left: -8, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={rupiahShort}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BarTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pengeluaran" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── LINE CHART (Saldo kumulatif) ── */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-gray-800 mb-4">
          Saldo Kumulatif Bulanan
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={monthlyData.reduce<{ bulan: string; Saldo: number }[]>(
              (acc, cur, i) => {
                const prev = acc[i - 1]?.Saldo ?? 0;
                acc.push({
                  bulan: cur.bulan,
                  Saldo: prev + cur.Pemasukan - cur.Pengeluaran,
                });
                return acc;
              },
              [],
            )}
            margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={rupiahShort}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number | undefined) =>
                v !== undefined ? rupiah(v) : ""
              }
              labelStyle={{ fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="Saldo"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#f59e0b" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── PIE CHARTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Pengeluaran */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-[15px] font-bold text-gray-800 mb-1">
            Komposisi Pengeluaran
          </h2>
          <p className="text-xs text-gray-400 mb-4">Klik slice untuk detail</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                {...({
                  activeIndex: activePieK,
                  activeShape: ActiveShape,
                } as any)}
                data={pieKeluar}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
                onMouseEnter={(_, i) => setActivePieK(i)}
                labelLine={false}
                label={renderPieLabel}
              >
                {pieKeluar.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS_KELUAR[i % PIE_COLORS_KELUAR.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Legenda */}
          <ul className="mt-3 space-y-1">
            {pieKeluar.map((d, i) => (
              <li
                key={d.name}
                className="flex items-center justify-between text-[12px]"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{
                      background:
                        PIE_COLORS_KELUAR[i % PIE_COLORS_KELUAR.length],
                    }}
                  />
                  {d.name}
                </span>
                <span className="font-semibold text-gray-700">
                  {rupiah(d.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pie Pemasukan */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-[15px] font-bold text-gray-800 mb-1">
            Komposisi Pemasukan
          </h2>
          <p className="text-xs text-gray-400 mb-4">Klik slice untuk detail</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                {...({
                  activeIndex: activePieM,
                  activeShape: ActiveShape,
                } as any)}
                data={pieMasuk}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
                onMouseEnter={(_, i) => setActivePieM(i)}
                labelLine={false}
                label={renderPieLabel}
              >
                {pieMasuk.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS_MASUK[i % PIE_COLORS_MASUK.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-1">
            {pieMasuk.map((d, i) => (
              <li
                key={d.name}
                className="flex items-center justify-between text-[12px]"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{
                      background: PIE_COLORS_MASUK[i % PIE_COLORS_MASUK.length],
                    }}
                  />
                  {d.name}
                </span>
                <span className="font-semibold text-gray-700">
                  {rupiah(d.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── TABEL TRANSAKSI ── */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-[15px] font-bold text-gray-800">
            Riwayat Transaksi
          </h2>
          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            <select
              value={bulanFilter}
              onChange={(e) => handleFilterBulan(e.target.value)}
              className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {BULAN_LIST.map((b) => (
                <option key={b.val} value={b.val}>
                  {b.label}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {(["semua", "masuk", "keluar"] as const).map((j) => (
                <button
                  key={j}
                  onClick={() => handleFilterJenis(j)}
                  className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    jenisFilter === j
                      ? j === "masuk"
                        ? "bg-emerald-500 text-white"
                        : j === "keluar"
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {j === "semua" ? "Semua" : j === "masuk" ? "Masuk" : "Keluar"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-summary filtered */}
        {bulanFilter !== "semua" || jenisFilter !== "semua" ? (
          <div className="flex gap-4 mb-4 text-[13px]">
            <span className="text-emerald-600 font-semibold">
              Masuk: {rupiah(summaryFiltered.masuk)}
            </span>
            <span className="text-red-500 font-semibold">
              Keluar: {rupiah(summaryFiltered.keluar)}
            </span>
            <span
              className={`font-bold ${summaryFiltered.masuk - summaryFiltered.keluar >= 0 ? "text-amber-600" : "text-red-600"}`}
            >
              Selisih: {rupiah(summaryFiltered.masuk - summaryFiltered.keluar)}
            </span>
          </div>
        ) : null}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase pb-2 pr-4 whitespace-nowrap">
                  Tanggal
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase pb-2 pr-4">
                  Keterangan
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase pb-2 pr-4 whitespace-nowrap">
                  Kategori
                </th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase pb-2 whitespace-nowrap">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tabelData.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-4 text-[12px] text-gray-500 whitespace-nowrap">
                    {new Date(t.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2.5 pr-4 text-[13px] text-gray-700">
                    {t.keterangan}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {t.kategori}
                    </span>
                  </td>
                  <td
                    className={`py-2.5 text-right font-semibold text-[13px] whitespace-nowrap ${
                      t.jenis === "masuk" ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {t.jenis === "masuk" ? "+" : "-"}
                    {rupiah(t.jumlah)}
                  </td>
                </tr>
              ))}
              {tabelData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-400 text-sm"
                  >
                    Tidak ada data transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalHalaman > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-[12px] text-gray-400">
              Menampilkan {(halaman - 1) * PER_PAGE + 1}–
              {Math.min(halaman * PER_PAGE, filtered.length)} dari{" "}
              {filtered.length} transaksi
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setHalaman((p) => Math.max(1, p - 1))}
                disabled={halaman === 1}
                className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹ Prev
              </button>
              {Array.from({ length: totalHalaman }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setHalaman(p)}
                    className={`w-8 h-8 text-[12px] rounded-lg border transition-colors ${
                      p === halaman
                        ? "bg-amber-500 text-white border-amber-500"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => setHalaman((p) => Math.min(totalHalaman, p + 1))}
                disabled={halaman === totalHalaman}
                className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CATATAN TRANSPARANSI ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-[13px] text-amber-800">
        <p className="font-bold mb-1">Catatan Transparansi</p>
        <p className="leading-relaxed text-amber-700">
          Laporan keuangan ini disusun oleh Pengurus Masjid Al-Hidayah dan
          disampaikan secara terbuka kepada jamaah. Untuk pertanyaan atau
          klarifikasi, silakan hubungi pengurus melalui email{" "}
          <a
            href="mailto:info@masjidalhidayah.id"
            className="underline font-semibold"
          >
            info@masjidalhidayah.id
          </a>
          .
        </p>
      </div>
    </div>
  );
}
