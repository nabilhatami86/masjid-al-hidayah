-- ============================================================
-- MIGRATION: Tambah tabel rekening (nomor rekening donasi)
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── TABLE ───────────────────────────────────────────────────
create table if not exists rekening (
  id         uuid primary key default uuid_generate_v4(),
  bank       text    not null,
  norek      text    not null,
  atas       text    not null,
  urutan     integer not null default 0,
  aktif      boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── AUTO updated_at ─────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists rekening_updated_at on rekening;
create trigger rekening_updated_at
  before update on rekening
  for each row execute function update_updated_at();

-- ─── INDEX ───────────────────────────────────────────────────
create index if not exists idx_rekening_urutan on rekening(urutan);

-- ─── RLS ─────────────────────────────────────────────────────
alter table rekening enable row level security;

drop policy if exists "rekening_public_read"  on rekening;
drop policy if exists "rekening_admin_insert" on rekening;
drop policy if exists "rekening_admin_update" on rekening;
drop policy if exists "rekening_admin_delete" on rekening;

create policy "rekening_public_read"   on rekening for select using (true);
create policy "rekening_admin_insert"  on rekening for insert with check (auth.role() = 'authenticated');
create policy "rekening_admin_update"  on rekening for update using (auth.role() = 'authenticated');
create policy "rekening_admin_delete"  on rekening for delete using (auth.role() = 'authenticated');


-- ============================================================
-- TABLE: pengaturan (global key-value settings, e.g. qris_url)
-- ============================================================
create table if not exists pengaturan (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

drop trigger if exists pengaturan_updated_at on pengaturan;
create trigger pengaturan_updated_at
  before update on pengaturan
  for each row execute function update_updated_at();

alter table pengaturan enable row level security;

drop policy if exists "pengaturan_public_read"   on pengaturan;
drop policy if exists "pengaturan_admin_insert"  on pengaturan;
drop policy if exists "pengaturan_admin_update"  on pengaturan;
drop policy if exists "pengaturan_admin_delete"  on pengaturan;

create policy "pengaturan_public_read"   on pengaturan for select using (true);
create policy "pengaturan_admin_insert"  on pengaturan for insert with check (auth.role() = 'authenticated');
create policy "pengaturan_admin_update"  on pengaturan for update using (auth.role() = 'authenticated');
create policy "pengaturan_admin_delete"  on pengaturan for delete using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET: qris (untuk gambar QRIS donasi)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('qris', 'qris', true)
on conflict (id) do nothing;

-- Policy: siapa saja bisa melihat/download gambar QRIS
drop policy if exists "qris_public_select" on storage.objects;
create policy "qris_public_select"
  on storage.objects for select
  using (bucket_id = 'qris');

-- Policy: siapa saja bisa upload (anon key) — cocok karena pakai service role di server
drop policy if exists "qris_public_insert" on storage.objects;
create policy "qris_public_insert"
  on storage.objects for insert
  with check (bucket_id = 'qris');

-- Policy: siapa saja bisa update/upsert
drop policy if exists "qris_public_update" on storage.objects;
create policy "qris_public_update"
  on storage.objects for update
  using (bucket_id = 'qris');

-- Policy: siapa saja bisa hapus
drop policy if exists "qris_public_delete" on storage.objects;
create policy "qris_public_delete"
  on storage.objects for delete
  using (bucket_id = 'qris');
