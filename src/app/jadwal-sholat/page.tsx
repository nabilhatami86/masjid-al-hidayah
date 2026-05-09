import PageWrapper from "@/components/global/PageWrapper";
import JadwalSholatBulananClient from "./JadwalSholatBulananClient";

export const metadata = {
  title: "Jadwal Sholat | Masjid Al-Hidayah",
  description: "Jadwal sholat 5 waktu Kota Surabaya - Masjid Al-Hidayah",
};

export default function JadwalSholatPage() {
  return (
    <PageWrapper>
      <JadwalSholatBulananClient />
    </PageWrapper>
  );
}
