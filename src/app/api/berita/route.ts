import { NextResponse } from "next/server";
import { getAllBeritaAdmin, createBerita } from "@/lib/controllers/beritaController";

export async function GET() {
  try {
    const data = await getAllBeritaAdmin(); // admin lihat semua termasuk yg terjadwal
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await createBerita(body);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
