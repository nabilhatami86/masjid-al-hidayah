import Sidebar from "@/components/Sidebar/page";
import Footer from "@/components/Footer/page";
import JadwalSholatClient from "./JadwalSholatClient";
import BeritaSection from "./BeritaSection";
import HeroSection from "./sections/HeroSection";
import ProfilSection from "./sections/ProfilSection";
import JadwalKegiatanSection from "./sections/JadwalKegiatanSection";
import ProgramSection from "./sections/ProgramSection";
import FasilitasSection from "./sections/FasilitasSection";
import KontakSection from "./sections/KontakSection";
import {
  getWIBNow, toDisplayDate, getNextFriday,
  fetchTimings, buildPrayerRows,
  jadwalToEvents, getKhatibForFriday, getProgramsWithImages,
} from "./utils";
import { getJadwalMendatang } from "@/lib/controllers/jadwalController";
import { getAllBerita } from "@/lib/controllers/beritaController";

export default async function HomePages() {
  const wibNow      = getWIBNow();
  const wibTomorrow = new Date(wibNow);
  wibTomorrow.setDate(wibTomorrow.getDate() + 1);

  const nextFriday  = getNextFriday(wibNow);

  const [t1, t2, fridayKhatib, programs, jadwals, beritaItems] = await Promise.all([
    fetchTimings(wibNow),
    fetchTimings(wibTomorrow),
    getKhatibForFriday(nextFriday),
    getProgramsWithImages(),
    getJadwalMendatang(6).catch(() => []),
    getAllBerita().catch(() => []),
  ]);

  const prayerData   = buildPrayerRows(wibNow, wibTomorrow, t1, t2);
  const khutbahLabel = `Khutbah Jumat, ${toDisplayDate(nextFriday)}`;
  const events       = jadwalToEvents(jadwals);

  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <Sidebar />
      <HeroSection />
      <JadwalSholatClient prayerData={prayerData} khutbahLabel={khutbahLabel} fridayKhatib={fridayKhatib} />
      <ProfilSection />
      <JadwalKegiatanSection events={events} />
      <ProgramSection programs={programs} />
      <FasilitasSection />
      <BeritaSection beritaList={beritaItems} />
      <KontakSection />
      <Footer />
    </div>
  );
}
