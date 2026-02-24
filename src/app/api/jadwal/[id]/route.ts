/**
 * PUT    /api/jadwal/[id]   → update jadwal
 * DELETE /api/jadwal/[id]   → hapus jadwal
 */
import { NextResponse } from "next/server";
import { updateJadwal, deleteJadwal } from "@/lib/controllers/jadwalController";
import { getErrMsg } from "@/lib/apiError";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body   = await req.json();
    const data   = await updateJadwal(id, body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[PUT /api/jadwal/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal update jadwal.") }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await deleteJadwal(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/jadwal/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal menghapus jadwal.") }, { status: 500 });
  }
}
