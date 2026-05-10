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
        text key   PK "Primary Key — nama setting"
        text value "nullable — nilai setting"
    }

    BERITA {
        uuid id         PK "Primary Key"
        text slug       "UNIQUE NOT NULL — URL-friendly"
        text judul      "NOT NULL"
        text ringkasan  "default: kosong"
        text konten     "default: kosong — isi artikel"
        text kategori   "default: Pengumuman"
        date tanggal    "NOT NULL default: today"
    }

    GALERI {
        uuid id        PK "Primary Key"
        text judul     "NOT NULL"
        text deskripsi "default: kosong"
        text image_url "NOT NULL — URL dari Storage"
        text kategori  "default: Kegiatan"
        date tanggal   "NOT NULL default: today"
    }

    PROGRAM_IMAGES {
        text key       PK "Primary Key — slug program"
        text image_url "nullable — URL dari Storage"
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

Menyimpan nomor rekening bank untuk halaman donasi/wakaf.

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

Menyimpan konfigurasi global sistem (key-value). Saat ini digunakan untuk URL gambar QRIS.

| Kolom   | Tipe | Keterangan                                    |
| ------- | ---- | --------------------------------------------- |
| `key`   | TEXT | Primary key (contoh: `qris_url`)              |
| `value` | TEXT | Nilai setting, misal URL gambar QRIS (nullable) |

**Contoh data:**

| key        | value                                      |
| ---------- | ------------------------------------------ |
| `qris_url` | `https://...supabase.co/storage/v1/...jpg` |

---

### BERITA

Menyimpan artikel berita dan pengumuman yang dikelola admin dan ditampilkan di halaman publik.

| Kolom       | Tipe | Keterangan                                                    |
| ----------- | ---- | ------------------------------------------------------------- |
| `id`        | UUID | Primary key, di-generate otomatis                             |
| `slug`      | TEXT | URL-friendly identifier, unik (contoh: `kajian-sabtu-mei-2026`) |
| `judul`     | TEXT | Judul berita/pengumuman                                       |
| `ringkasan` | TEXT | Ringkasan singkat untuk preview card                          |
| `konten`    | TEXT | Isi artikel lengkap (paragraf dipisah dengan baris kosong)    |
| `kategori`  | TEXT | Pengumuman / Kajian / Pendidikan / Infrastruktur / Sosial / Renovasi |
| `tanggal`   | DATE | Tanggal publikasi (YYYY-MM-DD)                                |

---

### GALERI

Menyimpan foto dokumentasi kegiatan masjid yang dikelola admin dan ditampilkan di halaman galeri publik.

| Kolom       | Tipe | Keterangan                                               |
| ----------- | ---- | -------------------------------------------------------- |
| `id`        | UUID | Primary key, di-generate otomatis                        |
| `judul`     | TEXT | Judul/nama foto                                          |
| `deskripsi` | TEXT | Deskripsi foto (opsional)                                |
| `image_url` | TEXT | URL publik dari Supabase Storage bucket `galeri`         |
| `kategori`  | TEXT | Kegiatan / Kajian / Renovasi / Sosial / Ramadan / Lainnya |
| `tanggal`   | DATE | Tanggal foto diambil                                     |

---

### PROGRAM_IMAGES

Menyimpan URL foto untuk masing-masing program unggulan masjid yang ditampilkan di halaman beranda.

| Kolom       | Tipe | Keterangan                                               |
| ----------- | ---- | -------------------------------------------------------- |
| `key`       | TEXT | Primary key — slug program (contoh: `tpa-al-hidayah`)    |
| `image_url` | TEXT | URL publik dari Supabase Storage bucket `program-images` |

**Nilai `key` yang tersedia:**

| key               | Program            |
| ----------------- | ------------------ |
| `tpa-al-hidayah`  | TPA Al-Hidayah     |
| `kajian-sabtu`    | Kajian Sabtu       |
| `wakaf-produktif` | Wakaf Produktif    |
| `tahsin-alquran`  | Tahsin Al-Qur'an   |

---

## Relasi Antar Tabel

| Relasi          | Tipe                   | Keterangan                                                                                                                    |
| --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| KHATIB → JADWAL | One-to-Many (opsional) | Satu khatib dapat mengisi banyak jadwal. Jika khatib dihapus, kolom `khatib_id` di jadwal menjadi NULL (ON DELETE SET NULL)  |

> Tabel **REKENING**, **PENGATURAN**, **BERITA**, **GALERI**, dan **PROGRAM_IMAGES** berdiri sendiri tanpa relasi ke tabel lain.

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
        P2 -- Beranda --> P3[Lihat Info Masjid & Jadwal Sholat]
        P2 -- Jadwal Kegiatan --> P4[Lihat Jadwal Kegiatan]
        P2 -- Laporan Keuangan --> P5[Lihat Laporan Keuangan]
        P2 -- Berita & Pengumuman --> P6[Lihat Berita]
        P2 -- Jadwal Sholat --> P7[Lihat Jadwal Sholat Bulanan]
    end

    subgraph ADMIN["👤 Admin"]
        A1([Buka Halaman Admin]) --> A2{Sudah Login?}
        A2 -- Belum --> A3[Masukkan Email & Password]
        A3 --> A4{Akun Benar?}
        A4 -- Tidak --> A5[Tampil Pesan Gagal]
        A5 --> A3
        A4 -- Ya --> A6[Masuk ke Dasbor Admin]
        A2 -- Sudah --> A6
        A6 --> A7{Pilih Menu}
        A7 -- Data Khatib --> A8[Kelola Data Khatib]
        A7 -- Jadwal --> A9[Kelola Jadwal Kegiatan]
        A7 -- Keuangan --> A10[Catat Transaksi]
        A7 -- Rekening & QRIS --> A11[Kelola Info Donasi]
        A7 -- Galeri Foto --> A12[Upload & Kelola Foto]
        A7 -- Program Unggulan --> A13[Upload Foto Program]
        A7 -- Berita --> A14[Kelola Berita & Pengumuman]
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
        A4 -- Ya --> A5[Simpan Berita]

        A2 -- Edit --> A6[Ubah Data Berita]
        A6 --> A7[Simpan Perubahan]

        A2 -- Hapus --> A8{Yakin Hapus?}
        A8 -- Batal --> A2
        A8 -- Ya --> A9[Hapus Berita]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Beranda]) --> P2[Lihat 3 Berita Terbaru]
        P2 --> P3[Klik Lihat Semua]
        P3 --> P4[Halaman /berita — semua berita]
        P4 --> P5[Klik Berita]
        P5 --> P6[Detail Berita + Berita Lainnya]
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

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Halaman /galeri]) --> P2[Lihat Grid Foto]
        P2 --> P3{Filter Kategori}
        P3 --> P4[Foto Terfilter]
        P4 --> P5[Klik Foto → Lightbox]
    end

    A6 --> P2
    A8 --> P2
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
    subgraph ADMIN["👤 Admin"]
        A1([Buka Keuangan]) --> A2[Lihat Daftar Transaksi & Saldo]
        A2 --> A3{Pilih Aksi}

        A3 -- Tambah Transaksi --> A4{Pilih Jenis}
        A4 -- Pemasukan --> A5[Pilih Kategori:\nInfaq Jumat / Kotak Amal\nDonasi Transfer / Wakaf / Zakat]
        A4 -- Pengeluaran --> A6[Pilih Kategori:\nListrik & Air / Kebersihan\nOperasional / Kajian / Pembangunan]
        A5 --> A7[Isi Keterangan, Jumlah, Tanggal]
        A6 --> A7
        A7 --> A8[Simpan Transaksi]

        A3 -- Export --> A9{Format}
        A9 -- CSV --> A10[Download .csv]
        A9 -- Excel --> A11[Download .xlsx bergaya]
        A9 -- Print --> A12[Halaman Cetak / PDF]

        A3 -- Hapus --> A13{Yakin Hapus?}
        A13 -- Batal --> A2
        A13 -- Ya --> A14[Hapus Transaksi]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Laporan Keuangan]) --> P2[Lihat Total Pemasukan\nTotal Pengeluaran & Saldo]
        P2 --> P3[Filter Tahun]
        P3 --> P4[Grafik Bulanan & Pie Chart]
        P4 --> P5[Riwayat Transaksi Lengkap]
        P5 --> P6[Export CSV / Excel / Print]
    end

    A8 --> P1
    A14 --> P1
