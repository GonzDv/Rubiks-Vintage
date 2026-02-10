"use client";
import { Bell, Search, User } from 'lucide-react';

export default function AdminNavbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
      {/* Barra de Búsqueda Sutil */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder="Buscar pedidos, productos..." 
          className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-black transition"
        />
      </div>

      {/* Perfil y Notificaciones */}
      <div className="flex items-center gap-6 text-gray-500">
        <button className="relative hover:text-black transition">
          <Bell size={20} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition">
          <div className="text-right">
            <p className="text-[10px] font-bold text-black uppercase tracking-widest">Admin</p>
            <p className="text-[9px] text-gray-400">Rubik's Vintage</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <User size={20} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}