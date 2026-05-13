# Entity Relationship Diagram — Sistem Informasi Masjid Al-Hidayah

**Lokasi:** Ketintang Baru XV No.20, Kec. Gayungan, Surabaya
**Database:** PostgreSQL (Supabase)
**Diperbarui:** Mei 2026

---

```mermaid
erDiagram
    KHATIB {
        uuid    id           PK "Primary Key"
        text    nama         "NOT NULL"
        text    gelar        "default: kosong"
        text    spesialisasi "default: kosong"
        text    no_hp        "default: kosong"
        text    email        "default: kosong"
        boolean aktif        "default: true"
        text    foto_url     "nullable"
    }

    JADWAL {
        uuid id             PK "Primary Key"
        date tanggal        "NOT NULL"
        text jenis_kegiatan "NOT NULL"
        uuid khatib_id      FK "nullable — ON DELETE SET NULL"
        text topik          "default: kosong"
        text waktu          "format HH:MM"
        text keterangan     "default: kosong"
    }

    TRANSAKSI {
        uuid   id          PK "Primary Key"
        date   tanggal     "NOT NULL"
        text   keterangan  "NOT NULL"
        text   kategori    "NOT NULL"
        text   jenis       "CHECK: masuk | keluar"
        bigint jumlah      "dalam Rupiah, CHECK: > 0"
    }

    REKENING {
        uuid    id      PK "Primary Key"
        text    bank    "NOT NULL"
        text    norek   "NOT NULL"
        text    atas    "NOT NULL — nama pemilik rekening"
        integer urutan  "default: 0 — urutan tampil"
        boolean aktif   "default: true"
    }

    PENGATURAN {
        text key   PK "Primary Key"
        text value "nullable — nilai setting"
    }

    BERITA {
        uuid        id         PK "Primary Key"
        text        slug       "UNIQUE NOT NULL — URL-friendly"
        text        judul      "NOT NULL"
        text        ringkasan  "default: kosong"
        text        konten     "default: kosong — isi artikel"
        text        kategori   "default: Pengumuman"
        date        tanggal    "NOT NULL default: today"
        timestamptz created_at "default: now()"
    }

    GALERI {
        uuid        id         PK "Primary Key"
        text        judul      "NOT NULL"
        text        deskripsi  "default: kosong"
        text        image_url  "NOT NULL — URL dari Storage"
        text        kategori   "default: Kegiatan"
        date        tanggal    "NOT NULL default: today"
        timestamptz created_at "default: now()"
    }

    PROGRAM_IMAGES {
        text        key        PK "Primary Key — slug program"
        text        image_url  "nullable — URL dari Storage"
        timestamptz updated_at "auto-update on change"
    }

    ADMIN_USERS {
        uuid        id            PK "Primary Key"
        text        username      "UNIQUE NOT NULL"
        text        password_hash "NOT NULL — SHA-256 hex"
        text        nama          "default: kosong"
        boolean     aktif         "default: true"
        timestamptz created_at    "default: now()"
    }

    KHATIB ||--o{ JADWAL : "mengisi"
```

---

## Keterangan Tabel

### KHATIB

Menyimpan data penceramah/khatib yang terdaftar di masjid.

| Kolom          | Tipe    | Keterangan                                |
| -------------- | ------- | ----------------------------------------- |
| `id`           | UUID    | Primary key, di-generate otomatis         |
| `nama`         | TEXT    | Nama lengkap khatib                       |
| `gelar`        | TEXT    | Gelar akademik (contoh: Lc., M.A.)        |
| `spesialisasi` | TEXT    | Bidang keahlian (contoh: Tafsir & Hadist) |
| `no_hp`        | TEXT    | Nomor handphone                           |
| `email`        | TEXT    | Alamat email                              |
| `aktif`        | BOOLEAN | Status aktif/tidak aktif                  |
| `foto_url`     | TEXT    | URL foto dari Storage (opsional)          |

