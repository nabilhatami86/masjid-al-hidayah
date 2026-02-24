/**
 * khatibController.ts
 * Business logic layer untuk data Khatib.
 * Dipanggil oleh API Route Handlers — BUKAN dari komponen client.
 */
import { createServerClient } from "@/lib/supabaseServer";
import type { Khatib } from "@/lib/adminTypes";

// ─── Row mapper ──────────────────────────────────────────────
function toKhatib(r: Record<string, unknown>): Khatib {
  return {
    id:           r.id           as string,
    nama:         r.nama         as string,
    gelar:        r.gelar        as string,
    spesialisasi: r.spesialisasi as string,
    noHp:         r.no_hp        as string,
    email:        r.email        as string,
    aktif:        r.aktif        as boolean,
    fotoUrl:      (r.foto_url    as string | null) ?? null,
  };
}

// ─── Controller functions ─────────────────────────────────────

/** GET semua khatib. Jika aktif=true, filter hanya yang aktif. */
export async function getAllKhatib(aktifOnly?: boolean): Promise<Khatib[]> {
  const sb = createServerClient();
  let q = sb.from("khatib").select("*").order("nama");
  if (aktifOnly) q = q.eq("aktif", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toKhatib);
}

/** GET satu khatib by id */
export async function getKhatibById(id: string): Promise<Khatib | null> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("khatib")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return toKhatib(data);
}

/** POST — buat khatib baru */
export async function createKhatib(body: Omit<Khatib, "id">): Promise<Khatib> {
  if (!body.nama?.trim()) throw new Error("Nama wajib diisi.");
  if (!body.spesialisasi?.trim()) throw new Error("Spesialisasi wajib diisi.");

  const sb = createServerClient();
  const { data, error } = await sb
    .from("khatib")
    .insert({
      nama:         body.nama.trim(),
      gelar:        body.gelar?.trim()        ?? "",
      spesialisasi: body.spesialisasi.trim(),
      no_hp:        body.noHp?.trim()         ?? "",
      email:        body.email?.trim()        ?? "",
      aktif:        body.aktif               ?? true,
      foto_url:     body.fotoUrl             ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return toKhatib(data);
}

/** PUT — update khatib */
export async function updateKhatib(
  id: string,
  body: Partial<Omit<Khatib, "id">>,
): Promise<Khatib> {
  const payload: Record<string, unknown> = {};
  if (body.nama !== undefined) payload.nama = body.nama.trim();
  if (body.gelar !== undefined) payload.gelar = body.gelar.trim();
  if (body.spesialisasi !== undefined)
    payload.spesialisasi = body.spesialisasi.trim();
  if (body.noHp !== undefined) payload.no_hp = body.noHp.trim();
  if (body.email !== undefined) payload.email = body.email.trim();
  if (body.aktif   !== undefined) payload.aktif    = body.aktif;
  if (body.fotoUrl !== undefined) payload.foto_url = body.fotoUrl ?? null;

  const sb = createServerClient();
  const { data, error } = await sb
    .from("khatib")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toKhatib(data);
}

/** PATCH — toggle status aktif */
export async function toggleKhatibAktif(
  id: string,
  aktif: boolean,
): Promise<Khatib> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("khatib")
    .update({ aktif })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toKhatib(data);
}

/** DELETE — hapus khatib */
export async function deleteKhatib(id: string): Promise<void> {
  const sb = createServerClient();
  const { error } = await sb.from("khatib").delete().eq("id", id);
  if (error) throw error;
}
