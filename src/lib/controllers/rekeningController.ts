import { createServerClient } from "@/lib/supabaseServer";
import type { Rekening } from "@/lib/adminTypes";

function toRekening(r: Record<string, unknown>): Rekening {
  return {
    id:     r.id     as string,
    bank:   r.bank   as string,
    norek:  r.norek  as string,
    atas:   r.atas   as string,
    urutan: r.urutan as number,
    aktif:  r.aktif  as boolean,
  };
}

export async function getAllRekening(aktifOnly?: boolean): Promise<Rekening[]> {
  const sb = createServerClient();
  let q = sb.from("rekening").select("*").order("urutan").order("bank");
  if (aktifOnly) q = q.eq("aktif", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toRekening);
}

export async function createRekening(body: Omit<Rekening, "id">): Promise<Rekening> {
  if (!body.bank?.trim())  throw new Error("Nama bank wajib diisi.");
  if (!body.norek?.trim()) throw new Error("Nomor rekening wajib diisi.");
  if (!body.atas?.trim())  throw new Error("Nama pemilik rekening wajib diisi.");

  const sb = createServerClient();
  const { data, error } = await sb
    .from("rekening")
    .insert({
      bank:   body.bank.trim(),
      norek:  body.norek.trim(),
      atas:   body.atas.trim(),
      urutan: body.urutan ?? 0,
      aktif:  body.aktif  ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return toRekening(data);
}

export async function updateRekening(id: string, body: Partial<Omit<Rekening, "id">>): Promise<Rekening> {
  const payload: Record<string, unknown> = {};
  if (body.bank   !== undefined) payload.bank   = body.bank.trim();
  if (body.norek  !== undefined) payload.norek  = body.norek.trim();
  if (body.atas   !== undefined) payload.atas   = body.atas.trim();
  if (body.urutan !== undefined) payload.urutan = body.urutan;
  if (body.aktif  !== undefined) payload.aktif  = body.aktif;

  const sb = createServerClient();
  const { data, error } = await sb
    .from("rekening")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toRekening(data);
}

export async function deleteRekening(id: string): Promise<void> {
  const sb = createServerClient();
  const { error } = await sb.from("rekening").delete().eq("id", id);
  if (error) throw error;
}
