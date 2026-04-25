import { NextResponse } from "next/server";
import { updateRekening, deleteRekening } from "@/lib/controllers/rekeningController";
import { getErrMsg } from "@/lib/apiError";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body   = await req.json();
    const data   = await updateRekening(id, body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[PUT /api/rekening/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal update rekening.") }, { status: 400 });
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id }   = await ctx.params;
    const body     = await req.json() as Partial<{ aktif: boolean; urutan: number }>;
    const data     = await updateRekening(id, body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[PATCH /api/rekening/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal update rekening.") }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await deleteRekening(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/rekening/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal menghapus rekening.") }, { status: 500 });
  }
}
