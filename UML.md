# UML Diagrams — Sistem Informasi Masjid Al-Hidayah

**Lokasi:** Ketintang Baru XV No.20, Kec. Gayungan, Surabaya
**Diperbarui:** Mei 2026

---

## 1. Use Case Diagram

### Aktor

| Aktor          | Deskripsi                                                      |
| -------------- | -------------------------------------------------------------- |
| **Pengunjung** | Pengguna publik yang mengakses halaman website tanpa login     |
| **Admin**      | Pengelola konten dan keuangan masjid yang telah terautentikasi |

```mermaid
flowchart LR
    PENGUNJUNG(("👤\nPengunjung"))
    ADMIN(("🔐\nAdmin"))

    subgraph SISTEM["🕌  Sistem Informasi Masjid Al-Hidayah"]
        direction TB

        subgraph FP["Fitur Publik"]
            direction TB
            UC1("Lihat Beranda")
            UC2("Lihat Berita & Pengumuman")
            UC3("Lihat Jadwal Kegiatan")
            UC4("Lihat Jadwal Sholat")
            UC5("Lihat Laporan Keuangan")
            UC6("Lihat Galeri Foto")
            UC7("Filter & Export Laporan")
            UC8("Lihat Rekening Donasi")
        end

        subgraph FA["Autentikasi"]
            direction TB
            UA1("Login Admin")
            UA2("Logout")
        end

        subgraph FK["Kelola Konten"]
            direction TB
            UK1("Kelola Data Khatib")
            UK2("Kelola Jadwal Kegiatan")
            UK3("Kelola Berita & Pengumuman")
            UK4("Kelola Galeri Foto")
            UK5("Kelola Program Unggulan")
        end

        subgraph FF["Kelola Keuangan"]
            direction TB
            UF1("Catat Transaksi Pemasukan")
            UF2("Catat Transaksi Pengeluaran")
            UF3("Lihat Laporan Arus Kas")
            UF4("Export Data Transaksi")
            UF5("Kelola Rekening & QRIS")
        end

        subgraph FS["Pengaturan Sistem"]
            US1("Kelola Akun Admin")
        end
    end

    PENGUNJUNG --> UC1
    PENGUNJUNG --> UC2
    PENGUNJUNG --> UC3
    PENGUNJUNG --> UC4
    PENGUNJUNG --> UC5
    PENGUNJUNG --> UC6
    PENGUNJUNG --> UC7
    PENGUNJUNG --> UC8

    ADMIN --> UA1
    ADMIN --> UA2
    ADMIN --> UK1
    ADMIN --> UK2
    ADMIN --> UK3
    ADMIN --> UK4
    ADMIN --> UK5
    ADMIN --> UF1
    ADMIN --> UF2
    ADMIN --> UF3
    ADMIN --> UF4
    ADMIN --> UF5
    ADMIN --> US1
```

---

## 2. Activity Diagrams

### 2.1 Activity Diagram: Login & Akses Dashboard Admin

```mermaid
flowchart TD
    S([Mulai]) --> BUKA[Buka Halaman /admin/login]
    BUKA --> ISI[Masukkan Username & Password]
    ISI --> SUBMIT[Klik Tombol Login]
    SUBMIT --> CEK_FIELD{Field\nkosong?}
    CEK_FIELD -- Ya --> ERR_FIELD[Tampilkan Validasi Field Wajib]
    ERR_FIELD --> ISI
    CEK_FIELD -- Tidak --> QUERY[Query tabel admin_users\nWHERE username = input]
    QUERY --> CEK_USER{User\nditemukan?}
    CEK_USER -- Tidak --> ERR_AUTH[Tampilkan Pesan:\nUsername atau Password Salah]
    ERR_AUTH --> ISI
    CEK_USER -- Ya --> CEK_HASH{Hash SHA-256\ncocok?}
    CEK_HASH -- Tidak --> ERR_AUTH
    CEK_HASH -- Ya --> CEK_AKTIF{Akun\naktif?}
    CEK_AKTIF -- Tidak --> ERR_NONAKTIF[Tampilkan Pesan:\nAkun Dinonaktifkan]
    ERR_NONAKTIF --> ISI
    CEK_AKTIF -- Ya --> SESI[Buat Session Cookie httpOnly]
    SESI --> DASHBOARD[Redirect ke /admin/dashboard]
    DASHBOARD --> PILIH_MENU{Pilih Menu\nSidebar}
    PILIH_MENU -- Konten --> KONTEN[Khatib / Jadwal / Berita\nGaleri / Program Unggulan]
    PILIH_MENU -- Keuangan --> KEUANGAN[Pemasukan / Pengeluaran\nArus Kas / Rekening]
    PILIH_MENU -- Logout --> HAPUS_SESI[Hapus Session Cookie]
    HAPUS_SESI --> REDIR[Redirect ke /admin/login]
    REDIR --> E([Selesai])
    KONTEN --> E
    KEUANGAN --> E
```

