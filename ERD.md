# ERD — Masjid Al-Hidayah

```mermaid
erDiagram
    KHATIB {
        uuid    id           PK
        text    nama
        text    gelar
        text    spesialisasi
        text    no_hp
        text    email
        boolean aktif
        text    foto_url     "nullable"
    }

    JADWAL {
        uuid id              PK
        date tanggal
        text jenis_kegiatan
        uuid khatib_id       FK
        text topik
        time waktu
        text keterangan
    }

    TRANSAKSI {
        uuid    id          PK
        date    tanggal
        text    keterangan
        text    kategori
        text    jenis       "'masuk' | 'keluar'"
        numeric jumlah
    }

    PROGRAM_IMAGES {
        text key       PK
        text image_url "nullable"
    }

    KHATIB ||--o{ JADWAL : "mengisi"
```

## Keterangan Relasi

| Relasi | Kardinalitas | Deskripsi |
|--------|-------------|-----------|
| `KHATIB` → `JADWAL` | 1 ke banyak (opsional) | Satu khatib bisa mengisi banyak jadwal; jadwal boleh tanpa khatib (`khatib_id` nullable) |

## Enum / Nilai Tetap

| Kolom | Nilai |
|-------|-------|
| `transaksi.jenis` | `masuk`, `keluar` |
| `transaksi.kategori` (masuk) | Infaq Jumat, Kotak Amal, Donasi Transfer, Wakaf, Zakat |
| `transaksi.kategori` (keluar) | Listrik & Air, Kebersihan, Operasional, Kajian & Kegiatan, Pembangunan & Renovasi |
| `jadwal.jenis_kegiatan` | Khutbah Jumat, Kajian Sabtu, Tahsin Al-Qur'an, Tahfidz, TPA Al-Hidayah, Maulid & Kegiatan Khusus |
```
