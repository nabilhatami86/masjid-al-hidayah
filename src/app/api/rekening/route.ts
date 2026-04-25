import { NextResponse } from "next/server";
import { getAllRekening, createRekening } from "@/lib/controllers/rekeningController";
import { getErrMsg } from "@/lib/apiError";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const aktifOnly = searchParams.get("aktif") === "true";
    const data = await getAllRekening(aktifOnly || undefined);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/rekening]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal mengambil data rekening.") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createRekening(body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/rekening]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal membuat rekening.") }, { status: 400 });
  }
}
