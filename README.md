# Masjid Al-Hidayah — Website Resmi

Website resmi **Masjid Al-Hidayah** — Ketintang Baru XV, Kec. Gayungan, Surabaya.
Dibangun dengan Next.js 16, React 19, Tailwind CSS v4, dan Supabase sebagai backend database.

---

## Fitur Utama

### Halaman Publik
| Halaman | Path | Deskripsi |
|---------|------|-----------|
| Beranda | `/` | Informasi masjid, jadwal mendatang, berita, & nomor rekening donasi |
| Berita | `/berita` | Daftar artikel & berita kegiatan masjid |
| Detail Berita | `/berita/[slug]` | Halaman detail artikel |
| Laporan Keuangan | `/laporan-keuangan` | Laporan pemasukan & pengeluaran yang transparan |

### Panel Admin
| Halaman | Path | Deskripsi |
|---------|------|-----------|
| Login | `/admin/login` | Autentikasi admin |
| Dashboard | `/admin/dashboard` | Ringkasan statistik keuangan & jadwal |
| Kelola Khatib | `/admin/khatib` | CRUD data khatib/penceramah |
| Kelola Jadwal | `/admin/jadwal` | CRUD jadwal kegiatan masjid |
| Kelola Keuangan | `/admin/keuangan` | CRUD transaksi pemasukan & pengeluaran |
| Kelola Program | `/admin/program` | Upload gambar untuk program kegiatan |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Icon | Lucide React |
| Chart | Recharts |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Bahasa | TypeScript |

---

## Struktur Proyek

```
src/
├── app/
│   ├── admin/              # Panel admin (protected)
│   │   ├── dashboard/
│   │   ├── jadwal/
│   │   ├── keuangan/
│   │   ├── khatib/
│   │   ├── login/
│   │   └── program/
│   ├── api/                # REST API routes
│   │   ├── jadwal/
│   │   ├── khatib/
│   │   ├── transaksi/
│   │   └── program-images/
│   ├── berita/             # Halaman berita
│   ├── home/               # Komponen halaman beranda
│   ├── laporan-keuangan/   # Laporan keuangan publik
│   └── layout.tsx
├── components/
│   ├── AdminGuard.tsx      # Proteksi route admin
│   ├── AdminSidebar.tsx
│   ├── Footer/
│   └── Sidebar/
└── lib/
    ├── adminTypes.ts       # Type definitions & konstanta
    ├── controllers/        # Business logic per entitas
    │   ├── jadwalController.ts
    │   ├── khatibController.ts
    │   ├── programController.ts
    │   └── transaksiController.ts
    ├── db.ts               # Query helpers Supabase
    ├── supabase.ts         # Supabase client (browser)
    └── supabaseServer.ts   # Supabase client (server)

supabase/
├── schema.sql              # DDL lengkap + seed data
├── migration_foto.sql      # Migrasi kolom foto khatib
└── migration_grants.sql    # RLS & permission grants
```

---

## Instalasi & Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd masjid-al-hidayah
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Masuk ke **SQL Editor**, jalankan file `supabase/schema.sql`
3. Jalankan `supabase/migration_foto.sql` dan `supabase/migration_grants.sql`

### 3. Konfigurasi Environment

Buat file `.env.local` di root project:

```env
# Supabase — ambil dari: Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Database Schema

Lihat [ERD.md](ERD.md) untuk diagram lengkap.

| Tabel | Deskripsi |
|-------|-----------|
| `khatib` | Data khatib/penceramah |
| `jadwal` | Jadwal kegiatan masjid |
| `transaksi` | Keuangan (pemasukan & pengeluaran) |
| `program_images` | URL gambar untuk program kegiatan |

**Relasi:** `jadwal.khatib_id` → `khatib.id` (nullable, many-to-one)

### Row Level Security (RLS)
- **SELECT**: terbuka untuk publik (tanpa autentikasi)
- **INSERT / UPDATE / DELETE**: hanya `authenticated` (admin Supabase)

---

## API Endpoints

Semua endpoint berada di `/api/*` dan mengembalikan JSON.

### Khatib
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/khatib` | Ambil semua khatib |
| `POST` | `/api/khatib` | Tambah khatib baru |
| `PUT` | `/api/khatib/[id]` | Update khatib |
| `DELETE` | `/api/khatib/[id]` | Hapus khatib |

### Jadwal
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/jadwal` | Ambil semua jadwal |
| `POST` | `/api/jadwal` | Tambah jadwal baru |
| `PUT` | `/api/jadwal/[id]` | Update jadwal |
| `DELETE` | `/api/jadwal/[id]` | Hapus jadwal |

### Transaksi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/transaksi` | Ambil semua transaksi |
| `POST` | `/api/transaksi` | Tambah transaksi |
| `PUT` | `/api/transaksi/[id]` | Update transaksi |
| `DELETE` | `/api/transaksi/[id]` | Hapus transaksi |

### Program Images
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/program-images` | Ambil semua gambar program |
| `PUT` | `/api/program-images/[key]` | Upload/update gambar program |

---

## Scripts

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Build production
npm run start    # Jalankan production build
npm run lint     # Cek linting ESLint
```

---

## Deploy

### Vercel (Rekomendasi)

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Catatan Penting
- Pastikan domain production ditambahkan ke **Supabase → Authentication → URL Configuration**
- File `.env.local` **jangan di-commit** ke repository (sudah ada di `.gitignore`)
