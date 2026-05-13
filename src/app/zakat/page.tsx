import Sidebar from "@/components/Sidebar/page";
import Footer from "@/components/Footer/page";
import ZakatClient from "./ZakatClient";

export const metadata = {
  title: "Kalkulator Zakat — Masjid Al-Hidayah",
  description: "Hitung zakat maal, zakat penghasilan, dan zakat fitrah dengan mudah.",
};

export default function ZakatPage() {
  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <Sidebar />
      <div className="pt-[65px]">
        <ZakatClient />
      </div>
      <Footer />
    </div>
  );
}
