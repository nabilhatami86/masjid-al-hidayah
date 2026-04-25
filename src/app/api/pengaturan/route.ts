import { NextResponse } from "next/server";
import { getPengaturan, setPengaturan } from "@/lib/controllers/pengaturanController";
import { getErrMsg } from "@/lib/apiError";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) return NextResponse.json({ error: "key wajib diisi." }, { status: 400 });
    const value = await getPengaturan(key);
    return NextResponse.json({ key, value });
  } catch (err) {
    return NextResponse.json({ error: getErrMsg(err, "Gagal mengambil pengaturan.") }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { key, value } = await req.json() as { key: string; value: string | null };
    if (!key) return NextResponse.json({ error: "key wajib diisi." }, { status: 400 });
    await setPengaturan(key, value);
    return NextResponse.json({ key, value });
  } catch (err) {
    return NextResponse.json({ error: getErrMsg(err, "Gagal menyimpan pengaturan.") }, { status: 500 });
  }
}
