import PageWrapper from "@/components/global/PageWrapper";
import GaleriClient from "./GaleriClient";

export const metadata = {
  title: "Galeri | Masjid Al-Hidayah",
  description: "Galeri foto kegiatan Masjid Al-Hidayah Ketintang Surabaya",
};

export default function GaleriPage() {
  return (
    <PageWrapper>
      <GaleriClient />
    </PageWrapper>
  );
}
