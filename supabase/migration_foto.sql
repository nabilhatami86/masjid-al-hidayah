-- ============================================================
-- MIGRATION: Tambah kolom foto_url ke tabel khatib
-- + Setup Storage bucket untuk foto khatib
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Tambah kolom foto_url (nullable — opsional)
alter table khatib
  add column if not exists foto_url text default null;

-- 2. Buat Storage bucket "khatib-photos" (public bucket)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'khatib-photos',
  'khatib-photos',
  true,           -- public: URL langsung bisa diakses tanpa auth
  2097152,        -- max 2 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 3. Policy storage: siapa saja bisa lihat foto (public read)
drop policy if exists "khatib_photos_public_read" on storage.objects;
create policy "khatib_photos_public_read"
  on storage.objects for select
  using ( bucket_id = 'khatib-photos' );

-- 4. Policy storage: siapa saja bisa upload
drop policy if exists "khatib_photos_upload" on storage.objects;
create policy "khatib_photos_upload"
  on storage.objects for insert
  with check ( bucket_id = 'khatib-photos' );

-- 5. Policy storage: siapa saja bisa hapus
drop policy if exists "khatib_photos_delete" on storage.objects;
create policy "khatib_photos_delete"
  on storage.objects for delete
  using ( bucket_id = 'khatib-photos' );