---

### JADWAL

Menyimpan jadwal kegiatan masjid (khutbah, kajian, TPA, dll).

| Kolom            | Tipe | Keterangan                                 |
| ---------------- | ---- | ------------------------------------------ |
| `id`             | UUID | Primary key, di-generate otomatis          |
| `tanggal`        | DATE | Tanggal kegiatan (YYYY-MM-DD)              |
| `jenis_kegiatan` | TEXT | Jenis kegiatan (lihat enum di bawah)       |
| `khatib_id`      | UUID | Foreign key ke tabel KHATIB (boleh kosong) |
| `topik`          | TEXT | Topik/tema kegiatan                        |
| `waktu`          | TEXT | Jam kegiatan format HH:MM                  |
| `keterangan`     | TEXT | Catatan tambahan                           |

---

### TRANSAKSI

Menyimpan seluruh transaksi keuangan masjid (pemasukan & pengeluaran).

| Kolom        | Tipe   | Keterangan                                  |
| ------------ | ------ | ------------------------------------------- |
| `id`         | UUID   | Primary key, di-generate otomatis           |
| `tanggal`    | DATE   | Tanggal transaksi (YYYY-MM-DD)              |
| `keterangan` | TEXT   | Deskripsi transaksi                         |
| `kategori`   | TEXT   | Kategori transaksi (lihat enum di bawah)    |
| `jenis`      | TEXT   | `masuk` = pemasukan, `keluar` = pengeluaran |
| `jumlah`     | BIGINT | Nominal dalam Rupiah (harus > 0)            |

---

### REKENING

Menyimpan nomor rekening bank untuk halaman donasi/wakaf yang ditampilkan di halaman publik.

| Kolom    | Tipe    | Keterangan                                    |
| -------- | ------- | --------------------------------------------- |
| `id`     | UUID    | Primary key, di-generate otomatis             |
| `bank`   | TEXT    | Nama bank (contoh: BSI, Mandiri Syariah)      |
| `norek`  | TEXT    | Nomor rekening                                |
| `atas`   | TEXT    | Nama pemilik rekening                         |
| `urutan` | INTEGER | Urutan tampil di halaman (angka kecil = atas) |
| `aktif`  | BOOLEAN | Jika false, rekening disembunyikan dari publik |

---

### PENGATURAN

Menyimpan konfigurasi global sistem (key-value). Digunakan untuk menyimpan URL gambar QRIS donasi.

| Kolom   | Tipe | Keterangan                                      |
| ------- | ---- | ----------------------------------------------- |
| `key`   | TEXT | Primary key (contoh: `qris_url`)                |
| `value` | TEXT | Nilai setting, misal URL gambar QRIS (nullable) |

---

### BERITA

Menyimpan artikel berita dan pengumuman yang dikelola admin dan ditampilkan di halaman publik.

| Kolom        | Tipe        | Keterangan                                                       |
| ------------ | ----------- | ---------------------------------------------------------------- |
| `id`         | UUID        | Primary key, di-generate otomatis                                |
| `slug`       | TEXT        | URL-friendly identifier, unik (contoh: `kajian-sabtu-mei-2026`) |
| `judul`      | TEXT        | Judul berita/pengumuman                                          |
| `ringkasan`  | TEXT        | Ringkasan singkat untuk preview card                             |
| `konten`     | TEXT        | Isi artikel lengkap (paragraf dipisah dengan baris kosong)       |
| `kategori`   | TEXT        | Pengumuman / Kajian / Pendidikan / Infrastruktur / Sosial / Renovasi |
| `tanggal`    | DATE        | Tanggal publikasi (YYYY-MM-DD)                                   |
| `created_at` | TIMESTAMPTZ | Waktu data dibuat                                                |

---

### GALERI

Menyimpan foto dokumentasi kegiatan masjid yang dikelola admin dan ditampilkan di halaman galeri publik maupun preview di beranda.

