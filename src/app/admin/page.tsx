"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TOKEN } from "@/lib/adminTypes";

export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    router.replace(token === ADMIN_TOKEN ? "/admin/dashboard" : "/admin/login");
  }, [router]);
  return null;
}
