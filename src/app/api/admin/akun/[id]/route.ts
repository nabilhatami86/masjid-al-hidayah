import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { createHash } from "crypto";
import { getErrMsg } from "@/lib/apiError";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { username, password, nama, aktif } = await req.json();

    const updates: Record<string, unknown> = {};
    if (username !== undefined) updates.username = username.trim();
    if (nama !== undefined)     updates.nama = nama.trim();
    if (aktif !== undefined)    updates.aktif = aktif;
    if (password)               updates.password_hash = createHash("sha256").update(password).digest("hex");

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang diubah." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("admin_users")
      .update(updates)
      .eq("id", id)
      .select("id, username, nama, aktif, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Username sudah digunakan." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: getErrMsg(err, "Gagal mengubah akun.") }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    // Pastikan minimal 1 akun aktif tersisa
    const { count } = await supabase
      .from("admin_users")
      .select("id", { count: "exact", head: true })
      .eq("aktif", true);

    if ((count ?? 0) <= 1) {
      return NextResponse.json({ error: "Tidak bisa menghapus satu-satunya akun aktif." }, { status: 400 });
    }

    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: getErrMsg(err, "Gagal menghapus akun.") }, { status: 400 });
  }
}
