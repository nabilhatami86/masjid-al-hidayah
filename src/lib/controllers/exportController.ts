import type { TransaksiAdmin } from "@/lib/adminTypes";

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

function rupiahRaw(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function fmtTanggal(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS_ID[parseInt(m) - 1]} ${y}`;
}

// ── CSV ────────────────────────────────────────────────────────────────────
export function exportCSV(
  data: TransaksiAdmin[],
  filename = "laporan-keuangan.csv",
) {
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
  const exceljs = await import("exceljs");
  const ExcelJS = exceljs.default ?? exceljs;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Masjid Al-Hidayah";
  wb.created = new Date();

  const ws = wb.addWorksheet(label.slice(0, 31), {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  // ── Lebar kolom ──
  ws.columns = [
    { key: "no",       width: 6  },
    { key: "tanggal",  width: 22 },
    { key: "ket",      width: 44 },
    { key: "kategori", width: 24 },
    { key: "jenis",    width: 14 },
    { key: "jumlah",   width: 22 },
  ];

  // ── Baris 1: Judul utama ──
  ws.mergeCells("A1:F1");
  const titleCell = ws.getCell("A1");
  titleCell.value = "LAPORAN KEUANGAN MASJID AL-HIDAYAH";
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FF1F2937" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
  ws.getRow(1).height = 32;

  // ── Baris 2: Sub-judul ──
  ws.mergeCells("A2:F2");
  const subCell = ws.getCell("A2");
  subCell.value = `Ketintang Baru XV No.20, Surabaya  ·  Periode: ${label}  ·  Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`;
  subCell.font = { name: "Arial", size: 10, color: { argb: "FF6B7280" } };
  subCell.alignment = { horizontal: "center", vertical: "middle" };
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
  ws.getRow(2).height = 20;

  // ── Baris 3: kosong pemisah ──
  ws.getRow(3).height = 6;

  // ── Baris 4: Header tabel ──
  const HEADER_COLS = ["No", "Tanggal", "Keterangan", "Kategori", "Jenis", "Jumlah (Rp)"];
  const headerRow = ws.getRow(4);
  HEADER_COLS.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { horizontal: i === 5 ? "right" : "center", vertical: "middle" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D6B48" } };
    cell.border = {
      top:    { style: "thin", color: { argb: "FF166534" } },
      bottom: { style: "thin", color: { argb: "FF166534" } },
      left:   { style: "thin", color: { argb: "FF166534" } },
      right:  { style: "thin", color: { argb: "FF166534" } },
    };
  });
  headerRow.height = 22;

  // ── Baris data ──
  const BORDER_LIGHT = {
    top:    { style: "hair" as const, color: { argb: "FFE5E7EB" } },
    bottom: { style: "hair" as const, color: { argb: "FFE5E7EB" } },
    left:   { style: "hair" as const, color: { argb: "FFE5E7EB" } },
    right:  { style: "hair" as const, color: { argb: "FFE5E7EB" } },
  };

  data.forEach((t, idx) => {
    const row = ws.addRow([
      idx + 1,
      fmtTanggal(t.tanggal),
      t.keterangan,
      t.kategori,
      t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran",
      t.jumlah,
    ]);
    row.height = 18;

    const isEven = idx % 2 === 1;
    const bgColor = isEven ? "FFF9FAFB" : "FFFFFFFF";
    const isMasuk = t.jenis === "masuk";

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cell.font = { name: "Arial", size: 10, color: { argb: "FF1F2937" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.border = BORDER_LIGHT;

      if (colNum === 1) cell.alignment = { horizontal: "center", vertical: "middle" };
      else if (colNum === 6) {
        cell.alignment = { horizontal: "right", vertical: "middle" };
        cell.numFmt = '"Rp "#,##0';
        cell.font = {
          name: "Arial", size: 10, bold: true,
          color: { argb: isMasuk ? "FF059669" : "FFEF4444" },
        };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", wrapText: colNum === 3 };
      }

      // Kolom Jenis: warna teks
      if (colNum === 5) {
        cell.font = {
          name: "Arial", size: 10, bold: true,
          color: { argb: isMasuk ? "FF059669" : "FFEF4444" },
        };
      }
    });
  });

  // ── Pemisah ──
  const sepRow = ws.addRow([]);
  sepRow.height = 10;

  // ── Ringkasan ──
  const SUMMARY_ITEMS: [string, number, string][] = [
    ["Total Pemasukan", summary.masuk,  "FF059669"],
    ["Total Pengeluaran", summary.keluar, "FFEF4444"],
    ["Saldo Kas", summary.saldo, summary.saldo >= 0 ? "FFD97706" : "FFEF4444"],
  ];

  SUMMARY_ITEMS.forEach(([label2, value, color]) => {
    const r = ws.addRow(["", "", "", "", label2, value]);
    r.height = 20;

    const labelCell = r.getCell(5);
    labelCell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF374151" } };
    labelCell.alignment = { horizontal: "right", vertical: "middle" };
    labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
    labelCell.border = { top: { style: "thin", color: { argb: "FFE5E7EB" } }, bottom: { style: "thin", color: { argb: "FFE5E7EB" } }, left: { style: "thin", color: { argb: "FFE5E7EB" } }, right: { style: "thin", color: { argb: "FFE5E7EB" } } };

    const valCell = r.getCell(6);
    valCell.font = { name: "Arial", size: 11, bold: true, color: { argb: color } };
    valCell.alignment = { horizontal: "right", vertical: "middle" };
    valCell.numFmt = '"Rp "#,##0';
    valCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
    valCell.border = { top: { style: "thin", color: { argb: "FFE5E7EB" } }, bottom: { style: "thin", color: { argb: "FFE5E7EB" } }, left: { style: "thin", color: { argb: "FFE5E7EB" } }, right: { style: "thin", color: { argb: "FFE5E7EB" } } };
  });

  // ── Download ──
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, filename);
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
<p class="sub">Ketintang Baru XV No.20, Surabaya &nbsp;·&nbsp; ${label} &nbsp;·&nbsp; Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
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
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
