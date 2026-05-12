import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import TransaksiManager from "@/components/TransaksiManager";

export default function PengeluaranPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 md:ml-56 pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-5 py-8">
            <TransaksiManager jenis="keluar" />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
