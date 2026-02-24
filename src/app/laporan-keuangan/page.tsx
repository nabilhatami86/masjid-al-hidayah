import LaporanKeuanganClient from "./LaporanKeuanganClient";
import Sidebar from "@/components/Sidebar/page";
import Footer from "@/components/Footer/page";

export const metadata = {
  title: "Laporan Keuangan | Masjid Al-Hidayah",
  description: "Laporan keuangan transparan Masjid Al-Hidayah Ketintang Surabaya",
};

export default function LaporanKeuanganPage() {
  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <Sidebar />
      <div className="pt-[65px]">
        <LaporanKeuanganClient />
      </div>
      <Footer />
    </div>
  );
}
