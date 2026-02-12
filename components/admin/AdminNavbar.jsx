"use client";
import { Bell, Search, User, Home } from 'lucide-react';
import Link from 'next/link';
export default function AdminNavbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
  
      <div className="relative w-96 flex items-center gap-5">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none mr-6">

          <Link href="/"><Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /></Link>
        </div>
        <div className=" w-full ml-15">

        <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder="Buscar pedidos, productos..." 
          className="w-full bg-gray-50 border-none rounded-full py-2 pl-3 pr-4 text-xs focus:ring-1 focus:ring-black transition"
        />
        </div>
      </div>

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