| Kolom        | Tipe        | Keterangan                                                |
| ------------ | ----------- | --------------------------------------------------------- |
| `id`         | UUID        | Primary key, di-generate otomatis                         |
| `judul`      | TEXT        | Judul/nama foto                                           |
| `deskripsi`  | TEXT        | Deskripsi foto (opsional, tampil saat hover di beranda)   |
| `image_url`  | TEXT        | URL publik dari Supabase Storage bucket `galeri`          |
| `kategori`   | TEXT        | Kegiatan / Kajian / Renovasi / Sosial / Ramadan / Lainnya |
| `tanggal`    | DATE        | Tanggal foto diambil                                      |
| `created_at` | TIMESTAMPTZ | Waktu data dibuat                                         |

---

### PROGRAM_IMAGES

Menyimpan URL foto untuk masing-masing program unggulan masjid yang ditampilkan di halaman beranda.

| Kolom        | Tipe        | Keterangan                                               |
| ------------ | ----------- | -------------------------------------------------------- |
| `key`        | TEXT        | Primary key — slug program (contoh: `tpa-al-hidayah`)   |
| `image_url`  | TEXT        | URL publik dari Supabase Storage bucket `program-images` |
| `updated_at` | TIMESTAMPTZ | Auto-update setiap kali data diubah                      |

**Nilai `key` yang tersedia:**

| key               | Program          |
| ----------------- | ---------------- |
| `tpa-al-hidayah`  | TPA Al-Hidayah   |
| `kajian-sabtu`    | Kajian Sabtu     |
| `wakaf-produktif` | Wakaf Produktif  |
| `tahsin-alquran`  | Tahsin Al-Qur'an |

---

### ADMIN_USERS

Menyimpan akun admin yang dapat mengakses panel administrasi. Password disimpan sebagai hash SHA-256.

| Kolom           | Tipe        | Keterangan                                          |
| --------------- | ----------- | --------------------------------------------------- |
| `id`            | UUID        | Primary key, di-generate otomatis                   |
| `username`      | TEXT        | Username unik untuk login (lowercase, tanpa spasi)  |
| `password_hash` | TEXT        | Hash SHA-256 dari password                          |
| `nama`          | TEXT        | Nama lengkap admin (untuk tampilan sidebar)         |
| `aktif`         | BOOLEAN     | Jika false, akun tidak bisa login                   |
| `created_at`    | TIMESTAMPTZ | Waktu akun dibuat                                   |

> Migration: `supabase/migration_admin_users.sql` — seed otomatis akun `admin` / `admin123`

---

## Relasi Antar Tabel

| Relasi          | Tipe                   | Keterangan                                                                                                                   |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| KHATIB → JADWAL | One-to-Many (opsional) | Satu khatib dapat mengisi banyak jadwal. Jika khatib dihapus, kolom `khatib_id` di jadwal menjadi NULL (ON DELETE SET NULL) |

> Tabel **REKENING**, **PENGATURAN**, **BERITA**, **GALERI**, **PROGRAM_IMAGES**, dan **ADMIN_USERS** berdiri sendiri tanpa relasi ke tabel lain.

---

## Nilai Enum

### Jenis Transaksi (`transaksi.jenis`)

| Nilai    | Keterangan                   |
| -------- | ---------------------------- |
| `masuk`  | Pemasukan / penerimaan kas   |
| `keluar` | Pengeluaran / pembayaran kas |

### Kategori Pemasukan (`transaksi.kategori`)

| Kategori        |
| --------------- |
| Infaq Jumat     |
| Kotak Amal      |
| Donasi Transfer |
| Wakaf           |
| Zakat           |

### Kategori Pengeluaran (`transaksi.kategori`)

| Kategori               |
| ---------------------- |
| Listrik & Air          |
| Kebersihan             |
| Operasional            |
| Kajian & Kegiatan      |
| Pembangunan & Renovasi |

