/**
 * PUT   /api/khatib/[id]    → update khatib
 * PATCH /api/khatib/[id]    → toggle status aktif  { aktif: boolean }
 * DELETE /api/khatib/[id]   → hapus khatib
 */
import { NextResponse } from "next/server";
import {
  updateKhatib,
  toggleKhatibAktif,
  deleteKhatib,
} from "@/lib/controllers/khatibController";
import { getErrMsg } from "@/lib/apiError";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body   = await req.json();
    const data   = await updateKhatib(id, body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[PUT /api/khatib/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal update khatib.") }, { status: 400 });
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id }    = await ctx.params;
    const { aktif } = await req.json() as { aktif: boolean };
    const data      = await toggleKhatibAktif(id, aktif);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[PATCH /api/khatib/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal toggle status.") }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await deleteKhatib(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/khatib/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal menghapus khatib.") }, { status: 500 });
  }
}
