// Type definitions untuk tampilan berita.
// Data dikelola via Supabase — lihat src/lib/controllers/beritaController.ts

export type BeritaBlock =
  | { type: "p";       text: string }
  | { type: "h3";      text: string }
  | { type: "ul";      items: string[] }
  | { type: "callout"; text: string };

export interface BeritaItem {
  id:         string;
  slug:       string;
  judul:      string;
  ringkasan:  string;
  konten:     string;
  kategori:   string;
  tanggal:    string;
  created_at: string;
}
