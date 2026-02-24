/**
 * PUT    /api/transaksi/[id]  → update transaksi
 * DELETE /api/transaksi/[id]  → hapus transaksi
 */
import { NextResponse } from "next/server";
import { updateTransaksi, deleteTransaksi } from "@/lib/controllers/transaksiController";
import { getErrMsg } from "@/lib/apiError";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body   = await req.json();
    const data   = await updateTransaksi(id, body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[PUT /api/transaksi/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal update transaksi.") }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await deleteTransaksi(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/transaksi/[id]]", err);
    return NextResponse.json({ error: getErrMsg(err, "Gagal menghapus transaksi.") }, { status: 500 });
  }
}
