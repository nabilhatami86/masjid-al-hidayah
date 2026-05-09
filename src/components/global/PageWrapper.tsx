import Sidebar from "@/components/Sidebar/page";
import Footer from "@/components/Footer/page";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: Props) {
  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <Sidebar />
      <div className={`pt-[65px] ${className ?? ""}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
