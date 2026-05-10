-- ============================================================
-- MIGRATION: Tambah tabel galeri foto
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── TABLE ───────────────────────────────────────────────────
create table if not exists galeri (
  id         uuid primary key default uuid_generate_v4(),
  judul      text not null,
  deskripsi  text not null default '',
  image_url  text not null,
  kategori   text not null default 'Kegiatan',
  tanggal    date not null default current_date,
  created_at timestamptz not null default now()
);

-- ─── INDEX ───────────────────────────────────────────────────
create index if not exists idx_galeri_tanggal  on galeri(tanggal desc);
create index if not exists idx_galeri_kategori on galeri(kategori);

-- ─── RLS ─────────────────────────────────────────────────────
alter table galeri enable row level security;

drop policy if exists "galeri_public_read"   on galeri;
drop policy if exists "galeri_admin_insert"  on galeri;
drop policy if exists "galeri_admin_update"  on galeri;
drop policy if exists "galeri_admin_delete"  on galeri;

create policy "galeri_public_read"   on galeri for select using (true);
create policy "galeri_admin_insert"  on galeri for insert with check (auth.role() = 'authenticated');
create policy "galeri_admin_update"  on galeri for update using (auth.role() = 'authenticated');
create policy "galeri_admin_delete"  on galeri for delete using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET: galeri (untuk upload foto)
-- Buat manual di Supabase Dashboard > Storage > New Bucket
-- Nama: galeri, Public: true
-- Atau jalankan query berikut:
-- ============================================================
insert into storage.buckets (id, name, public)
values ('galeri', 'galeri', true)
on conflict (id) do nothing;

-- Policy storage: siapa saja bisa lihat foto
drop policy if exists "galeri_storage_select" on storage.objects;
create policy "galeri_storage_select"
  on storage.objects for select
  using (bucket_id = 'galeri');

-- Policy storage: hanya server (service role) yang bisa upload
drop policy if exists "galeri_storage_insert" on storage.objects;
create policy "galeri_storage_insert"
  on storage.objects for insert
  with check (bucket_id = 'galeri');

drop policy if exists "galeri_storage_delete" on storage.objects;
create policy "galeri_storage_delete"
  on storage.objects for delete
  using (bucket_id = 'galeri');
