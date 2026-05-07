"use client";

import { useState } from "react";
import {
  PieChart, Pie, Cell, Sector, ResponsiveContainer,
  type PieLabelRenderProps, type PieSectorDataItem,
} from "recharts";
import { rupiah } from "../utils";
import { PIE_COLORS_KELUAR, PIE_COLORS_MASUK } from "../constants";
import type { PieEntry } from "../types";

// Extend Pie to accept activeIndex (recharts v3 removed it from TS types)
interface PieWithActiveIndexProps extends React.ComponentProps<typeof Pie> {
  activeIndex?: number;
}
const PieActive = Pie as React.ComponentType<PieWithActiveIndexProps>;

function renderPieLabel(props: PieLabelRenderProps): React.ReactElement | null {
  const { percent, midAngle } = props;
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const innerRadius = Number(props.innerRadius);
  const outerRadius = Number(props.outerRadius);
  const pct = percent ?? 0;
  if (pct < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + r * Math.sin(-(midAngle ?? 0) * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(pct * 100).toFixed(0)}%
    </text>
  );
}

function ActivePieShape(props: PieSectorDataItem): React.ReactElement {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#374151" fontSize={12} fontWeight={600}>
        {(payload as { name?: string })?.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize={11}>
        {rupiah(value)}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill as string} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 12} startAngle={startAngle} endAngle={endAngle} fill={fill as string} />
    </g>
  );
}

function PieCard({
  title,
  data,
  colors,
  emptyText,
}: {
  title: string;
  data: PieEntry[];
  colors: string[];
  emptyText: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-800 mb-1">{title}</h2>
      <p className="text-xs text-gray-400 mb-4">Klik slice untuk detail</p>
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <PieActive
                activeIndex={activeIndex}
                activeShape={ActivePieShape}
                data={data}
                cx="50%" cy="50%"
                innerRadius={65} outerRadius={95}
                dataKey="value"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                labelLine={false}
                label={renderPieLabel}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </PieActive>
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-1.5">
            {data.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: colors[i % colors.length] }} />
                  {d.name}
                </span>
                <span className="font-semibold text-gray-700">{rupiah(d.value)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm text-gray-400 py-8 text-center">{emptyText}</p>
      )}
    </div>
  );
}

interface Props {
  pieKeluar: PieEntry[];
  pieMasuk: PieEntry[];
  aSlide: () => string;
  aDelay: (ms: number) => React.CSSProperties;
}

export default function ChartPie({ pieKeluar, pieMasuk, aSlide, aDelay }: Props) {
  return (
    <div className={`${aSlide()} grid grid-cols-1 md:grid-cols-2 gap-4`} style={aDelay(470)}>
      <PieCard
        title="Komposisi Pengeluaran"
        data={pieKeluar}
        colors={PIE_COLORS_KELUAR}
        emptyText="Belum ada data pengeluaran"
      />
      <PieCard
        title="Komposisi Pemasukan"
        data={pieMasuk}
        colors={PIE_COLORS_MASUK}
        emptyText="Belum ada data pemasukan"
      />
    </div>
  );
}
