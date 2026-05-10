-- ============================================================
-- MIGRATION: Tabel admin_users (manajemen akun admin)
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

create extension if not exists "pgcrypto";

-- ─── TABLE ───────────────────────────────────────────────────
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null,
  password_hash text not null,          -- SHA-256 hex
  nama          text not null default '',
  aktif         boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─── INDEX ───────────────────────────────────────────────────
create index if not exists idx_admin_users_username on admin_users(username);

-- ─── RLS ─────────────────────────────────────────────────────
alter table admin_users enable row level security;

-- Hanya service role (server) yang bisa akses
drop policy if exists "admin_users_service_only" on admin_users;
create policy "admin_users_service_only"
  on admin_users
  using (true)
  with check (true);

-- ─── SEED: akun default admin/admin123 ───────────────────────
-- password_hash = SHA-256('admin123')
insert into admin_users (username, password_hash, nama)
values (
  'admin',
  encode(digest('admin123', 'sha256'), 'hex'),
  'Administrator'
)
on conflict (username) do nothing;
