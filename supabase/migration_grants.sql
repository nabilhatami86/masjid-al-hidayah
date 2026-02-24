-- ============================================================
-- MIGRATION: Fix RLS + Grant write permissions untuk anon role
-- Error: new row violates row-level security policy (42501)
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Grant table-level permissions (SELECT/INSERT/UPDATE/DELETE)
--    Diperlukan karena anon key hanya punya SELECT secara default.
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
  on table khatib, jadwal, transaksi
  to anon, authenticated;

grant usage, select
  on all sequences in schema public
  to anon, authenticated;

-- 2. Recreate RLS policies dengan explicit TO anon, authenticated
--    Tanpa "TO ...", policy mungkin tidak diterapkan ke anon role.

drop policy if exists "allow_all_khatib"    on khatib;
drop policy if exists "allow_all_jadwal"    on jadwal;
drop policy if exists "allow_all_transaksi" on transaksi;

create policy "allow_all_khatib"
  on khatib for all
  to anon, authenticated
  using (true) with check (true);

create policy "allow_all_jadwal"
  on jadwal for all
  to anon, authenticated
  using (true) with check (true);

create policy "allow_all_transaksi"
  on transaksi for all
  to anon, authenticated
  using (true) with check (true);