---

### 2.2 Activity Diagram: Kelola Transaksi Keuangan

```mermaid
flowchart TD
    S([Mulai]) --> BUKA[Admin Buka Menu Keuangan]
    BUKA --> PILIH{Pilih\nSub-Menu}

    PILIH -- Pemasukan --> H_PMS[Halaman Pemasukan]
    H_PMS --> AKSI_PMS{Pilih Aksi}
    AKSI_PMS -- Tambah --> FORM_PMS[Form: Kategori, Keterangan,\nJumlah, Tanggal]
    FORM_PMS --> V_PMS{Data\nlengkap?}
    V_PMS -- Tidak --> FORM_PMS
    V_PMS -- Ya --> DB_PMS[Simpan ke DB — jenis=masuk]
    AKSI_PMS -- Edit --> EDIT_PMS[Ubah Data Transaksi Masuk]
    EDIT_PMS --> DB_PMS
    AKSI_PMS -- Hapus --> K_PMS{Konfirmasi\nHapus?}
    K_PMS -- Batal --> H_PMS
    K_PMS -- Ya --> DEL_PMS[Hapus dari DB]
    AKSI_PMS -- Export --> EXP[Export CSV / Excel / Print]

    PILIH -- Pengeluaran --> H_PLG[Halaman Pengeluaran]
    H_PLG --> AKSI_PLG{Pilih Aksi}
    AKSI_PLG -- Tambah --> FORM_PLG[Form: Kategori, Keterangan,\nJumlah, Tanggal]
    FORM_PLG --> V_PLG{Data\nlengkap?}
    V_PLG -- Tidak --> FORM_PLG
    V_PLG -- Ya --> DB_PLG[Simpan ke DB — jenis=keluar]
    AKSI_PLG -- Edit --> EDIT_PLG[Ubah Data Transaksi Keluar]
    EDIT_PLG --> DB_PLG
    AKSI_PLG -- Hapus --> K_PLG{Konfirmasi\nHapus?}
    K_PLG -- Batal --> H_PLG
    K_PLG -- Ya --> DEL_PLG[Hapus dari DB]

    PILIH -- Arus Kas --> AK[Halaman Arus Kas /admin/laporan]
    AK --> FILTER[Pilih Filter Tahun]
    FILTER --> RINGKASAN[Tampilkan Ringkasan Bulanan:\nPemasukan, Pengeluaran, Saldo]
    RINGKASAN --> EXP_AK{Export?}
    EXP_AK -- Ya --> CETAK[Export CSV / Print]
    EXP_AK -- Tidak --> E([Selesai])

    DB_PMS --> E
    DEL_PMS --> E
    EXP --> E
    DB_PLG --> E
    DEL_PLG --> E
    CETAK --> E
```

---

### 2.3 Activity Diagram: Kelola Berita & Akses Pengunjung

```mermaid
flowchart TD
    S([Mulai]) --> ROLE{Siapa\nyang akses?}

    ROLE -- Admin --> BUKA_ADMIN[Buka /admin/berita]
    BUKA_ADMIN --> DAFTAR[Tampil Daftar Berita]
    DAFTAR --> AKSI{Pilih Aksi}

    AKSI -- Tambah --> FORM[Isi Judul, Kategori, Tanggal,\nSlug, Ringkasan, Konten]
    FORM --> CEK_SLUG{Slug\nunik?}
    CEK_SLUG -- Tidak --> ERR_SLUG[Tampil Error: Slug Duplikat]
    ERR_SLUG --> FORM
    CEK_SLUG -- Ya --> CEK_DATA{Data\nlengkap?}
    CEK_DATA -- Tidak --> FORM
    CEK_DATA -- Ya --> SIMPAN[Simpan ke tabel berita]
    SIMPAN --> PUBLIK[Berita tampil di /berita]

    AKSI -- Edit --> LOAD[Load Data Berita Terpilih]
    LOAD --> UBAH[Ubah Field yang Diperlukan]
    UBAH --> UPDATE[Simpan Perubahan ke DB]
    UPDATE --> PUBLIK

    AKSI -- Hapus --> KONFIRM{Yakin\nHapus?}
    KONFIRM -- Batal --> DAFTAR
    KONFIRM -- Ya --> HAPUS[Hapus dari DB]
    HAPUS --> PUBLIK

    ROLE -- Pengunjung --> BERANDA[Buka Beranda:\nLihat 3 Berita Terbaru]
    BERANDA --> KLIK_SEMUA[Klik Lihat Semua Berita]
    KLIK_SEMUA --> LIST[Halaman /berita\nSemua Berita Tersedia]
    LIST --> KLIK_BERITA[Klik Judul Berita]
    KLIK_BERITA --> DETAIL[Halaman Detail /berita/slug]

    PUBLIK --> LIST
    DETAIL --> E([Selesai])
```

