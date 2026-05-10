import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { createHash } from "crypto";
import { getErrMsg } from "@/lib/apiError";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, nama, aktif, created_at")
      .order("created_at", { ascending: true });

    // Tabel belum dibuat → return array kosong agar halaman tidak crash
    if (error?.code === "42P01") return NextResponse.json([]);
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    return NextResponse.json({ error: getErrMsg(err, "Gagal mengambil data akun.") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { username, password, nama } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
    }

    const password_hash = createHash("sha256").update(password).digest("hex");
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("admin_users")
      .insert([{ username: username.trim(), password_hash, nama: nama?.trim() ?? "" }])
      .select("id, username, nama, aktif, created_at")
      .single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Username sudah digunakan." }, { status: 409 });
      if (error.code === "42P01") return NextResponse.json({ error: "Tabel admin_users belum dibuat. Jalankan migration_admin_users.sql di Supabase SQL Editor." }, { status: 503 });
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: getErrMsg(err, "Gagal membuat akun.") }, { status: 400 });
  }
}
