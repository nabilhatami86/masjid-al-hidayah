-- ============================================================
-- MIGRATION: Seed jadwal kegiatan Mei – Juni 2026
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================
-- Khatib IDs (sesuai database):
--   a1b2c3d4-0001-0000-0000-000000000002 = Ustadz Khalid Basalamah, M.A.
--   a1b2c3d4-0001-0000-0000-000000000004 = KH. Ahmad Dahlan, M.Ag.
--   49926816-617c-48c1-a33a-7ee9ceff7c0b = Ustadz Rizky, Lc.
-- ============================================================

insert into jadwal (tanggal, jenis_kegiatan, khatib_id, topik, waktu, keterangan) values

-- ── MEI 2026 ──────────────────────────────────────────────────────────────────
('2026-05-15', 'Khutbah Jumat',     'a1b2c3d4-0001-0000-0000-000000000002', 'Keutamaan Menjaga Sholat Berjamaah',            '11:30', ''),
('2026-05-16', 'Kajian Sabtu',      '49926816-617c-48c1-a33a-7ee9ceff7c0b', 'Fiqih Muamalah: Hukum Jual Beli Online',        '08:00', 'Terbuka untuk umum'),
('2026-05-22', 'Khutbah Jumat',     '49926816-617c-48c1-a33a-7ee9ceff7c0b', 'Akhlak Muslim di Era Media Sosial',             '11:30', ''),
('2026-05-23', 'Tahsin Al-Qur''an', 'a1b2c3d4-0001-0000-0000-000000000002', 'Makharijul Huruf & Panjang Pendek Bacaan',      '09:00', 'Semua level diterima'),
('2026-05-29', 'Khutbah Jumat',     'a1b2c3d4-0001-0000-0000-000000000004', 'Mempersiapkan Generasi Qur''ani',               '11:30', ''),
('2026-05-30', 'Kajian Sabtu',      '49926816-617c-48c1-a33a-7ee9ceff7c0b', 'Investasi Saham & Reksa Dana Syariah',          '08:00', 'Terbuka untuk umum'),
('2026-05-31', 'TPA Al-Hidayah',    'a1b2c3d4-0001-0000-0000-000000000002', 'Hafalan Juz 30 — Surah An-Naba s/d An-Nazi''at','16:00', 'Khusus santri TPA'),

-- ── JUNI 2026 ─────────────────────────────────────────────────────────────────
('2026-06-05', 'Khutbah Jumat',     'a1b2c3d4-0001-0000-0000-000000000002', 'Birrul Walidain — Berbakti kepada Orang Tua',  '11:30', ''),
('2026-06-06', 'Kajian Sabtu',      '49926816-617c-48c1-a33a-7ee9ceff7c0b', 'Dompet Digital dan Pinjaman Online Syariah',   '08:00', 'Terbuka untuk umum'),
('2026-06-12', 'Khutbah Jumat',     '49926816-617c-48c1-a33a-7ee9ceff7c0b', 'Keutamaan Dzikir & Doa Setelah Sholat',        '11:30', ''),
('2026-06-13', 'Tahsin Al-Qur''an', 'a1b2c3d4-0001-0000-0000-000000000002', 'Hukum Nun Sukun & Tanwin',                     '09:00', 'Semua level diterima'),
('2026-06-19', 'Khutbah Jumat',     'a1b2c3d4-0001-0000-0000-000000000004', 'Sabar & Syukur dalam Kehidupan Sehari-hari',   '11:30', ''),
('2026-06-20', 'Kajian Sabtu',      '49926816-617c-48c1-a33a-7ee9ceff7c0b', 'Mengenal 99 Asmaul Husna — Bagian 1',          '08:00', 'Terbuka untuk umum'),
('2026-06-26', 'Khutbah Jumat',     'a1b2c3d4-0001-0000-0000-000000000002', 'Dakwah di Era Digital — Peluang & Tantangan',  '11:30', ''),
('2026-06-27', 'TPA Al-Hidayah',    '49926816-617c-48c1-a33a-7ee9ceff7c0b', 'Hafalan Juz 30 — Surah An-Naba''a s/d Al-Infithar','16:00','Khusus santri TPA')

on conflict do nothing;
