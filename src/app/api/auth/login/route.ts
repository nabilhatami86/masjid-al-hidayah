import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { createHash } from "crypto";
import { ADMIN_TOKEN, ADMIN_USERNAME, ADMIN_PASSWORD } from "@/lib/adminTypes";

function sha256(str: string) {
  return createHash("sha256").update(str).digest("hex");
}

function hardcodedLogin(username: string, password: string) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return NextResponse.json({
      token: ADMIN_TOKEN,
      user: { id: "default", username: ADMIN_USERNAME, nama: "Administrator" },
    });
  }
  return null;
}

export async function POST(req: Request) {
  let username = "";
  let password = "";

  try {
    const body = await req.json();
    username = body.username ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
  }

  try {
    const hash = sha256(password);
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, nama, aktif")
      .eq("username", username)
      .eq("password_hash", hash)
      .single();

    // Tabel ada dan credentials cocok
    if (!error && data) {
      if (!data.aktif) {
        return NextResponse.json({ error: "Akun tidak aktif. Hubungi administrator." }, { status: 403 });
      }
      return NextResponse.json({
        token: ADMIN_TOKEN,
        user: { id: data.id, username: data.username, nama: data.nama },
      });
    }

    // Tabel ada tapi credentials salah → coba fallback hardcoded
    // (error PGRST116 = row not found, bukan table not found)
    const isTableMissing = error?.code === "42P01";
    if (isTableMissing) {
      // Tabel belum dibuat → izinkan login hardcoded
      const fallback = hardcodedLogin(username, password);
      if (fallback) return fallback;
    }

    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  } catch {
    // Server error total → coba hardcoded
    const fallback = hardcodedLogin(username, password);
    if (fallback) return fallback;
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
