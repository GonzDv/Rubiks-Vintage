"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Menu} from "lucide-react";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para el menú móvil
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

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F5F1EB] space-y-4">
        <div className="w-8 h-8 border-4 border-[#A07F3A] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-serif italic text-black/40">Verificando credenciales de ZÁLEA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex relative overflow-hidden">
      
      {/* 1. SIDEBAR: Ahora es un Drawer en móvil */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-60 w-64 bg-[#1A1A1A] text-white transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* 2. OVERLAY: Para cerrar el menú al tocar fuera en celular */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. CONTENIDO PRINCIPAL: Sin márgenes fijos */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        
        {/* HEADER MÓVIL: Solo visible en pantallas pequeñas */}
        <header className="lg:hidden flex items-center justify-between px-6 h-20 bg-white border-b border-black/5 shrink-0">
          <h1 className="text-2xl font-serif italic tracking-tight">ZÁLEA <span className="text-[8px] uppercase not-italic opacity-30 tracking-[0.3em] ml-2 font-sans">Admin</span></h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#F5F1EB] rounded-full transition-colors"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </header>

        {/* NAVBAR DESKTOP: Mantiene su lugar en pantallas grandes */}
        <div className="hidden lg:block">
          <AdminNavbar />
        </div>

        {/* ÁREA DE TRABAJO: Con scroll independiente */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-[#F0EDE9]">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}