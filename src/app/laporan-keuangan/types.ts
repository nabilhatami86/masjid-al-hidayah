export interface Transaksi {
  id: string;
  tanggal: string; // "YYYY-MM-DD"
  keterangan: string;
  kategori: string;
  jenis: "masuk" | "keluar";
  jumlah: number;
}

export interface PieEntry {
  name: string;
  value: number;
}

export interface MonthlyEntry {
  bulan: string;
  Pemasukan: number;
  Pengeluaran: number;
}

export interface Summary {
  masuk: number;
  keluar: number;
  saldo: number;
}
