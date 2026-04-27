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

### 1. Alur Akses Website

```mermaid
flowchart TD
    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Website]) --> P2{Pilih Menu}
        P2 -- Beranda --> P3[Lihat Info Masjid & Jadwal Sholat]
        P2 -- Jadwal Kegiatan --> P4[Lihat Jadwal Kegiatan]
        P2 -- Laporan Keuangan --> P5[Lihat Laporan Keuangan]
        P2 -- Donasi / Wakaf --> P6[Lihat Info Donasi]
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
    end
```

---

### 2. Alur Data Khatib

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin"]
        A1([Buka Data Khatib]) --> A2{Pilih Aksi}

        A2 -- Tambah --> A3[Isi Nama, Gelar, Bidang\nNo HP, Email, Foto]
        A3 --> A4{Data Sudah Lengkap?}
        A4 -- Belum --> A5[Lengkapi Data]
        A5 --> A3
        A4 -- Ya --> A6[Simpan Data Khatib]

        A2 -- Ubah --> A7[Edit Data Khatib]
        A7 --> A8[Simpan Perubahan]

        A2 -- Hapus --> A9{Yakin Hapus?}
        A9 -- Batal --> A2
        A9 -- Ya --> A10[Hapus Data Khatib]
        A10 --> A11[Nama khatib di jadwal\notomatis dikosongkan]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Jadwal Kegiatan]) --> P2[Lihat Jadwal\nbeserta Nama Khatib]
    end

    A6 --> P2
    A8 --> P2
    A11 --> P2
```

---

### 3. Alur Jadwal Kegiatan

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin"]
        A1([Buka Jadwal]) --> A2{Pilih Aksi}

        A2 -- Tambah --> A3[Isi Tanggal, Jenis Kegiatan\nWaktu, Topik, Keterangan]
        A3 --> A4{Ada Khatib?}
        A4 -- Ya --> A5[Pilih Nama Khatib]
        A5 --> A6{Data Sudah Lengkap?}
        A4 -- Tidak --> A6
        A6 -- Belum --> A7[Lengkapi Data]
        A7 --> A3
        A6 -- Ya --> A8[Simpan Jadwal]

        A2 -- Ubah --> A9[Edit Data Jadwal]
        A9 --> A10[Simpan Perubahan]

        A2 -- Hapus --> A11{Yakin Hapus?}
        A11 -- Batal --> A2
        A11 -- Ya --> A12[Hapus Jadwal]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Jadwal Kegiatan]) --> P2{Tampilan}
        P2 -- Semua --> P3[Lihat Seluruh Jadwal]
        P2 -- Bulan Ini --> P4[Lihat Jadwal Bulan Ini]
        P3 --> P5[Tanggal, Waktu, Jenis\nTopik, Nama Khatib]
        P4 --> P5
    end

    A8 --> P1
    A10 --> P1
    A12 --> P1
```

---

### 4. Alur Keuangan

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin"]
        A1([Buka Keuangan]) --> A2[Lihat Daftar Transaksi & Saldo]
        A2 --> A3{Pilih Aksi}

        A3 -- Catat Donasi\nShortcut --> A4[Kategori otomatis:\nDonasi Transfer · Pemasukan]
        A4 --> A5[Isi Nominal & Tanggal]
        A5 --> A6[Simpan → masuk Laporan]

        A3 -- Tambah Transaksi\nManual --> A7{Pilih Jenis}
        A7 -- Pemasukan --> A8[Pilih Kategori:\nInfaq Jumat / Kotak Amal\nDonasi Transfer / Wakaf / Zakat]
        A7 -- Pengeluaran --> A9[Pilih Kategori:\nListrik & Air / Kebersihan\nOperasional / Kajian / Pembangunan]
        A8 --> A10[Isi Keterangan, Jumlah, Tanggal]
        A9 --> A10
        A10 --> A11[Simpan Transaksi]

        A3 -- Export --> A12{Format}
        A12 -- CSV --> A13[Download .csv]
        A12 -- Excel --> A14[Download .xlsx]
        A12 -- Print / PDF --> A15[Buka Halaman Cetak]

        A3 -- Hapus --> A16{Yakin Hapus?}
        A16 -- Batal --> A2
        A16 -- Ya --> A17[Hapus Transaksi]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Laporan Keuangan]) --> P2[Lihat Total Pemasukan\nTotal Pengeluaran & Saldo]
        P2 --> P3{Filter}
        P3 -- Per Bulan --> P4[Laporan Bulanan]
        P3 -- Per Jenis --> P5[Masuk / Keluar]
        P4 --> P6[Tampil Laporan Lengkap]
        P5 --> P6
    end

    A6 --> P1
    A11 --> P1
    A17 --> P1
```

---

### 5. Alur Donasi → Laporan Keuangan

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
        D5 --> A1[Cek Notifikasi Mutasi\nRekening / Aplikasi QRIS]
        A1 --> A2([Buka Admin Keuangan])
        A2 --> A3[Klik Catat Donasi]
        A3 --> A4[Isi Nominal & Tanggal\nKategori otomatis: Donasi Transfer]
        A4 --> A5[Simpan]
        A5 --> A6[(TRANSAKSI\nmasuk · Donasi Transfer)]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        A6 --> P1[Laporan Keuangan\ndiperbarui otomatis]
    end
```

---

### 6. Alur Kelola Rekening & QRIS

```mermaid
flowchart TD
    subgraph ADMIN["👤 Admin"]
        A1([Buka Rekening & QRIS]) --> A2{Pilih Aksi}

        A2 -- Tambah Rekening --> A3[Isi Nama Bank\nNo Rekening, Nama Pemilik]
        A3 --> A4{Data Lengkap?}
        A4 -- Belum --> A3
        A4 -- Ya --> A5[Simpan Rekening]

        A2 -- Ubah Rekening --> A6[Edit & Simpan]

        A2 -- Aktifkan / Nonaktifkan --> A7[Rekening tampil\natau disembunyikan dari publik]

        A2 -- Hapus Rekening --> A8{Yakin Hapus?}
        A8 -- Batal --> A2
        A8 -- Ya --> A9[Hapus Rekening]

        A2 -- Ganti Gambar QRIS --> A10[Pilih & Unggah Gambar]
        A10 --> A11[QRIS Tersimpan di Storage]
    end

    subgraph PUBLIK["👥 Pengunjung"]
        P1([Buka Halaman Donasi]) --> P2[Tab Transfer:\nDaftar Rekening Aktif]
        P1 --> P3[Tab QRIS:\nGambar QR untuk Scan]
        P2 --> P4[Salin No. Rekening]
        P3 --> P5[Scan & Bayar]
    end

    A5 --> P2
    A6 --> P2
    A7 --> P2
    A9 --> P2
    A11 --> P3
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
