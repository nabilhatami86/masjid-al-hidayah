# Entity Relationship Diagram — Sistem Informasi Masjid Al-Hidayah

**Lokasi:** Ketintang Baru XV No.20, Kec. Gayungan, Surabaya
**Database:** PostgreSQL (Supabase)
**Dibuat:** April 2026

---

```mermaid
erDiagram
    KHATIB {
        uuid        id           PK "Primary Key"
        text        nama         "NOT NULL"
        text        gelar        "default: kosong"
        text        spesialisasi "default: kosong"
        text        no_hp        "default: kosong"
        text        email        "default: kosong"
        boolean     aktif        "default: true"
        text        foto_url     "nullable"
    }

    JADWAL {
        uuid        id             PK "Primary Key"
        date        tanggal        "NOT NULL"
        text        jenis_kegiatan "NOT NULL"
        uuid        khatib_id      FK "nullable — ON DELETE SET NULL"
        text        topik          "default: kosong"
        text        waktu          "format HH:MM"
        text        keterangan     "default: kosong"
    }

    TRANSAKSI {
        uuid        id          PK "Primary Key"
        date        tanggal     "NOT NULL"
        text        keterangan  "NOT NULL"
        text        kategori    "NOT NULL"
        text        jenis       "CHECK: masuk | keluar"
        bigint      jumlah      "dalam Rupiah, CHECK: > 0"
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
| `foto_url`     | TEXT    | URL foto dari storage (opsional)          |

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

## Relasi Antar Tabel

| Relasi          | Tipe                   | Keterangan                                                                                                                  |
| --------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| KHATIB → JADWAL | One-to-Many (opsional) | Satu khatib dapat mengisi banyak jadwal. Jika khatib dihapus, kolom `khatib_id` di jadwal menjadi NULL (ON DELETE SET NULL) |

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

## Keamanan Data (Row Level Security)

| Operasi                  | Hak Akses                         |
| ------------------------ | --------------------------------- |
| SELECT (baca)            | Publik — siapa saja dapat membaca |
| INSERT / UPDATE / DELETE | Hanya admin yang terautentikasi   |
