import { NextRequest, NextResponse } from "next/server";
import { getAllGaleri, createGaleri } from "@/lib/controllers/galeriController";

export async function GET() {
  try {
    const data = await getAllGaleri();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data galeri" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { judul, deskripsi, image_url, kategori, tanggal } = body;
    if (!judul || !image_url || !tanggal) {
      return NextResponse.json({ error: "judul, image_url, tanggal wajib diisi" }, { status: 400 });
    }
    const item = await createGaleri({ judul, deskripsi: deskripsi ?? "", image_url, kategori: kategori ?? "Kegiatan", tanggal });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan data galeri" }, { status: 500 });
  }
}