### Jenis Kegiatan (`jadwal.jenis_kegiatan`)

| Jenis Kegiatan           |
| ------------------------ |
| Khutbah Jumat            |
| Kajian Sabtu             |
| Tahsin Al-Qur'an         |
| TPA Al-Hidayah           |
| Pengajian                |
| Maulid & Kegiatan Khusus |

### Kategori Berita (`berita.kategori`)

| Kategori      |
| ------------- |
| Pengumuman    |
| Kajian        |
| Pendidikan    |
| Infrastruktur |
| Sosial        |
| Renovasi      |

### Kategori Galeri (`galeri.kategori`)

| Kategori |
| -------- |
| Kegiatan |
| Kajian   |
| Renovasi |
| Sosial   |
| Ramadan  |
| Lainnya  |

---

## Flowchart Alur Sistem

### 1. Alur Akses Website

```mermaid
flowchart TD
    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Website]) --> P2{Pilih Menu}
        P2 -- Beranda --> P3[Lihat Info Masjid\nJadwal Sholat & Galeri]
        P2 -- Jadwal Kegiatan --> P4[Lihat Jadwal Kegiatan]
        P2 -- Laporan Keuangan --> P5[Lihat Laporan Keuangan\nFilter Tahun & Bulan]
        P2 -- Berita & Pengumuman --> P6[Lihat Berita]
        P2 -- Jadwal Sholat --> P7[Lihat Jadwal Sholat Bulanan]
    end

    subgraph ADMIN["👤 Admin"]
        A1([Buka Halaman Admin]) --> A2{Sudah Login?}
        A2 -- Belum --> A3[Masukkan Username & Password]
        A3 --> A4{Cek DB admin_users}
        A4 -- Tidak cocok --> A5[Tampil Pesan Gagal]
        A5 --> A3
        A4 -- Cocok --> A6[Masuk ke Dasbor Admin]
        A2 -- Sudah --> A6
        A6 --> A7{Pilih Menu}
        A7 -- Konten --> A8[Khatib · Jadwal · Berita\nGaleri · Program Unggulan]
        A7 -- Keuangan --> A9{Sub-Menu}
        A9 -- Transaksi --> A10{Sub-Menu Transaksi}
        A10 -- Pemasukan --> A10a[Kelola Transaksi Masuk]
        A10 -- Pengeluaran --> A10b[Kelola Transaksi Keluar]
        A10 -- Arus Kas --> A10c[Laporan Alur Kas Bulanan]
        A9 -- Nomor Rekening --> A11[Kelola Rekening & QRIS]
    end
```

---

### 2. Alur Berita & Pengumuman

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin"]
        A1([Buka Menu Berita]) --> A2{Pilih Aksi}

        A2 -- Tambah --> A3[Isi Judul, Kategori, Tanggal\nRingkasan, Konten, Slug]
        A3 --> A4{Data Lengkap?}
        A4 -- Belum --> A3
        A4 -- Ya --> A5[Simpan ke tabel berita]

        A2 -- Edit --> A6[Ubah Data Berita]
        A6 --> A7[Simpan Perubahan]

        A2 -- Hapus --> A8{Yakin Hapus?}
        A8 -- Batal --> A2
        A8 -- Ya --> A9[Hapus dari DB]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Beranda]) --> P2[Lihat 3 Berita Terbaru]
        P2 --> P3[Klik Lihat Semua]
        P3 --> P4[Halaman /berita — semua berita]
        P4 --> P5[Klik Berita]
        P5 --> P6[Detail Berita]
    end

    A5 --> P2
    A7 --> P2
    A9 --> P2
