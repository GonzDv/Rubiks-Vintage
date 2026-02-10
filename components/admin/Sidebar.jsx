"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventario', href: '/inventory', icon: Package },
    { name: 'Pedidos', href: '/orders', icon: ShoppingBag },
    { name: 'Clientes', href: '/customers', icon: Users },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 bg-[#1A1A1A] text-white min-h-screen h-[100vh] flex flex-col fixed left-0 top-0">
      {/* Brand / Logo */}
      <div className="p-8 border-b border-white/5">
        <h2 className="text-xl font-serif italic">
          Rubik's <span className="text-gray-500 not-italic text-sm">Admin</span>
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all
                ${isActive 
                  ? 'bg-white text-black font-bold shadow-lg' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/5 space-y-4">
        <Link href="/settings" className="flex items-center gap-4 px-4 py-2 text-sm text-gray-400 hover:text-white transition">
          <Settings size={18} strokeWidth={1.5} />
          Configuración
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition w-full"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}