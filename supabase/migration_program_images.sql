-- ============================================================
-- MIGRATION: Tabel program_images + Storage bucket program-images
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── TABLE ───────────────────────────────────────────────────
create table if not exists program_images (
  key        text primary key,   -- e.g. "tpa-al-hidayah"
  image_url  text,
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

drop trigger if exists program_images_updated_at on program_images;
create trigger program_images_updated_at
  before update on program_images
  for each row execute function update_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────
alter table program_images enable row level security;

drop policy if exists "program_images_public_read"   on program_images;
drop policy if exists "program_images_admin_insert"  on program_images;
drop policy if exists "program_images_admin_update"  on program_images;
drop policy if exists "program_images_admin_delete"  on program_images;

create policy "program_images_public_read"   on program_images for select using (true);
create policy "program_images_admin_insert"  on program_images for insert with check (true);
create policy "program_images_admin_update"  on program_images for update using (true);
create policy "program_images_admin_delete"  on program_images for delete using (true);

-- ─── SEED: baris kosong untuk tiap program ───────────────────
insert into program_images (key, image_url) values
  ('tpa-al-hidayah',  null),
  ('kajian-sabtu',    null),
  ('wakaf-produktif', null),
  ('tahsin-alquran',  null)
on conflict (key) do nothing;

-- ============================================================
-- STORAGE BUCKET: program-images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('program-images', 'program-images', true)
on conflict (id) do nothing;

-- Policy: siapa saja bisa lihat foto program
drop policy if exists "program_images_storage_select" on storage.objects;
create policy "program_images_storage_select"
  on storage.objects for select
  using (bucket_id = 'program-images');

-- Policy: upload (dipakai oleh admin via anon key)
drop policy if exists "program_images_storage_insert" on storage.objects;
create policy "program_images_storage_insert"
  on storage.objects for insert
  with check (bucket_id = 'program-images');

-- Policy: replace/update foto
drop policy if exists "program_images_storage_update" on storage.objects;
create policy "program_images_storage_update"
  on storage.objects for update
  using (bucket_id = 'program-images');

-- Policy: hapus foto lama
drop policy if exists "program_images_storage_delete" on storage.objects;
create policy "program_images_storage_delete"
  on storage.objects for delete
  using (bucket_id = 'program-images');
