"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { rupiah, rupiahShort, computeCumulativeSaldo } from "../utils";
import type { MonthlyEntry } from "../types";

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

function BarTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={String(p.name)} style={{ color: p.color }} className="leading-relaxed">
          {p.name}: <span className="font-bold">{rupiah(Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}

interface Props {
  monthlyData: MonthlyEntry[];
  aSlide: () => string;
  aDelay: (ms: number) => React.CSSProperties;
}

export default function ChartBatang({ monthlyData, aSlide, aDelay }: Props) {
  const cumulativeData = computeCumulativeSaldo(monthlyData);

  return (
    <>
      {/* Bar Chart */}
      <div className={`${aSlide()} bg-white rounded-2xl shadow-sm p-6`} style={aDelay(300)}>
        <h2 className="text-[15px] font-bold text-gray-800 mb-4">
          Pemasukan &amp; Pengeluaran per Bulan
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 0, right: 8, left: -8, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={rupiahShort} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip content={<BarTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="Pemasukan"   fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pengeluaran" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className={`${aSlide()} bg-white rounded-2xl shadow-sm p-6`} style={aDelay(390)}>
        <h2 className="text-[15px] font-bold text-gray-800 mb-4">
          Saldo Kumulatif Bulanan
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={cumulativeData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={rupiahShort} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: number | undefined) => (v != null ? rupiah(v) : "")}
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
    </>
  );
}
