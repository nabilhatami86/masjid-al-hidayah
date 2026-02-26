// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface BeritaItem {
  slug: string;
  tanggal: string;
  tanggalIso: string;
  kategori: string;
  dotColor: string;
  labelColor: string;
  badgeBg: string;
  judul: string;
  ringkasan: string;
  konten: BeritaBlock[];
}

export type BeritaBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const beritaList: BeritaItem[] = [
  {
    slug: "penerimaan-santri-tpa-2026",
    tanggal: "20 Februari 2026",
    tanggalIso: "2026-02-20",
    kategori: "Pendidikan",
    dotColor: "bg-blue-500",
    labelColor: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    judul: "Penerimaan Santri TPA Baru Tahun Ajaran 2026/2027",
    ringkasan:
      "Masjid Al-Hidayah membuka pendaftaran santri TPA baru. Pendaftaran dibuka hingga 31 Maret 2026. Hubungi pengurus untuk informasi lebih lanjut.",
    konten: [
      {
        type: "p",
        text: "Alhamdulillah, Taman Pendidikan Al-Qur'an (TPA) Masjid Al-Hidayah kembali membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Program ini ditujukan bagi anak-anak usia 5–15 tahun yang ingin belajar membaca dan memahami Al-Qur'an dengan bimbingan pengajar berpengalaman.",
      },
      {
        type: "h3",
        text: "Persyaratan Pendaftaran",
      },
      {
        type: "ul",
        items: [
          "Usia 5–15 tahun",
          "Fotokopi Kartu Keluarga (1 lembar)",
          "Pas foto 3×4 sebanyak 2 lembar",
          "Mengisi formulir pendaftaran yang tersedia di sekretariat masjid",
        ],
      },
      {
        type: "h3",
        text: "Jadwal Belajar",
      },
      {
        type: "ul",
        items: [
          "Senin – Kamis: pukul 15:30 – 17:00 WIB",
          "Sabtu: pukul 08:00 – 09:30 WIB",
          "Bertempat di Gedung Serbaguna Masjid Al-Hidayah",
        ],
      },
      {
        type: "h3",
        text: "Kurikulum",
      },
      {
        type: "p",
        text: "Kurikulum TPA mencakup pembelajaran Iqra' dan Al-Qur'an, tajwid dasar, hafalan juz 30, doa sehari-hari, serta akhlak dan fiqih ibadah dasar. Metode pengajaran menggunakan pendekatan individual sehingga setiap santri mendapat perhatian yang optimal.",
      },
      {
        type: "callout",
        text: "Pendaftaran dibuka mulai 20 Februari – 31 Maret 2026. Tidak dipungut biaya pendaftaran. Biaya SPP sangat terjangkau, dapat diangsur. Hubungi sekretariat masjid atau Ust. Farid (0812-3456-7890) untuk informasi selengkapnya.",
      },
    ],
  },
  {
    slug: "kajian-tahsin-quran-2026",
    tanggal: "10 Februari 2026",
    tanggalIso: "2026-02-10",
    kategori: "Kajian",
    dotColor: "bg-emerald-500",
    labelColor: "text-emerald-700",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    judul: "Kajian Tahsin Al-Qur'an Kembali Dibuka untuk Umum",
    ringkasan:
      "Program Tahsin hadir kembali setiap Sabtu pukul 09:00 WIB. Terbuka untuk umum, semua level diterima tanpa biaya pendaftaran.",
    konten: [
      {
        type: "p",
        text: "Masjid Al-Hidayah dengan bangga mengumumkan pembukaan kembali program Kajian Tahsin Al-Qur'an untuk umum. Program ini dirancang bagi siapa saja yang ingin memperbaiki dan menyempurnakan bacaan Al-Qur'an sesuai kaidah tajwid yang benar.",
      },
      {
        type: "h3",
        text: "Tentang Program Tahsin",
      },
      {
        type: "p",
        text: "Tahsin berasal dari kata hasana – yuhasinu yang berarti memperbaiki dan memperindah. Program ini berfokus pada perbaikan makhraj huruf, kelancaran bacaan, dan penerapan hukum tajwid secara praktis. Pengajar adalah Ustadz yang telah bersanad langsung.",
      },
      {
        type: "h3",
        text: "Jadwal & Tempat",
      },
      {
        type: "ul",
        items: [
          "Hari: Setiap Sabtu",
          "Waktu: Pukul 09:00 – 10:30 WIB",
          "Tempat: Aula Utama Masjid Al-Hidayah",
          "Pengajar: Ust. Ahmad Fauzi, S.Pd.I",
        ],
      },
      {
        type: "h3",
        text: "Ketentuan Peserta",
      },
      {
        type: "ul",
        items: [
          "Terbuka untuk umum, laki-laki dan perempuan",
          "Semua level diterima: pemula hingga yang ingin memperhalus bacaan",
          "Membawa Al-Qur'an masing-masing",
          "Hadir tepat waktu",
        ],
      },
      {
        type: "callout",
        text: "Gratis, tanpa biaya pendaftaran. Daftarkan diri langsung di sekretariat masjid atau via WhatsApp: 0813-2345-6789. Tempat terbatas, daftarkan diri segera.",
      },
    ],
  },
  {
    slug: "renovasi-selasar-sound-system-selesai",
    tanggal: "28 Desember 2025",
    tanggalIso: "2025-12-28",
    kategori: "Infrastruktur",
    dotColor: "bg-amber-500",
    labelColor: "text-amber-700",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    judul: "Renovasi Selasar & Sound System Masjid Telah Selesai",
    ringkasan:
      "Alhamdulillah, renovasi selasar dan pemasangan sound system baru telah rampung. Terima kasih atas dukungan seluruh jamaah dan donatur.",
    konten: [
      {
        type: "p",
        text: "Alhamdulillah, dengan rahmat Allah SWT dan dukungan penuh dari seluruh jamaah serta donatur, renovasi selasar masjid dan pemasangan sistem audio (sound system) baru Masjid Al-Hidayah telah resmi selesai per 28 Desember 2025.",
      },
      {
        type: "h3",
        text: "Yang Telah Diselesaikan",
      },
      {
        type: "ul",
        items: [
          "Perluasan dan penataan ulang selasar (teras) masjid seluas ±120 m²",
          "Pemasangan atap kanopi anti-bocor di selasar samping dan belakang",
          "Penggantian sistem audio lama dengan sound system digital 5.1 channel",
          "Pemasangan speaker distribusi di 8 titik area masjid dan halaman",
          "Pengecatan ulang dinding selasar dan pemasangan keramik baru",
        ],
      },
      {
        type: "h3",
        text: "Ucapan Terima Kasih",
      },
      {
        type: "p",
        text: "Pengurus Masjid Al-Hidayah mengucapkan terima kasih yang sebesar-besarnya kepada seluruh donatur, baik perorangan maupun instansi, yang telah berkontribusi dalam proyek renovasi ini. Total dana yang terhimpun mencapai Rp 248.500.000 dari target Rp 230.000.000 — melebihi target berkat kedermawanan jamaah.",
      },
      {
        type: "callout",
        text: "Laporan keuangan lengkap proyek renovasi ini tersedia di papan informasi masjid dan dapat diunduh melalui halaman Laporan Keuangan di website ini. Jazaakumullahu khairan katsiran.",
      },
    ],
  },
];

export function getBeritaBySlug(slug: string): BeritaItem | undefined {
  return beritaList.find((b) => b.slug === slug);
}
