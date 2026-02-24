/**
 * GET  /api/khatib          → list semua khatib (?aktif=true untuk filter)
 * POST /api/khatib          → buat khatib baru
 */
import { NextResponse } from "next/server";
import { getAllKhatib, createKhatib } from "@/lib/controllers/khatibController";
import { getErrMsg } from "@/lib/apiError";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const aktifOnly = searchParams.get("aktif") === "true";
    const data = await getAllKhatib(aktifOnly || undefined);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/khatib]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal mengambil data khatib.") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createKhatib(body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/khatib]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal membuat khatib.") }, { status: 400 });
  }
}
