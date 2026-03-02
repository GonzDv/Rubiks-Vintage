"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  X,
  Home 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Sidebar({ onClose }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventario", href: "/inventory", icon: Package },
    { name: "Pedidos", href: "/orders", icon: ShoppingBag },
    { name: "Clientes", href: "/customers", icon: Users },
    { name: "Home", href: "/", icon: Home },
  ];

  return (
    <div className="h-full flex flex-col bg-[#1A1A1A] text-white/70">
      
      {/* HEADER DEL SIDEBAR */}
      <div className="p-8 flex items-center justify-between border-b border-white/5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-serif italic text-white tracking-tight">ZÁLEA</h2>
          <span className="text-[8px] uppercase tracking-[0.4em] text-[#A07F3A] font-bold">Admin Panel</span>
        </div>

        {/* BOTÓN CERRAR: Solo visible en móvil/tablet */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-[#A07F3A]"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose} // Cerramos el sidebar al elegir una opción en móvil
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] uppercase tracking-[0.2em] font-medium transition-all
                ${isActive 
                  ? "bg-white text-black font-bold shadow-lg shadow-black/20" 
                  : "hover:bg-white/5 hover:text-white"}
              `}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER: Configuración y Salir */}
      <div className="p-6 border-t border-white/5 space-y-1">
        <Link 
          href="/settings" 
          onClick={onClose}
          className="flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest hover:text-[#A07F3A] transition-colors"
        >
          <Settings size={16} strokeWidth={1.5} /> Configuración
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
        >
          <LogOut size={16} strokeWidth={1.5} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}