```

---

### 3. Alur Galeri Foto

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin"]
        A1([Buka Galeri Foto]) --> A2{Pilih Aksi}

        A2 -- Upload Foto --> A3[Pilih File Gambar]
        A3 --> A4[Isi Judul, Kategori, Tanggal\nDeskripsi opsional]
        A4 --> A5[Upload ke Storage bucket galeri]
        A5 --> A6[Simpan URL ke tabel galeri]

        A2 -- Hapus --> A7{Yakin Hapus?}
        A7 -- Batal --> A2
        A7 -- Ya --> A8[Hapus dari Storage & DB]
    end

    subgraph BERANDA["🏠 Beranda"]
        B1[Section Galeri Foto] --> B2[Grid 6 Foto Terbaru\nAnimasi stagger masuk]
        B2 --> B3[Hover: judul + deskripsi + kategori]
        B2 --> B4[Klik → Lihat semua /galeri]
    end

    subgraph PUBLIK["👥 Pengunjung /galeri"]
        P1[Lihat Grid Masonry Foto] --> P2{Filter Kategori}
        P2 --> P3[Foto Terfilter]
        P3 --> P4[Klik Foto → Lightbox]
        P4 --> P5[Navigasi Panah Kiri/Kanan\nDot indicator · Counter]
    end

    A6 --> B1
    A6 --> P1
    A8 --> P1
```

---

### 4. Alur Jadwal Kegiatan

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin"]
        A1([Buka Jadwal]) --> A2{Pilih Aksi}

        A2 -- Tambah --> A3[Isi Tanggal, Jenis Kegiatan\nWaktu, Topik, Keterangan]
        A3 --> A4{Ada Khatib?}
        A4 -- Ya --> A5[Pilih Nama Khatib]
        A5 --> A6[Simpan Jadwal]
        A4 -- Tidak --> A6

        A2 -- Ubah --> A7[Edit Data Jadwal]
        A7 --> A8[Simpan Perubahan]

        A2 -- Hapus --> A9{Yakin Hapus?}
        A9 -- Batal --> A2
        A9 -- Ya --> A10[Hapus Jadwal]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Beranda]) --> P2[Lihat 6 Jadwal Mendatang]
        P2 --> P3[Klik Lihat Semua]
        P3 --> P4[Halaman /jadwal-kegiatan]
        P4 --> P5[Jadwal Mendatang & Sudah Berlalu]
    end

    A6 --> P2
    A8 --> P2
    A10 --> P2
```

---

### 5. Alur Keuangan

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin — Menu Transaksi"]
        A1([Buka Keuangan]) --> A2{Pilih Sub-Menu}

        A2 -- Pemasukan --> B1[Halaman Pemasukan\n/admin/keuangan/pemasukan]
        B1 --> B2{Aksi}
        B2 -- Tambah --> B3[Form Pemasukan\nKategori terkunci: Masuk]
        B3 --> B4[Isi Kategori, Keterangan\nJumlah, Tanggal]
        B4 --> B5[Simpan ke DB\njenis=masuk]
        B2 -- Edit --> B6[Ubah Data]
        B2 -- Hapus --> B7{Konfirmasi?}
        B7 -- Ya --> B8[Hapus dari DB]
        B2 -- Export --> B9[CSV / Excel / Print]

        A2 -- Pengeluaran --> C1[Halaman Pengeluaran\n/admin/keuangan/pengeluaran]
        C1 --> C2{Aksi}
        C2 -- Tambah --> C3[Form Pengeluaran\nKategori terkunci: Keluar]
        C3 --> C4[Isi Kategori, Keterangan\nJumlah, Tanggal]
        C4 --> C5[Simpan ke DB\njenis=keluar]
        C2 -- Edit --> C6[Ubah Data]
        C2 -- Hapus --> C7{Konfirmasi?}
        C7 -- Ya --> C8[Hapus dari DB]
        C2 -- Export --> C9[CSV / Excel / Print]

        A2 -- Arus Kas --> D1[Halaman Arus Kas\n/admin/laporan]
        D1 --> D2[Ringkasan per Bulan\nPemasukan · Pengeluaran · Saldo]
        D2 --> D3[Filter Tahun]
        D2 --> D4[Export CSV / Print]
        D1 --> D5[Widget Transaksi Terbaru]
    end

    subgraph PUBLIK["👥 Pengunjung /laporan-keuangan"]
        P1[Lihat Total Pemasukan\nPengeluaran & Saldo] --> P2[Filter Tahun]
        P2 --> P3{Pilih Bulan?}
        P3 -- Ya --> P4[Filter Bulan]
        P3 -- Tidak --> P5[Semua Bulan]
        P4 --> P6[Grafik & Tabel Terfilter]
        P5 --> P6
        P6 --> P7[Export CSV / Excel / Print]
    end

    B5 --> P1
    C5 --> P1
    B8 --> P1
    C8 --> P1
```

