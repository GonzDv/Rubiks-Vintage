"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const mobileMenuRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", currentUser.id)
          .single();

        setIsAdmin(profile?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
      } else {
        checkUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Corregido: menuRef para el dropdown de usuario
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      // mobileMenuRef para el drawer lateral
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Colección", href: "/products" },
    { name: "Novedades", href: "/new" },
    { name: "Nosotros", href: "/about" },
  ];

  return (
    <>
      <nav className="w-full bg-[#F5F1EB]/80 backdrop-blur-md border-b border-[#A07F3A]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* BOTÓN BURGER: Visible solo en mobile/tablet */}
          <button 
            className="md:hidden text-black hover:text-[#A07F3A] transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Enlaces Desktop */}
          <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-[0.3em] font-medium text-black">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-[#C4A95E] transition-colors font-bold"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex-1 flex justify-center">
            <Link href="/">
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-black italic">
                ZÁLEA
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 text-black">
            <button className="hover:text-[#A07F3A] transition-colors hidden sm:block">
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Lógica del Icono de Cuenta (Desktop) */}
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hover:text-[#A07F3A] transition-colors flex items-center gap-2"
              >
                <User size={20} strokeWidth={1.5} />
                {user && (
                  <span className="text-[9px] uppercase tracking-widest font-bold hidden lg:block">
                    {user.user_metadata?.first_name || "Mi Cuenta"}
                  </span>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-4 w-48 bg-white shadow-xl rounded-xl border border-black/5 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-black/5 mb-2">
                        <p className="text-[10px] text-black/40 uppercase tracking-widest italic">Bienvenida,</p>
                        <p className="text-xs font-bold truncate">{user.user_metadata?.first_name}</p>
                      </div>
                      {isAdmin && (
                        <Link href="/inventory" className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-[#F5F1EB] transition-colors text-black font-bold">
                          <LayoutDashboard size={14} /> Panel Admin
                        </Link>
                      )}
                      <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-[#F5F1EB] transition-colors">
                        <Settings size={14} /> Mis Datos
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-[#F5F1EB] transition-colors">
                        <Package size={14} /> Mis Pedidos
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-black/5 mt-2">
                        <LogOut size={14} /> Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-[#F5F1EB] transition-colors">
                      <User size={14} /> Iniciar Sesión
                    </Link>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative group transition-transform active:scale-90">
              <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:text-[#A07F3A] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A07F3A] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER: Menú lateral animado */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Contenedor del menú */}
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 left-0 w-[85%] max-w-sm h-full bg-[#F5F1EB] shadow-2xl p-8 flex flex-col animate-in slide-in-from-left duration-300"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-serif italic text-black">ZÁLEA</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-black/40 hover:text-black">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.3em] font-light text-black flex justify-between items-center border-b border-black/5 pb-4"
                >
                  {link.name}
                  <ChevronRight size={14} className="text-[#A07F3A]" />
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-black/5 space-y-6">
              {!user ? (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-bold text-black">
                  <User size={18} strokeWidth={1.5} /> Iniciar Sesión
                </Link>
              ) : (
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-bold italic">Hola, {user.user_metadata?.first_name}</p>
                  {isAdmin && (
                    <Link href="/inventory" onClick={() => setIsMobileMenuOpen(false)} className="block text-[11px] uppercase tracking-[0.3em] font-bold text-[#A07F3A]">Panel Admin</Link>
                  )}
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block text-[11px] uppercase tracking-[0.3em] font-bold">Ajustes de cuenta</Link>
                  <button onClick={handleLogout} className="text-[11px] uppercase tracking-[0.3em] font-bold text-red-500">Cerrar Sesión</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}