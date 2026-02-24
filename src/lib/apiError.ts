/**
 * Extract a human-readable message from any thrown value.
 * Handles: Error instances, Supabase PostgrestError objects, plain strings.
 */
export function getErrMsg(err: unknown, fallback = "Terjadi kesalahan."): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (typeof e.message === "string" && e.message) return e.message;
    if (typeof e.error_description === "string") return e.error_description;
  }
  return fallback;
}
