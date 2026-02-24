/**
 * GET  /api/jadwal           → list semua jadwal (?mendatang=true untuk filter)
 * POST /api/jadwal           → buat jadwal baru
 */
import { NextResponse } from "next/server";
import { getAllJadwal, getJadwalMendatang, createJadwal } from "@/lib/controllers/jadwalController";
import { getErrMsg } from "@/lib/apiError";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mendatang = searchParams.get("mendatang") === "true";
    const limit     = parseInt(searchParams.get("limit") ?? "6");

    const data = mendatang
      ? await getJadwalMendatang(limit)
      : await getAllJadwal();

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/jadwal]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal mengambil jadwal.") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createJadwal(body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/jadwal]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal membuat jadwal.") }, { status: 400 });
  }
}
