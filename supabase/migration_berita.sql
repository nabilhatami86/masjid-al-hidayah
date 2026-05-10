-- ============================================================
-- MIGRATION: Tambah tabel berita & pengumuman
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── TABLE ───────────────────────────────────────────────────
create table if not exists berita (
  id         uuid primary key default uuid_generate_v4(),
  slug       text unique not null,
  judul      text not null,
  ringkasan  text not null default '',
  konten     text not null default '',
  kategori   text not null default 'Pengumuman',
  tanggal    date not null default current_date,
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

drop trigger if exists berita_updated_at on berita;
create trigger berita_updated_at
  before update on berita
  for each row execute function update_updated_at();

-- ─── INDEX ───────────────────────────────────────────────────
create index if not exists idx_berita_tanggal  on berita(tanggal desc);
create index if not exists idx_berita_kategori on berita(kategori);
create index if not exists idx_berita_slug     on berita(slug);

-- ─── RLS ─────────────────────────────────────────────────────
alter table berita enable row level security;

drop policy if exists "berita_public_read"   on berita;
drop policy if exists "berita_admin_insert"  on berita;
drop policy if exists "berita_admin_update"  on berita;
drop policy if exists "berita_admin_delete"  on berita;

create policy "berita_public_read"   on berita for select using (true);
create policy "berita_admin_insert"  on berita for insert with check (auth.role() = 'authenticated');
create policy "berita_admin_update"  on berita for update using (auth.role() = 'authenticated');
create policy "berita_admin_delete"  on berita for delete using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Berita (tanggal terkini: Mei 2026)
-- ============================================================
insert into berita (slug, judul, ringkasan, konten, kategori, tanggal) values

(
  'jadwal-imam-khatib-mei-2026',
  'Jadwal Imam & Khatib Bulan Mei 2026',
  'Berikut jadwal lengkap imam sholat 5 waktu dan khatib Jumat untuk bulan Mei 2026. Mohon jamaah hadir tepat waktu.',
  'Alhamdulillah, Pengurus Masjid Al-Hidayah telah menyusun jadwal imam dan khatib untuk bulan Mei 2026. Kami mengucapkan terima kasih kepada seluruh ustadz yang telah bersedia mengisi kegiatan di masjid kita.

Jadwal Khatib Jumat:
- Jumat, 9 Mei 2026 — Ustadz Ahmad Fauzi, S.Pd.I
- Jumat, 16 Mei 2026 — Ustadz Hasan Basri, Lc.
- Jumat, 23 Mei 2026 — Ustadz Muhammad Ridwan, M.Ag.
- Jumat, 30 Mei 2026 — Ustadz Ahmad Fauzi, S.Pd.I

Jadwal dapat berubah sewaktu-waktu. Pantau pengumuman di papan informasi masjid atau hubungi sekretariat untuk konfirmasi.',
  'Pengumuman',
  '2026-05-10'
),

(
  'kajian-fiqih-muamalah-digital-mei-2026',
  'Kajian Rutin: Fiqih Muamalah di Era Digital',
  'Kajian Sabtu pagi membahas hukum transaksi digital, jual beli online, dan investasi syariah bersama Ustadz Hasan Basri, Lc.',
  'Masjid Al-Hidayah menghadirkan kajian rutin Sabtu pagi dengan tema yang sangat relevan: Fiqih Muamalah di Era Digital.

Tema Kajian Bulan Mei:
- Sabtu, 10 Mei — Hukum Jual Beli Online
- Sabtu, 17 Mei — Investasi Saham & Reksa Dana Syariah
- Sabtu, 24 Mei — Dompet Digital dan Paylater dalam Pandangan Islam
- Sabtu, 31 Mei — Tanya Jawab & Studi Kasus

Kajian dipandu langsung oleh Ustadz Hasan Basri, Lc., alumni Universitas Al-Azhar Kairo. Terbuka untuk umum, laki-laki dan perempuan. Tidak dipungut biaya.

Waktu: Setiap Sabtu pukul 08:00 – 09:30 WIB
Tempat: Aula Utama Masjid Al-Hidayah',
  'Kajian',
  '2026-05-08'
),

(
  'renovasi-toilet-wudhu-selesai-2026',
  'Renovasi Toilet & Tempat Wudhu Masjid Telah Selesai',
  'Alhamdulillah, renovasi toilet dan area wudhu lantai 1 dan 2 telah rampung. Fasilitas baru lebih bersih, nyaman, dan ramah disabilitas.',
  'Alhamdulillah, dengan rahmat Allah SWT dan dukungan penuh dari seluruh jamaah serta donatur, renovasi toilet dan area wudhu Masjid Al-Hidayah telah resmi selesai.

Yang Telah Direnovasi:
- Toilet putra dan putri lantai 1 (12 bilik) — keramik baru, kloset duduk & jongkok
- Toilet lantai 2 (6 bilik) — perbaikan instalasi air dan pencahayaan LED
- Area wudhu putra: penambahan 8 kran wudhu stainless steel
- Area wudhu putri: pemasangan sekat privasi dan pencahayaan
- Instalasi 1 toilet khusus penyandang disabilitas

Total dana yang digunakan: Rp 87.500.000
Sumber dana: infak jamaah dan donatur yang mulia.

Laporan keuangan lengkap tersedia di halaman Laporan Keuangan website ini. Jazaakumullahu khairan katsiran.',
  'Renovasi',
  '2026-05-05'
),

(
  'pendaftaran-santri-tpa-2026-2027',
  'Pendaftaran Santri TPA Al-Hidayah Tahun Ajaran 2026/2027 Dibuka',
  'TPA Al-Hidayah membuka pendaftaran santri baru usia 5–15 tahun. Pendaftaran dibuka mulai 1–31 Mei 2026. Gratis biaya pendaftaran.',
  'Alhamdulillah, Taman Pendidikan Al-Qur''an (TPA) Masjid Al-Hidayah kembali membuka pendaftaran santri baru untuk tahun ajaran 2026/2027.

Syarat Pendaftaran:
- Usia 5–15 tahun
- Fotokopi Kartu Keluarga 1 lembar
- Pas foto 3x4 sebanyak 2 lembar
- Mengisi formulir pendaftaran di sekretariat masjid

Jadwal Belajar:
- Senin – Kamis: pukul 15:30 – 17:00 WIB
- Sabtu: pukul 08:00 – 09:30 WIB
- Bertempat di Gedung Serbaguna Masjid Al-Hidayah

Tidak ada biaya pendaftaran. Biaya SPP sangat terjangkau dan dapat diangsur. Tempat terbatas, segera daftarkan putra-putri Anda.

Hubungi: Ustadz Farid — 0812-3456-7890 (WA/Telp)',
  'Pendidikan',
  '2026-05-01'
)

on conflict (slug) do nothing;
