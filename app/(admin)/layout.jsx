"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login"); 
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error || !profile?.is_admin) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center">Verificando credenciales...</div>;

  return <><div className="min-h-screen bg-[#F9F9F9] flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <AdminNavbar />
        <main className="p-10 bg-[#f0ede9] flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  </>;
}