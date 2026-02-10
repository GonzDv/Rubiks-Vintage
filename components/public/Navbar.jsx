"use client";

import Link from 'next/link';
import { ShoppingBag, User, Menu, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full bg-black/90 backdrop-blur-md border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium text-gray-200">
          <Link href="/shop" className="hover:text-white transition">Tienda</Link>
          <Link href="/collections" className="hover:text-white transition">Colecciones</Link>
          <Link href="/about" className="hover:text-white transition">Nosotros</Link>
        </div>

        <div className="flex-1 flex justify-center">
          <Link href="/">
            <h1 className="text-2xl font-serif tracking-tight text-white italic">
              Rubik's <span className="font-light not-italic text-gray-400">Vintage</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-5 text-gray-200">
          <button className="hover:text-white transition hidden sm:block">
            <Search size={20} strokeWidth={1.5} />
          </button>
          
          <Link href="/login" className="hover:text-white text-gray-200 transition">
            <User size={20} strokeWidth={1.5} />
          </Link>

          <Link href="/cart" className="relative group">
            <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:text-white transition" />
            <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>

          <button className="md:hidden hover:text-white transition">
            <Menu size={20} />
          </button>
        </div>

      </div>
    </nav>
  );
}