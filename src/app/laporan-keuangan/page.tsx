import PageWrapper from "@/components/global/PageWrapper";
import LaporanKeuanganClient from "./LaporanKeuanganClient";

export const metadata = {
  title: "Laporan Keuangan | Masjid Al-Hidayah",
  description: "Laporan keuangan transparan Masjid Al-Hidayah Ketintang Surabaya",
};

export default function LaporanKeuanganPage() {
  return (
    <PageWrapper>
      <LaporanKeuanganClient />
    </PageWrapper>
  );
}
