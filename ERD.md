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

### 1. Alur Autentikasi Admin

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka /admin/login]
    B --> C[Masukkan Email & Password]
    C --> D{Kredensial Valid?}
    D -- Tidak --> E[Tampil Pesan Error]
    E --> C
    D -- Ya --> F[Simpan Session Supabase Auth]
    F --> G[Redirect ke /admin/dashboard]
    G --> H([Selesai])
```

---

### 2. Alur Manajemen Khatib

```mermaid
flowchart TD
    A([Admin di /admin/khatib]) --> B[Lihat Daftar Khatib]

    B --> C{Pilih Aksi}

    C -- Tambah --> D[Isi Form: Nama, Gelar, Spesialisasi\nNo HP, Email, Upload Foto]
    D --> E{Data Valid?}
    E -- Tidak --> F[Tampil Validasi Error]
    F --> D
    E -- Ya --> G[POST /api/khatib]
    G --> H[Simpan ke tabel KHATIB]
    H --> I[Refresh Daftar]

    C -- Edit --> J[Isi Form dengan Data Lama]
    J --> K{Data Valid?}
    K -- Tidak --> L[Tampil Validasi Error]
    L --> J
    K -- Ya --> M[PATCH /api/khatib/:id]
    M --> N[Update tabel KHATIB]
    N --> I

    C -- Hapus --> O{Konfirmasi Hapus?}
    O -- Batal --> B
    O -- Ya --> P[DELETE /api/khatib/:id]
    P --> Q[Set khatib_id = NULL di JADWAL\nON DELETE SET NULL]
    Q --> R[Hapus record dari KHATIB]
    R --> I

    I --> B
```

---

### 3. Alur Manajemen Jadwal

```mermaid
flowchart TD
    A([Admin di /admin/jadwal]) --> B[Lihat Daftar Jadwal]

    B --> C{Pilih Aksi}

    C -- Tambah --> D[Isi Form: Tanggal, Jenis Kegiatan\nWaktu, Topik, Keterangan]
    D --> E{Pilih Khatib?}
    E -- Ya --> F[Pilih dari Daftar KHATIB Aktif]
    F --> G{Data Valid?}
    E -- Tidak --> G
    G -- Tidak --> H[Tampil Validasi Error]
    H --> D
    G -- Ya --> I[POST /api/jadwal]
    I --> J[Simpan ke tabel JADWAL]
    J --> K[Refresh Daftar]

    C -- Edit --> L[Isi Form dengan Data Lama]
    L --> M{Data Valid?}
    M -- Tidak --> N[Tampil Validasi Error]
    N --> L
    M -- Ya --> O[PATCH /api/jadwal/:id]
    O --> P[Update tabel JADWAL]
    P --> K

    C -- Hapus --> Q{Konfirmasi Hapus?}
    Q -- Batal --> B
    Q -- Ya --> R[DELETE /api/jadwal/:id]
    R --> S[Hapus record dari JADWAL]
    S --> K

    K --> B
```

---

### 4. Alur Keuangan (Transaksi)

```mermaid
flowchart TD
    A([Admin di /admin/keuangan]) --> B[Lihat Daftar Transaksi\nRingkasan Saldo]

    B --> C{Pilih Aksi}

    C -- Tambah --> D[Isi Form: Tanggal, Keterangan\nKategori, Jenis, Jumlah]
    D --> E{Jenis Transaksi}
    E -- Masuk --> F[Pilih Kategori Pemasukan\nInfoq Jumat / Kotak Amal / Donasi Transfer / Wakaf / Zakat]
    E -- Keluar --> G[Pilih Kategori Pengeluaran\nListrik & Air / Kebersihan / Operasional / Kajian / Pembangunan]
    F --> H{Data Valid?}
    G --> H
    H -- Tidak --> I[Tampil Validasi Error]
    I --> D
    H -- Ya --> J[POST /api/transaksi]
    J --> K[Simpan ke tabel TRANSAKSI]
    K --> L[Hitung Ulang Saldo]
    L --> M[Refresh Daftar]

    C -- Hapus --> N{Konfirmasi Hapus?}
    N -- Batal --> B
    N -- Ya --> O[DELETE /api/transaksi/:id]
    O --> P[Hapus record dari TRANSAKSI]
    P --> L

    M --> B

    B --> Q[Publik: Akses /laporan-keuangan]
    Q --> R[GET /api/transaksi]
    R --> S[Tampil Laporan: Saldo, Pemasukan\nPengeluaran per Kategori & Periode]
```

---

### 5. Alur Donasi & Rekening

```mermaid
flowchart TD
    A([Admin di /admin/rekening]) --> B[Lihat Daftar Rekening & QRIS]

    B --> C{Pilih Aksi}

    C -- Tambah Rekening --> D[Isi Form: Bank, No Rekening\nNama Pemilik, Urutan Tampil]
    D --> E{Data Valid?}
    E -- Tidak --> F[Tampil Validasi Error]
    F --> D
    E -- Ya --> G[POST /api/rekening]
    G --> H[Simpan ke tabel REKENING]
    H --> I[Refresh Daftar]

    C -- Edit Rekening --> J[Edit Data Rekening]
    J --> K[PATCH /api/rekening/:id]
    K --> L[Update tabel REKENING]
    L --> I

    C -- Toggle Aktif --> M[PATCH aktif = true/false]
    M --> I

    C -- Hapus Rekening --> N{Konfirmasi?}
    N -- Batal --> B
    N -- Ya --> O[DELETE /api/rekening/:id]
    O --> I

    C -- Upload QRIS --> P[Pilih File Gambar QRIS]
    P --> Q[Upload ke Supabase Storage bucket qris]
    Q --> R[Dapatkan Public URL]
    R --> S[PATCH /api/pengaturan key=qris_url]
    S --> T[Update tabel QRIS_DONASI]
    T --> I

    I --> B

    B --> U[Publik: Akses Halaman Donasi]
    U --> V[GET /api/rekening — hanya aktif=true]
    U --> W[GET /api/pengaturan?key=qris_url]
    V --> X[Tampil Nomor Rekening & Tombol Salin]
    W --> Y[Tampil Gambar QRIS]
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
