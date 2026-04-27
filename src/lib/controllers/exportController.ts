import type { TransaksiAdmin } from "@/lib/adminTypes";

const MONTHS_ID = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

function rupiahRaw(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function fmtTanggal(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS_ID[parseInt(m) - 1]} ${y}`;
}

// ── CSV ────────────────────────────────────────────────────────────────────
export function exportCSV(data: TransaksiAdmin[], filename = "laporan-keuangan.csv") {
  const header = ["Tanggal", "Keterangan", "Kategori", "Jenis", "Jumlah (Rp)"];
  const rows = data.map((t) => [
    fmtTanggal(t.tanggal),
    `"${t.keterangan.replace(/"/g, '""')}"`,
    t.kategori,
    t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran",
    t.jumlah,
  ]);

  const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

// ── EXCEL ──────────────────────────────────────────────────────────────────
export async function exportExcel(
  data: TransaksiAdmin[],
  label: string,
  summary: { masuk: number; keluar: number; saldo: number },
  filename = "laporan-keuangan.xlsx",
) {
  const XLSX = await import("xlsx");

  const rows = data.map((t) => ({
    Tanggal:        fmtTanggal(t.tanggal),
    Keterangan:     t.keterangan,
    Kategori:       t.kategori,
    Jenis:          t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran",
    "Jumlah (Rp)":  t.jumlah,
  }));

  // separator + summary rows
  (rows as object[]).push({});
  (rows as object[]).push({ Tanggal: "RINGKASAN" });
  (rows as object[]).push({ Tanggal: "Total Pemasukan",   "Jumlah (Rp)": summary.masuk   });
  (rows as object[]).push({ Tanggal: "Total Pengeluaran", "Jumlah (Rp)": summary.keluar  });
  (rows as object[]).push({ Tanggal: "Saldo Kas",         "Jumlah (Rp)": summary.saldo   });

  const ws = XLSX.utils.json_to_sheet(rows as object[]);
  ws["!cols"] = [
    { wch: 20 },
    { wch: 40 },
    { wch: 22 },
    { wch: 14 },
    { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, label.slice(0, 31));
  XLSX.writeFile(wb, filename);
}

// ── PRINT / PDF ────────────────────────────────────────────────────────────
export function printLaporan(
  data: TransaksiAdmin[],
  label: string,
  summary: { masuk: number; keluar: number; saldo: number },
) {
  const rows = data
    .map(
      (t) =>
        `<tr>
          <td>${fmtTanggal(t.tanggal)}</td>
          <td>${t.keterangan}</td>
          <td>${t.kategori}</td>
          <td style="color:${t.jenis === "masuk" ? "#059669" : "#ef4444"}">${t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran"}</td>
          <td style="text-align:right;font-weight:600;color:${t.jenis === "masuk" ? "#059669" : "#ef4444"}">
            ${t.jenis === "masuk" ? "+" : "-"} Rp ${rupiahRaw(t.jumlah)}
          </td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>Laporan Keuangan — Masjid Al-Hidayah</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; color: #1f2937; margin: 0; padding: 24px; }
  h1   { font-size: 16px; margin: 0 0 2px; }
  p.sub { color: #6b7280; margin: 0 0 16px; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th  { background: #f3f4f6; text-align: left; padding: 7px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
  td  { padding: 6px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .summary { margin-top: 20px; padding: 12px 16px; background: #f9fafb; border-radius: 8px; display: flex; gap: 32px; }
  .summary .item label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; display: block; }
  .summary .item span  { font-size: 14px; font-weight: 700; }
  .green { color: #059669; } .red { color: #ef4444; } .amber { color: #d97706; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
<h1>Laporan Keuangan — Masjid Al-Hidayah</h1>
<p class="sub">Ketintang Baru XV No.20, Surabaya &nbsp;·&nbsp; ${label} &nbsp;·&nbsp; Dicetak: ${new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" })}</p>
<table>
  <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jenis</th><th style="text-align:right">Jumlah</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="summary">
  <div class="item"><label>Total Pemasukan</label><span class="green">Rp ${rupiahRaw(summary.masuk)}</span></div>
  <div class="item"><label>Total Pengeluaran</label><span class="red">Rp ${rupiahRaw(summary.keluar)}</span></div>
  <div class="item"><label>Saldo Kas</label><span class="${summary.saldo >= 0 ? "amber" : "red"}">Rp ${rupiahRaw(summary.saldo)}</span></div>
</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

// ── helper ─────────────────────────────────────────────────────────────────
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