---

### 6. Alur Donasi

```mermaid
flowchart TD
    subgraph DONATUR["🙋 Donatur"]
        D1([Buka Halaman Donasi\ndi Beranda — section Kontak]) --> D2{Pilih Metode}
        D2 -- Transfer Bank --> D3[Lihat No. Rekening\nSalin & Transfer]
        D2 -- QRIS --> D4[Scan QR Code\nBayar via Bank / E-Wallet]
        D3 --> D5[Selesai ✓]
        D4 --> D5
    end

    subgraph ADMIN["👤 Admin"]
        D5 --> A1[Cek Notifikasi Mutasi]
        A1 --> A2([Buka Admin Keuangan\nMenu Pemasukan])
        A2 --> A3[Tambah Transaksi Pemasukan\nKategori: Donasi Transfer]
        A3 --> A4[(TRANSAKSI\nmasuk · Donasi Transfer)]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        A4 --> P1[Laporan Keuangan\ndiperbarui otomatis]
    end

    subgraph ADMIN_REKENING["👤 Admin — Nomor Rekening"]
        R1([Buka Menu Nomor Rekening]) --> R2{Pilih Aksi}
        R2 -- Tambah --> R3[Isi Bank, No. Rekening\nNama Pemilik, Urutan]
        R3 --> R4[Simpan ke DB]
        R2 -- Upload QRIS --> R5[Upload Gambar QR]
        R5 --> R6[Simpan URL ke PENGATURAN]
        R2 -- Toggle Aktif --> R7[Tampil / Sembunyikan di Beranda]
    end

    R4 --> D3
    R6 --> D4
```

---

### 7. Alur Kelola Akun Admin *(belum diaktifkan)*

> Menu Pengaturan (Kelola Akun) sementara disembunyikan dari sidebar. Halaman `/admin/akun` masih ada dan bisa diakses langsung. Untuk mengaktifkan, uncomment bagian `Pengaturan` di `AdminSidebar.tsx`.

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin — /admin/akun"]
        A1([Buka Kelola Akun]) --> A2[Lihat Daftar Akun Admin]
        A2 --> A3{Pilih Aksi}

        A3 -- Tambah Akun --> A4[Isi Nama, Username, Password\nKonfirmasi Password]
        A4 --> A5{Validasi}
        A5 -- Gagal --> A4
        A5 -- OK --> A6[Simpan ke admin_users\nPassword di-hash SHA-256]

        A3 -- Edit Akun --> A7[Ubah Nama / Username\nPassword opsional]
        A7 --> A8[Simpan Perubahan]

        A3 -- Toggle Aktif --> A9{Akun sendiri?}
        A9 -- Ya --> A10[Ditolak]
        A9 -- Tidak --> A11[Status aktif/nonaktif diubah]

        A3 -- Hapus --> A12{Akun sendiri\natau satu-satunya?}
        A12 -- Ya --> A13[Ditolak]
        A12 -- Tidak --> A14{Yakin Hapus?}
        A14 -- Batal --> A2
        A14 -- Ya --> A15[Hapus dari DB]
    end