---

## 3. Class Diagram

```mermaid
classDiagram
    direction TB

    class Khatib {
        +UUID id
        +String nama
        +String gelar
        +String spesialisasi
        +String noHp
        +String email
        +Boolean aktif
        +String fotoUrl
        +isAktif() Boolean
        +getNamaLengkap() String
    }

    class Jadwal {
        +UUID id
        +Date tanggal
        +String jenisKegiatan
        +UUID khatibId
        +String topik
        +String waktu
        +String keterangan
        +hasKhatib() Boolean
        +isMendatang() Boolean
    }

    class Transaksi {
        +UUID id
        +Date tanggal
        +String keterangan
        +String kategori
        +String jenis
        +BigInt jumlah
        +isMasuk() Boolean
        +isKeluar() Boolean
        +getFormatRupiah() String
    }

    class Rekening {
        +UUID id
        +String bank
        +String norek
        +String atas
        +Integer urutan
        +Boolean aktif
        +isAktif() Boolean
        +getTampilan() String
    }

    class Pengaturan {
        +String key
        +String value
        +getValue() String
        +setValue(val String) void
    }

    class Berita {
        +UUID id
        +String slug
        +String judul
        +String ringkasan
        +String konten
        +String kategori
        +Date tanggal
        +Timestamp createdAt
        +getUrl() String
        +getRingkasanSingkat(panjang int) String
    }

    class Galeri {
        +UUID id
        +String judul
        +String deskripsi
        +String imageUrl
        +String kategori
        +Date tanggal
        +Timestamp createdAt
        +getImageUrl() String
    }

    class ProgramImages {
        +String key
        +String imageUrl
        +Timestamp updatedAt
        +getImageUrl() String
        +updateImage(url String) void
    }

    class AdminUsers {
        +UUID id
        +String username
        +String passwordHash
        +String nama
        +Boolean aktif
        +Timestamp createdAt
        +verifyPassword(input String) Boolean
        +isAktif() Boolean
        +hashPassword(plain String) String
    }

    %% Relasi struktural
    Khatib "1" --> "0..*" Jadwal : mengisi

    %% Relasi pengelolaan (admin mengelola semua entitas)
    AdminUsers ..> Khatib : mengelola
    AdminUsers ..> Jadwal : mengelola
    AdminUsers ..> Berita : mengelola
    AdminUsers ..> Galeri : mengelola
    AdminUsers ..> Transaksi : mencatat
    AdminUsers ..> Rekening : mengelola
    AdminUsers ..> ProgramImages : mengunggah
    AdminUsers ..> Pengaturan : mengkonfigurasi
```

---

## Ringkasan Use Case

| No | Use Case                    | Aktor      | Modul             |
|----|-----------------------------|------------|-------------------|
| 1  | Lihat Beranda               | Pengunjung | Publik            |
| 2  | Lihat Berita & Pengumuman   | Pengunjung | Publik            |
| 3  | Lihat Jadwal Kegiatan       | Pengunjung | Publik            |
| 4  | Lihat Jadwal Sholat         | Pengunjung | Publik            |
| 5  | Lihat Laporan Keuangan      | Pengunjung | Publik            |
| 6  | Lihat Galeri Foto           | Pengunjung | Publik            |
| 7  | Filter & Export Laporan     | Pengunjung | Publik            |
| 8  | Lihat Rekening Donasi       | Pengunjung | Publik            |
| 9  | Login Admin                 | Admin      | Autentikasi       |
| 10 | Logout                      | Admin      | Autentikasi       |
| 11 | Kelola Data Khatib          | Admin      | Kelola Konten     |
| 12 | Kelola Jadwal Kegiatan      | Admin      | Kelola Konten     |
| 13 | Kelola Berita & Pengumuman  | Admin      | Kelola Konten     |
| 14 | Kelola Galeri Foto          | Admin      | Kelola Konten     |
| 15 | Kelola Program Unggulan     | Admin      | Kelola Konten     |
| 16 | Catat Transaksi Pemasukan   | Admin      | Kelola Keuangan   |
| 17 | Catat Transaksi Pengeluaran | Admin      | Kelola Keuangan   |
| 18 | Lihat Laporan Arus Kas      | Admin      | Kelola Keuangan   |
| 19 | Export Data Transaksi       | Admin      | Kelola Keuangan   |
| 20 | Kelola Rekening & QRIS      | Admin      | Kelola Keuangan   |
| 21 | Kelola Akun Admin           | Admin      | Pengaturan Sistem |