```

---

### 6. Alur Donasi → Laporan Keuangan

```mermaid
flowchart TD
    subgraph DONATUR["🙋 Donatur"]
        D1([Buka Halaman Donasi]) --> D2{Pilih Metode}
        D2 -- Transfer Bank --> D3[Lihat No. Rekening\nSalin & Transfer]
        D2 -- QRIS --> D4[Scan QR Code\nBayar via Bank / E-Wallet]
        D3 --> D5[Selesai ✓]
        D4 --> D5
    end

    subgraph ADMIN["👤 Admin"]
        D5 --> A1[Cek Notifikasi Mutasi]
        A1 --> A2([Buka Admin Keuangan])
        A2 --> A3[Tambah Transaksi — Pemasukan\nKategori: Donasi Transfer]
        A3 --> A4[(TRANSAKSI\nmasuk · Donasi Transfer)]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        A4 --> P1[Laporan Keuangan\ndiperbarui otomatis]
    end
```

---

## Keamanan Data (Row Level Security)

Semua tabel menggunakan Row Level Security (RLS) Supabase.

| Operasi                  | Hak Akses                          |
| ------------------------ | ---------------------------------- |
| SELECT (baca)            | Publik — siapa saja dapat membaca  |
| INSERT / UPDATE / DELETE | Hanya admin yang terautentikasi    |

---

## Storage Bucket (Supabase Storage)

| Bucket           | Digunakan oleh       | Isi                                   | Akses  |
| ---------------- | -------------------- | ------------------------------------- | ------ |
| `khatib-photos`  | Tabel `khatib`       | Foto profil khatib/ustadz             | Public |
| `qris`           | Tabel `pengaturan`   | Gambar QRIS donasi masjid             | Public |
| `program-images` | Tabel `program_images` | Foto program unggulan di beranda    | Public |
| `galeri`         | Tabel `galeri`       | Foto dokumentasi kegiatan masjid      | Public |

---

## Halaman Publik

| URL                    | Keterangan                                     |
| ---------------------- | ---------------------------------------------- |
| `/`                    | Beranda — jadwal sholat, kegiatan, berita, donasi |
| `/berita`              | Daftar semua berita & pengumuman               |
| `/berita/[slug]`       | Detail berita                                  |
| `/jadwal-kegiatan`     | Semua jadwal kegiatan mendatang & arsip        |
| `/jadwal-sholat`       | Jadwal sholat bulanan Kota Surabaya            |
| `/laporan-keuangan`    | Laporan keuangan transparan + export           |

## Halaman Admin

| URL                    | Keterangan                         |
| ---------------------- | ---------------------------------- |
| `/admin/login`         | Halaman login admin                |
| `/admin/dashboard`     | Ringkasan statistik                |
| `/admin/khatib`        | Kelola data khatib & ustadz        |
| `/admin/jadwal`        | Kelola jadwal kegiatan             |
| `/admin/keuangan`      | Catat & kelola transaksi keuangan  |
| `/admin/galeri`        | Upload & kelola foto galeri        |
| `/admin/program`       | Upload foto program unggulan       |
| `/admin/berita`        | Kelola berita & pengumuman         |
| `/admin/rekening`      | Kelola nomor rekening & QRIS       |
