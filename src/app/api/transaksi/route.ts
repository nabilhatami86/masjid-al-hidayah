/**
 * GET  /api/transaksi        → list semua transaksi
 * POST /api/transaksi        → buat transaksi baru
 */
import { NextResponse } from "next/server";
import { getAllTransaksi, createTransaksi } from "@/lib/controllers/transaksiController";
import { getErrMsg } from "@/lib/apiError";

export async function GET() {
  try {
    const data = await getAllTransaksi();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/transaksi]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal mengambil transaksi.") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createTransaksi(body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/transaksi]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal membuat transaksi.") }, { status: 400 });
  }
}