```

---

## Keamanan Data (Row Level Security)

Semua tabel menggunakan Row Level Security (RLS) Supabase.

| Tabel           | SELECT (baca)          | INSERT / UPDATE / DELETE          |
| --------------- | ---------------------- | --------------------------------- |
| khatib          | Publik                 | Hanya service role (server)       |
| jadwal          | Publik                 | Hanya service role (server)       |
| transaksi       | Publik                 | Hanya service role (server)       |
| rekening        | Publik                 | Hanya service role (server)       |
| pengaturan      | Publik                 | Hanya service role (server)       |
| berita          | Publik                 | Hanya service role (server)       |
| galeri          | Publik                 | Hanya service role (server)       |
| program_images  | Publik                 | Hanya service role (server)       |
| admin_users     | Hanya service role     | Hanya service role (server)       |

> `admin_users` tidak pernah diakses langsung dari client — selalu melalui API Route server-side yang menggunakan `SUPABASE_SERVICE_ROLE_KEY`.

---

## Storage Bucket (Supabase Storage)

| Bucket           | Digunakan oleh         | Isi                                   | Akses  | Status        |
| ---------------- | ---------------------- | ------------------------------------- | ------ | ------------- |
| `khatib-photos`  | Tabel `khatib`         | Foto profil khatib/ustadz             | Public | Aktif         |
| `qris`           | Tabel `pengaturan`     | Gambar QRIS donasi masjid             | Public | Aktif         |
| `program-images` | Tabel `program_images` | Foto program unggulan di beranda      | Public | Aktif         |
| `galeri`         | Tabel `galeri`         | Foto dokumentasi kegiatan masjid      | Public | Aktif         |

---

## Halaman Publik

| URL                 | Keterangan                                                    |
| ------------------- | ------------------------------------------------------------- |
| `/`                 | Beranda — jadwal sholat, kegiatan, galeri preview, berita, donasi & kontak |
| `/berita`           | Daftar semua berita & pengumuman                              |
| `/berita/[slug]`    | Detail berita                                                 |
| `/jadwal-kegiatan`  | Semua jadwal kegiatan mendatang & arsip                       |
| `/jadwal-sholat`    | Jadwal sholat bulanan Kota Surabaya                           |
| `/laporan-keuangan` | Laporan keuangan transparan + filter tahun & bulan + export   |
| `/galeri`           | Galeri foto kegiatan dengan filter kategori & lightbox        |

## Halaman Admin

| URL                              | Keterangan                                              | Status        |
| -------------------------------- | ------------------------------------------------------- | ------------- |
| `/admin/login`                   | Login dengan username & password (cek DB)               | Aktif         |
| `/admin/dashboard`               | Ringkasan statistik & transaksi terbaru                 | Aktif         |
| `/admin/khatib`                  | Kelola data khatib & ustadz                             | Aktif         |
| `/admin/jadwal`                  | Kelola jadwal kegiatan                                  | Aktif         |
| `/admin/berita`                  | Kelola berita & pengumuman                              | Aktif         |
| `/admin/galeri`                  | Upload & kelola foto galeri                             | Aktif         |
| `/admin/program`                 | Upload foto program unggulan                            | Aktif         |
| `/admin/keuangan`                | Redirect otomatis → /admin/keuangan/pemasukan           | Aktif         |
| `/admin/keuangan/pemasukan`      | Catat & kelola transaksi pemasukan                      | Aktif         |
| `/admin/keuangan/pengeluaran`    | Catat & kelola transaksi pengeluaran                    | Aktif         |
| `/admin/laporan`                 | Laporan alur kas bulanan + widget transaksi terbaru     | Aktif         |
| `/admin/rekening`                | Kelola nomor rekening & QRIS                            | Aktif         |
| `/admin/akun`                    | Kelola akun admin (tambah / edit / nonaktif / hapus)    | Belum dipakai |
