"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TOKEN } from "@/lib/adminTypes";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router  = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_token") === ADMIN_TOKEN) {
      setOk(true);
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
