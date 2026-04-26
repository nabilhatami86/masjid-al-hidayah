# Entity Relationship Diagram — Sistem Informasi Masjid Al-Hidayah

**Lokasi:** Ketintang Baru XV No.20, Kec. Gayungan, Surabaya
**Database:** PostgreSQL (Supabase)
**Dibuat:** April 2026

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

    QRIS_DONASI {
        text key   PK "Primary Key — nama setting"
        text value "nullable — nilai setting"
    }

    KHATIB ||--o{ JADWAL : "mengisi"
```

---

## Keterangan Tabel

### KHATIB

Menyimpan data penceramah/khatib yang terdaftar di masjid.

| Kolom          | Tipe       | Keterangan                                |
| -------------- | ---------- | ----------------------------------------- |
| `id`           | UUID       | Primary key, di-generate otomatis         |
| `nama`         | TEXT       | Nama lengkap khatib                       |
| `gelar`        | TEXT       | Gelar akademik (contoh: Lc., M.A.)        |
| `spesialisasi` | TEXT       | Bidang keahlian (contoh: Tafsir & Hadist) |
| `no_hp`        | TEXT       | Nomor handphone                           |
| `email`        | TEXT       | Alamat email                              |
| `aktif`        | BOOLEAN | Status aktif/tidak aktif                  |
| `foto_url`     | TEXT    | URL foto dari storage (opsional)          |

---

### JADWAL

Menyimpan jadwal kegiatan masjid (khutbah, kajian, TPA, dll).

| Kolom            | Tipe        | Keterangan                                 |
| ---------------- | ----------- | ------------------------------------------ |
| `id`             | UUID        | Primary key, di-generate otomatis          |
| `tanggal`        | DATE        | Tanggal kegiatan (YYYY-MM-DD)              |
| `jenis_kegiatan` | TEXT        | Jenis kegiatan (lihat enum di bawah)       |
| `khatib_id`      | UUID        | Foreign key ke tabel KHATIB (boleh kosong) |
| `topik`          | TEXT        | Topik/tema kegiatan                        |
| `waktu`          | TEXT        | Jam kegiatan format HH:MM                  |
| `keterangan`     | TEXT | Catatan tambahan |

---

### TRANSAKSI

Menyimpan seluruh transaksi keuangan masjid (pemasukan & pengeluaran).

| Kolom        | Tipe        | Keterangan                                  |
| ------------ | ----------- | ------------------------------------------- |
| `id`         | UUID        | Primary key, di-generate otomatis           |
| `tanggal`    | DATE        | Tanggal transaksi (YYYY-MM-DD)              |
| `keterangan` | TEXT        | Deskripsi transaksi                         |
| `kategori`   | TEXT        | Kategori transaksi (lihat enum di bawah)    |
| `jenis`      | TEXT        | `masuk` = pemasukan, `keluar` = pengeluaran |
| `jumlah`     | BIGINT | Nominal dalam Rupiah (harus > 0) |

---

### REKENING

Menyimpan nomor rekening bank untuk halaman donasi/wakaf. Data dikelola admin dan ditampilkan secara live di halaman publik.

| Kolom        | Tipe        | Keterangan                                        |
| ------------ | ----------- | ------------------------------------------------- |
| `id`         | UUID        | Primary key, di-generate otomatis                 |
| `bank`       | TEXT        | Nama bank (contoh: BSI, Mandiri Syariah)          |
| `norek`      | TEXT        | Nomor rekening                                    |
| `atas`       | TEXT        | Nama pemilik rekening                             |
| `urutan`     | INTEGER     | Urutan tampil di halaman (angka kecil = atas)     |
| `aktif`      | BOOLEAN | Jika false, rekening disembunyikan dari publik |

---

### QRIS_DONASI

Menyimpan URL gambar QRIS donasi masjid. Data dikelola admin dan ditampilkan di halaman donasi/wakaf publik.

| Kolom        | Tipe        | Keterangan                                              |
| ------------ | ----------- | ------------------------------------------------------- |
| `key`        | TEXT | Primary key (contoh: `qris_url`)                 |
| `value`      | TEXT | URL gambar QRIS dari Supabase Storage (nullable) |

**Contoh data:**

| key        | value                                      |
| ---------- | ------------------------------------------ |
| `qris_url` | `https://...supabase.co/storage/v1/...jpg` |

---

## Relasi Antar Tabel

| Relasi          | Tipe                   | Keterangan                                                                                                                   |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| KHATIB → JADWAL | One-to-Many (opsional) | Satu khatib dapat mengisi banyak jadwal. Jika khatib dihapus, kolom `khatib_id` di jadwal menjadi NULL (ON DELETE SET NULL) |

> **REKENING** dan **QRIS_DONASI** tidak memiliki relasi ke tabel lain — keduanya berdiri sendiri sebagai data master donasi.

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
| Tahfidz                  |
| TPA Al-Hidayah           |
| Maulid & Kegiatan Khusus |

---

## Flowchart Alur Sistem

### 1. Alur Akses & Autentikasi

```mermaid
flowchart TD
    subgraph PUBLIK["👥 Pengguna Publik"]
        P1([Buka Website]) --> P2{Pilih Halaman}
        P2 -- Beranda --> P3[Info Masjid & Jadwal Sholat]
        P2 -- Jadwal Kegiatan --> P4[Lihat Jadwal Kegiatan]
        P2 -- Laporan Keuangan --> P5[Lihat Laporan Keuangan]
        P2 -- Donasi / Wakaf --> P6[Lihat QRIS & No. Rekening]
    end

    subgraph ADMIN["👤 Admin"]
        A1([Buka /admin]) --> A2{Sudah Login?}
        A2 -- Belum --> A3[Redirect ke /admin/login]
        A3 --> A4[Masukkan Email & Password]
        A4 --> A5{Kredensial Valid?}
        A5 -- Tidak --> A6[Tampil Pesan Error]
        A6 --> A4
        A5 -- Ya --> A7[Simpan Session Supabase Auth]
        A7 --> A8[Dashboard Admin]
        A2 -- Sudah --> A8
        A8 --> A9{Pilih Modul}
        A9 -- Khatib --> A10[/admin/khatib]
        A9 -- Jadwal --> A11[/admin/jadwal]
        A9 -- Keuangan --> A12[/admin/keuangan]
        A9 -- Rekening & QRIS --> A13[/admin/rekening]
    end
```

---

### 2. Alur Khatib

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin — /admin/khatib"]
        A1([Buka Halaman Khatib]) --> A2{Pilih Aksi}

        A2 -- Tambah --> A3[Isi Form: Nama, Gelar\nSpesialisasi, No HP, Email]
        A3 --> A4[Upload Foto ke Storage]
        A4 --> A5{Data Valid?}
        A5 -- Tidak --> A6[Tampil Error]
        A6 --> A3
        A5 -- Ya --> A7[POST /api/khatib]

        A2 -- Edit --> A8[Ubah Data Khatib]
        A8 --> A9{Data Valid?}
        A9 -- Tidak --> A10[Tampil Error]
        A10 --> A8
        A9 -- Ya --> A11[PATCH /api/khatib/:id]

        A2 -- Hapus --> A12{Konfirmasi?}
        A12 -- Batal --> A2
        A12 -- Ya --> A13[DELETE /api/khatib/:id]
    end

    subgraph DB["🗄️ Database"]
        D1[(Tabel KHATIB)]
        D2[(Tabel JADWAL\nkhatib_id = NULL\nON DELETE SET NULL)]
    end

    subgraph PUBLIK["👥 Publik — Halaman Jadwal"]
        P1([Buka Jadwal Kegiatan]) --> P2[GET /api/jadwal]
        P2 --> P3[Tampil Nama Khatib\ndi setiap jadwal]
    end

    A7 --> D1
    A11 --> D1
    A13 --> D1
    A13 --> D2
    D1 --> P2
```

---

### 3. Alur Jadwal Kegiatan

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin — /admin/jadwal"]
        A1([Buka Halaman Jadwal]) --> A2{Pilih Aksi}

        A2 -- Tambah --> A3[Isi Form: Tanggal, Jenis Kegiatan\nWaktu, Topik, Keterangan]
        A3 --> A4{Ada Khatib?}
        A4 -- Ya --> A5[Pilih dari Daftar KHATIB Aktif]
        A5 --> A6{Data Valid?}
        A4 -- Tidak --> A6
        A6 -- Tidak --> A7[Tampil Error]
        A7 --> A3
        A6 -- Ya --> A8[POST /api/jadwal]

        A2 -- Edit --> A9[Ubah Data Jadwal]
        A9 --> A10{Data Valid?}
        A10 -- Tidak --> A11[Tampil Error]
        A11 --> A9
        A10 -- Ya --> A12[PATCH /api/jadwal/:id]

        A2 -- Hapus --> A13{Konfirmasi?}
        A13 -- Batal --> A2
        A13 -- Ya --> A14[DELETE /api/jadwal/:id]
    end

    subgraph DB["🗄️ Database"]
        D1[(Tabel JADWAL)]
        D2[(Tabel KHATIB)]
        D2 -. join khatib_id .-> D1
    end

    subgraph PUBLIK["👥 Publik — Halaman Jadwal"]
        P1([Buka Jadwal Kegiatan]) --> P2[GET /api/jadwal]
        P2 --> P3{Filter Tampilan}
        P3 -- Semua --> P4[Tampil Semua Jadwal]
        P3 -- Per Bulan --> P5[Tampil Jadwal Bulan Ini]
        P4 --> P6[Detail: Tanggal, Waktu\nJenis, Topik, Nama Khatib]
        P5 --> P6
    end

    A8 --> D1
    A12 --> D1
    A14 --> D1
    D1 --> P2
```

---

### 4. Alur Keuangan

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin — /admin/keuangan"]
        A1([Buka Halaman Keuangan]) --> A2[Lihat Daftar Transaksi & Saldo]
        A2 --> A3{Pilih Aksi}

        A3 -- Tambah --> A4[Isi Form: Tanggal, Keterangan\nJumlah, Jenis, Kategori]
        A4 --> A5{Jenis Transaksi}
        A5 -- Masuk --> A6[Kategori: Infaq Jumat / Kotak Amal\nDonasi Transfer / Wakaf / Zakat]
        A5 -- Keluar --> A7[Kategori: Listrik & Air / Kebersihan\nOperasional / Kajian / Pembangunan]
        A6 --> A8{Data Valid?}
        A7 --> A8
        A8 -- Tidak --> A9[Tampil Error]
        A9 --> A4
        A8 -- Ya --> A10[POST /api/transaksi]

        A3 -- Hapus --> A11{Konfirmasi?}
        A11 -- Batal --> A2
        A11 -- Ya --> A12[DELETE /api/transaksi/:id]
    end

    subgraph DB["🗄️ Database"]
        D1[(Tabel TRANSAKSI)]
    end

    subgraph PUBLIK["👥 Publik — /laporan-keuangan"]
        P1([Buka Laporan Keuangan]) --> P2[GET /api/transaksi]
        P2 --> P3[Hitung: Total Masuk\nTotal Keluar, Saldo]
        P3 --> P4{Filter Laporan}
        P4 -- Per Bulan --> P5[Grafik & Tabel Bulanan]
        P4 -- Per Kategori --> P6[Rincian per Kategori]
        P5 --> P7[Tampil Laporan Lengkap]
        P6 --> P7
    end

    A10 --> D1
    A12 --> D1
    D1 --> P2
```

---

### 5. Alur Donasi & Rekening

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin — /admin/rekening"]
        A1([Buka Halaman Rekening]) --> A2{Pilih Aksi}

        A2 -- Tambah Rekening --> A3[Isi Form: Bank, No Rekening\nNama Pemilik, Urutan Tampil]
        A3 --> A4{Data Valid?}
        A4 -- Tidak --> A5[Tampil Error]
        A5 --> A3
        A4 -- Ya --> A6[POST /api/rekening]

        A2 -- Edit Rekening --> A7[Ubah Data Rekening]
        A7 --> A8[PATCH /api/rekening/:id]

        A2 -- Toggle Aktif/Nonaktif --> A9[PATCH aktif = true / false]

        A2 -- Hapus --> A10{Konfirmasi?}
        A10 -- Batal --> A2
        A10 -- Ya --> A11[DELETE /api/rekening/:id]

        A2 -- Upload QRIS --> A12[Pilih File Gambar]
        A12 --> A13[Upload ke Storage bucket qris]
        A13 --> A14[Dapatkan Public URL]
        A14 --> A15[PATCH /api/pengaturan\nkey = qris_url]
    end

    subgraph DB["🗄️ Database"]
        D1[(Tabel REKENING\naktif = true/false)]
        D2[(Tabel QRIS_DONASI\nkey = qris_url)]
    end

    subgraph PUBLIK["👥 Publik — Halaman Donasi / Wakaf"]
        P1([Buka Halaman Donasi]) --> P2[GET /api/rekening\nhanya aktif = true]
        P1 --> P3[GET /api/pengaturan?key=qris_url]
        P2 --> P4[Tampil Daftar Rekening\nUrut sesuai kolom urutan]
        P3 --> P5[Tampil Gambar QRIS]
        P4 --> P6[Tombol Salin No. Rekening]
    end

    A6 --> D1
    A8 --> D1
    A9 --> D1
    A11 --> D1
    A15 --> D2
    D1 --> P2
    D2 --> P3
```

---

## Keamanan Data (Row Level Security)

Semua tabel menggunakan Row Level Security (RLS) Supabase.

| Operasi                  | Hak Akses                         |
| ------------------------ | --------------------------------- |
| SELECT (baca)            | Publik — siapa saja dapat membaca |
| INSERT / UPDATE / DELETE | Hanya admin yang terautentikasi   |

---

## Storage Bucket (Supabase Storage)

| Bucket          | Isi                              | Akses  |
| --------------- | -------------------------------- | ------ |
| `khatib-photos` | Foto profil khatib/ustadz        | Public |
| `qris`          | Gambar QRIS donasi masjid        | Public |
| `program-images`| Foto program unggulan masjid     | Public |
