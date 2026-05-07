import type { Summary } from "../types";
import CountUpValue from "./CountUpValue";

interface Props {
  summary: Summary;
  dateRange: string;
  countStarted: boolean;
  aScale: () => string;
  aDelay: (ms: number) => React.CSSProperties;
}

export default function SummaryCards({ summary, dateRange, countStarted, aScale, aDelay }: Props) {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        className={`${aScale()} bg-white rounded-2xl shadow-sm p-5 border-l-4 border-emerald-400
          hover:-translate-y-1.5 hover:shadow-md transition-[transform,box-shadow] duration-200 cursor-default`}
        style={aDelay(60)}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Total Pemasukan
        </p>
        <p className="text-2xl font-bold text-emerald-600">
          <CountUpValue target={summary.masuk} start={countStarted} />
        </p>
        <p className="text-xs text-gray-400 mt-1">{dateRange}</p>
      </div>

      <div
        className={`${aScale()} bg-white rounded-2xl shadow-sm p-5 border-l-4 border-red-400
          hover:-translate-y-1.5 hover:shadow-md transition-[transform,box-shadow] duration-200 cursor-default`}
        style={aDelay(140)}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Total Pengeluaran
        </p>
        <p className="text-2xl font-bold text-red-500">
          <CountUpValue target={summary.keluar} start={countStarted} />
        </p>
        <p className="text-xs text-gray-400 mt-1">{dateRange}</p>
      </div>

      <div
        className={`${aScale()} bg-white rounded-2xl shadow-sm p-5 border-l-4 border-amber-400
          hover:-translate-y-1.5 hover:shadow-md transition-[transform,box-shadow] duration-200 cursor-default`}
        style={aDelay(220)}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Saldo Akhir
        </p>
        <p className={`text-2xl font-bold ${summary.saldo >= 0 ? "text-amber-600" : "text-red-600"}`}>
          <CountUpValue target={Math.abs(summary.saldo)} start={countStarted} />
        </p>
        <p className="text-xs text-gray-400 mt-1">Per {today}</p>
      </div>
    </div>
  );
}
