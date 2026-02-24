-- ============================================================
-- MASJID AL-HIDAYAH — SUPABASE SCHEMA
-- Jalankan file ini di: Supabase > SQL Editor > New Query
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── ENUM ────────────────────────────────────────────────────
-- Tidak pakai enum agar lebih fleksibel untuk perubahan via admin

-- ─── TABLE: khatib ──────────────────────────────────────────
create table if not exists khatib (
  id           uuid primary key default uuid_generate_v4(),
  nama         text not null,
  gelar        text not null default '',
  spesialisasi text not null default '',
  no_hp        text not null default '',
  email        text not null default '',
  aktif        boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── TABLE: jadwal ──────────────────────────────────────────
create table if not exists jadwal (
  id              uuid primary key default uuid_generate_v4(),
  tanggal         date not null,
  jenis_kegiatan  text not null,
  khatib_id       uuid references khatib(id) on delete set null,
  topik           text not null default '',
  waktu           text not null default '',     -- format "HH:MM"
  keterangan      text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── TABLE: transaksi ───────────────────────────────────────
create table if not exists transaksi (
  id           uuid primary key default uuid_generate_v4(),
  tanggal      date not null,
  keterangan   text not null,
  kategori     text not null,
  jenis        text not null check (jenis in ('masuk', 'keluar')),
  jumlah       bigint not null check (jumlah > 0),   -- dalam rupiah (integer)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── TRIGGER: auto-update updated_at ────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger khatib_updated_at
  before update on khatib
  for each row execute function update_updated_at();

create trigger jadwal_updated_at
  before update on jadwal
  for each row execute function update_updated_at();

create trigger transaksi_updated_at
  before update on transaksi
  for each row execute function update_updated_at();

-- ─── INDEXES ────────────────────────────────────────────────
create index if not exists idx_jadwal_tanggal      on jadwal(tanggal);
create index if not exists idx_jadwal_khatib_id    on jadwal(khatib_id);
create index if not exists idx_transaksi_tanggal   on transaksi(tanggal);
create index if not exists idx_transaksi_jenis     on transaksi(jenis);
create index if not exists idx_transaksi_kategori  on transaksi(kategori);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
-- Publik bisa READ semua tabel (untuk halaman website umum)
-- Hanya authenticated (admin) yang bisa INSERT / UPDATE / DELETE

alter table khatib    enable row level security;
alter table jadwal    enable row level security;
alter table transaksi enable row level security;

-- khatib: semua bisa baca, hanya admin yg bisa ubah
create policy "khatib_public_read"    on khatib    for select using (true);
create policy "khatib_admin_insert"   on khatib    for insert with check (auth.role() = 'authenticated');
create policy "khatib_admin_update"   on khatib    for update using (auth.role() = 'authenticated');
create policy "khatib_admin_delete"   on khatib    for delete using (auth.role() = 'authenticated');

-- jadwal: semua bisa baca, hanya admin yg bisa ubah
create policy "jadwal_public_read"    on jadwal    for select using (true);
create policy "jadwal_admin_insert"   on jadwal    for insert with check (auth.role() = 'authenticated');
create policy "jadwal_admin_update"   on jadwal    for update using (auth.role() = 'authenticated');
create policy "jadwal_admin_delete"   on jadwal    for delete using (auth.role() = 'authenticated');

-- transaksi: semua bisa baca, hanya admin yg bisa ubah
create policy "transaksi_public_read"  on transaksi for select using (true);
create policy "transaksi_admin_insert" on transaksi for insert with check (auth.role() = 'authenticated');
create policy "transaksi_admin_update" on transaksi for update using (auth.role() = 'authenticated');
create policy "transaksi_admin_delete" on transaksi for delete using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Khatib
-- ============================================================
insert into khatib (id, nama, gelar, spesialisasi, no_hp, email, aktif) values
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Dr. Adi Hidayat',         'Lc., M.A.', 'Tafsir & Hadist',     '081234567890', 'adi@example.com',    true),
  ('a1b2c3d4-0001-0000-0000-000000000002', 'Ustadz Khalid Basalamah', 'M.A.',      'Fiqih & Akidah',      '081234567891', 'khalid@example.com', true),
  ('a1b2c3d4-0001-0000-0000-000000000003', 'Ustadz Hanan Attaki',     'Lc.',       'Dakwah & Motivasi',   '081234567892', 'hanan@example.com',  true),
  ('a1b2c3d4-0001-0000-0000-000000000004', 'KH. Ahmad Dahlan',        'M.Ag.',     'Fiqih Muamalah',      '081234567893', 'dahlan@example.com', false),
  ('a1b2c3d4-0001-0000-0000-000000000005', 'Ustadz Felix Siauw',      '',          'Dakwah Kontemporer',  '081234567894', 'felix@example.com',  true)
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Jadwal
-- ============================================================
insert into jadwal (tanggal, jenis_kegiatan, khatib_id, topik, waktu, keterangan) values
  ('2024-12-06', 'Khutbah Jumat',    'a1b2c3d4-0001-0000-0000-000000000001', 'Keutamaan Ilmu dalam Islam',         '11:30', ''),
  ('2024-12-07', 'Kajian Sabtu',     'a1b2c3d4-0001-0000-0000-000000000002', 'Fiqih Sholat Lengkap',               '08:00', 'Bawa kitab Fiqhul Islam'),
  ('2024-12-13', 'Khutbah Jumat',    'a1b2c3d4-0001-0000-0000-000000000003', 'Menjaga Hati di Akhir Zaman',        '11:30', ''),
  ('2024-12-14', 'Tahsin Al-Qur''an','a1b2c3d4-0001-0000-0000-000000000001', 'Makharijul Huruf & Tajwid Dasar',    '09:00', 'Untuk semua level'),
  ('2024-12-20', 'Khutbah Jumat',    'a1b2c3d4-0001-0000-0000-000000000001', 'Persiapan Menyambut Tahun Baru',     '11:30', ''),
  ('2024-12-21', 'TPA Al-Hidayah',   'a1b2c3d4-0001-0000-0000-000000000005', 'Hafalan Juz 30 — Sesi 4',            '16:00', 'Khusus santri TPA'),
  ('2024-12-27', 'Khutbah Jumat',    'a1b2c3d4-0001-0000-0000-000000000002', 'Muhasabah & Resolusi Akhir Tahun',   '11:30', ''),
  ('2024-12-28', 'Kajian Sabtu',     'a1b2c3d4-0001-0000-0000-000000000003', 'Pemuda Islam & Tantangan Modern',    '08:00', '');

-- ============================================================
-- SEED DATA — Transaksi (Januari – Desember 2024)
-- ============================================================
insert into transaksi (tanggal, keterangan, kategori, jenis, jumlah) values
  -- JANUARI
  ('2024-01-05', 'Infaq Jumat pertama',         'Infaq Jumat',           'masuk',  2500000),
  ('2024-01-12', 'Infaq Jumat kedua',           'Infaq Jumat',           'masuk',  2300000),
  ('2024-01-19', 'Infaq Jumat ketiga',          'Infaq Jumat',           'masuk',  2800000),
  ('2024-01-26', 'Infaq Jumat keempat',         'Infaq Jumat',           'masuk',  2100000),
  ('2024-01-15', 'Kotak amal minggu 1',         'Kotak Amal',            'masuk',   850000),
  ('2024-01-22', 'Kotak amal minggu 2',         'Kotak Amal',            'masuk',   920000),
  ('2024-01-10', 'Donasi renovasi via transfer','Donasi Transfer',        'masuk',  5000000),
  ('2024-01-07', 'Listrik & air Januari',       'Listrik & Air',         'keluar',  750000),
  ('2024-01-14', 'Kebersihan masjid Januari',   'Kebersihan',            'keluar',  400000),
  ('2024-01-20', 'Operasional rutin Januari',   'Operasional',           'keluar',  600000),
  -- FEBRUARI
  ('2024-02-02', 'Infaq Jumat 1 Feb',           'Infaq Jumat',           'masuk',  2600000),
  ('2024-02-09', 'Infaq Jumat 2 Feb',           'Infaq Jumat',           'masuk',  2400000),
  ('2024-02-16', 'Infaq Jumat 3 Feb',           'Infaq Jumat',           'masuk',  2200000),
  ('2024-02-23', 'Infaq Jumat 4 Feb',           'Infaq Jumat',           'masuk',  2700000),
  ('2024-02-12', 'Kotak amal Feb',              'Kotak Amal',            'masuk',   780000),
  ('2024-02-19', 'Donasi kajian bulanan',       'Donasi Transfer',        'masuk',  1500000),
  ('2024-02-05', 'Listrik & air Feb',           'Listrik & Air',         'keluar',  720000),
  ('2024-02-18', 'Kebersihan masjid Feb',       'Kebersihan',            'keluar',  350000),
  ('2024-02-25', 'Biaya kajian Feb',            'Kajian & Kegiatan',     'keluar',  800000),
  -- MARET
  ('2024-03-01', 'Infaq Jumat 1 Mar',           'Infaq Jumat',           'masuk',  2900000),
  ('2024-03-08', 'Infaq Jumat 2 Mar',           'Infaq Jumat',           'masuk',  3100000),
  ('2024-03-15', 'Infaq Jumat 3 Mar',           'Infaq Jumat',           'masuk',  3500000),
  ('2024-03-22', 'Infaq Jumat 4 Mar',           'Infaq Jumat',           'masuk',  4200000),
  ('2024-03-29', 'Infaq Jumat 5 Mar',           'Infaq Jumat',           'masuk',  3800000),
  ('2024-03-10', 'Kotak amal Ramadan',          'Kotak Amal',            'masuk',  1500000),
  ('2024-03-17', 'Donasi Ramadan',              'Donasi Transfer',        'masuk', 10000000),
  ('2024-03-20', 'Zakat Fitrah awal',           'Zakat',                 'masuk',  5000000),
  ('2024-03-05', 'Listrik & air Mar',           'Listrik & Air',         'keluar',  780000),
  ('2024-03-12', 'Kebersihan marmer Mar',       'Kebersihan',            'keluar',  500000),
  ('2024-03-25', 'Kegiatan Ramadan',            'Kajian & Kegiatan',     'keluar', 2500000),
  -- APRIL
  ('2024-04-05', 'Infaq Jumat 1 Apr',           'Infaq Jumat',           'masuk',  2500000),
  ('2024-04-08', 'Zakat Fitrah terkumpul',      'Zakat',                 'masuk', 15000000),
  ('2024-04-09', 'Kotak amal Idul Fitri',       'Kotak Amal',            'masuk',  3200000),
  ('2024-04-12', 'Donasi Idul Fitri',           'Donasi Transfer',        'masuk',  8000000),
  ('2024-04-19', 'Infaq Jumat 2 Apr',           'Infaq Jumat',           'masuk',  2100000),
  ('2024-04-26', 'Infaq Jumat 3 Apr',           'Infaq Jumat',           'masuk',  1900000),
  ('2024-04-05', 'Listrik & air Apr',           'Listrik & Air',         'keluar',  750000),
  ('2024-04-15', 'Biaya Idul Fitri',            'Kajian & Kegiatan',     'keluar', 3500000),
  ('2024-04-22', 'Kebersihan pasca Lebaran',    'Kebersihan',            'keluar',  700000),
  -- MEI
  ('2024-05-03', 'Infaq Jumat 1 Mei',           'Infaq Jumat',           'masuk',  2300000),
  ('2024-05-10', 'Infaq Jumat 2 Mei',           'Infaq Jumat',           'masuk',  2500000),
  ('2024-05-17', 'Infaq Jumat 3 Mei',           'Infaq Jumat',           'masuk',  2400000),
  ('2024-05-24', 'Infaq Jumat 4 Mei',           'Infaq Jumat',           'masuk',  2200000),
  ('2024-05-31', 'Infaq Jumat 5 Mei',           'Infaq Jumat',           'masuk',  2100000),
  ('2024-05-15', 'Kotak amal Mei',              'Kotak Amal',            'masuk',   880000),
  ('2024-05-20', 'Donasi wakaf tanah',          'Wakaf',                 'masuk', 20000000),
  ('2024-05-05', 'Listrik & air Mei',           'Listrik & Air',         'keluar',  760000),
  ('2024-05-18', 'Operasional Mei',             'Operasional',           'keluar',  650000),
  ('2024-05-25', 'Renovasi kamar mandi',        'Pembangunan & Renovasi','keluar', 5000000),
  -- JUNI
  ('2024-06-07', 'Infaq Jumat 1 Jun',           'Infaq Jumat',           'masuk',  2800000),
  ('2024-06-14', 'Infaq Jumat 2 Jun',           'Infaq Jumat',           'masuk',  2600000),
  ('2024-06-21', 'Infaq Jumat 3 Jun',           'Infaq Jumat',           'masuk',  2400000),
  ('2024-06-28', 'Infaq Jumat 4 Jun',           'Infaq Jumat',           'masuk',  2700000),
  ('2024-06-10', 'Kotak amal Jun',              'Kotak Amal',            'masuk',   950000),
  ('2024-06-15', 'Donasi Al-Quran',             'Donasi Transfer',        'masuk',  3000000),
  ('2024-06-10', 'Listrik & air Jun',           'Listrik & Air',         'keluar',  800000),
  ('2024-06-17', 'Kebersihan Jun',              'Kebersihan',            'keluar',  400000),
  ('2024-06-22', 'Kajian rutin Jun',            'Kajian & Kegiatan',     'keluar',  900000),
  -- JULI
  ('2024-07-05', 'Infaq Jumat 1 Jul',           'Infaq Jumat',           'masuk',  2700000),
  ('2024-07-12', 'Infaq Jumat 2 Jul',           'Infaq Jumat',           'masuk',  2500000),
  ('2024-07-19', 'Infaq Jumat 3 Jul',           'Infaq Jumat',           'masuk',  2300000),
  ('2024-07-26', 'Infaq Jumat 4 Jul',           'Infaq Jumat',           'masuk',  2600000),
  ('2024-07-10', 'Kotak amal Jul',              'Kotak Amal',            'masuk',   870000),
  ('2024-07-20', 'Donasi pembangunan',          'Donasi Transfer',        'masuk',  7500000),
  ('2024-07-08', 'Listrik & air Jul',           'Listrik & Air',         'keluar',  850000),
  ('2024-07-15', 'Operasional Jul',             'Operasional',           'keluar',  680000),
  ('2024-07-22', 'Pengecatan dinding',          'Pembangunan & Renovasi','keluar', 8000000),
  -- AGUSTUS
  ('2024-08-02', 'Infaq Jumat 1 Agu',           'Infaq Jumat',           'masuk',  2900000),
  ('2024-08-09', 'Infaq Jumat 2 Agu',           'Infaq Jumat',           'masuk',  3200000),
  ('2024-08-16', 'Infaq Jumat 3 Agu',           'Infaq Jumat',           'masuk',  3500000),
  ('2024-08-23', 'Infaq Jumat 4 Agu',           'Infaq Jumat',           'masuk',  3100000),
  ('2024-08-30', 'Infaq Jumat 5 Agu',           'Infaq Jumat',           'masuk',  2800000),
  ('2024-08-17', 'Kotak amal HUT RI',           'Kotak Amal',            'masuk',  1200000),
  ('2024-08-20', 'Donasi wakaf karpet',         'Wakaf',                 'masuk',  4500000),
  ('2024-08-07', 'Listrik & air Agu',           'Listrik & Air',         'keluar',  820000),
  ('2024-08-14', 'Kebersihan Agu',              'Kebersihan',            'keluar',  450000),
  ('2024-08-21', 'Acara HUT RI masjid',         'Kajian & Kegiatan',     'keluar', 2000000),
  -- SEPTEMBER
  ('2024-09-06', 'Infaq Jumat 1 Sep',           'Infaq Jumat',           'masuk',  2600000),
  ('2024-09-13', 'Infaq Jumat 2 Sep',           'Infaq Jumat',           'masuk',  2400000),
  ('2024-09-20', 'Infaq Jumat 3 Sep',           'Infaq Jumat',           'masuk',  2500000),
  ('2024-09-27', 'Infaq Jumat 4 Sep',           'Infaq Jumat',           'masuk',  2300000),
  ('2024-09-10', 'Kotak amal Sep',              'Kotak Amal',            'masuk',   900000),
  ('2024-09-18', 'Donasi perbaikan atap',       'Donasi Transfer',        'masuk',  6000000),
  ('2024-09-05', 'Listrik & air Sep',           'Listrik & Air',         'keluar',  790000),
  ('2024-09-15', 'Operasional Sep',             'Operasional',           'keluar',  620000),
  ('2024-09-28', 'Perbaikan atap bocor',        'Pembangunan & Renovasi','keluar', 12000000),
  -- OKTOBER
  ('2024-10-04', 'Infaq Jumat 1 Okt',           'Infaq Jumat',           'masuk',  2700000),
  ('2024-10-11', 'Infaq Jumat 2 Okt',           'Infaq Jumat',           'masuk',  2500000),
  ('2024-10-18', 'Infaq Jumat 3 Okt',           'Infaq Jumat',           'masuk',  2800000),
  ('2024-10-25', 'Infaq Jumat 4 Okt',           'Infaq Jumat',           'masuk',  2600000),
  ('2024-10-15', 'Kotak amal Okt',              'Kotak Amal',            'masuk',   950000),
  ('2024-10-20', 'Donasi sound system',         'Donasi Transfer',        'masuk',  5000000),
  ('2024-10-07', 'Listrik & air Okt',           'Listrik & Air',         'keluar',  810000),
  ('2024-10-14', 'Kebersihan Okt',              'Kebersihan',            'keluar',  430000),
  ('2024-10-21', 'Beli sound system baru',      'Operasional',           'keluar', 15000000),
  -- NOVEMBER
  ('2024-11-01', 'Infaq Jumat 1 Nov',           'Infaq Jumat',           'masuk',  2500000),
  ('2024-11-08', 'Infaq Jumat 2 Nov',           'Infaq Jumat',           'masuk',  2300000),
  ('2024-11-15', 'Infaq Jumat 3 Nov',           'Infaq Jumat',           'masuk',  2600000),
  ('2024-11-22', 'Infaq Jumat 4 Nov',           'Infaq Jumat',           'masuk',  2800000),
  ('2024-11-29', 'Infaq Jumat 5 Nov',           'Infaq Jumat',           'masuk',  2100000),
  ('2024-11-12', 'Kotak amal Nov',              'Kotak Amal',            'masuk',   830000),
  ('2024-11-18', 'Donasi Maulid Nabi',          'Donasi Transfer',        'masuk',  4000000),
  ('2024-11-05', 'Listrik & air Nov',           'Listrik & Air',         'keluar',  770000),
  ('2024-11-16', 'Acara Maulid Nabi',           'Kajian & Kegiatan',     'keluar', 3500000),
  ('2024-11-25', 'Operasional Nov',             'Operasional',           'keluar',  600000),
  -- DESEMBER
  ('2024-12-06', 'Infaq Jumat 1 Des',           'Infaq Jumat',           'masuk',  2900000),
  ('2024-12-13', 'Infaq Jumat 2 Des',           'Infaq Jumat',           'masuk',  3000000),
  ('2024-12-20', 'Infaq Jumat 3 Des',           'Infaq Jumat',           'masuk',  3200000),
  ('2024-12-27', 'Infaq Jumat 4 Des',           'Infaq Jumat',           'masuk',  2800000),
  ('2024-12-10', 'Kotak amal Des',              'Kotak Amal',            'masuk',  1100000),
  ('2024-12-15', 'Donasi akhir tahun',          'Donasi Transfer',        'masuk',  7000000),
  ('2024-12-10', 'Listrik & air Des',           'Listrik & Air',         'keluar',  800000),
  ('2024-12-17', 'Kebersihan akhir tahun',      'Kebersihan',            'keluar',  500000),
  ('2024-12-22', 'Kajian akhir tahun',          'Kajian & Kegiatan',     'keluar', 2000000),
  ('2024-12-29', 'Operasional Des',             'Operasional',           'keluar',  650000);
