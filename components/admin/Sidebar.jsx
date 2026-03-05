'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	Package,
	ShoppingBag,
	Users,
	Settings,
	LogOut,
	X,
	Home,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Sidebar({ onClose }) {
	const supabase = createClient();
	const pathname = usePathname();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.href = '/';
	};

	const menuItems = [
		{
			name: 'Dashboard',
			href: '/admin/dashboard',
			icon: LayoutDashboard,
		},
		{ name: 'Inventario', href: '/admin/inventory', icon: Package },
		{ name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
		{ name: 'Clientes', href: '/admin/customers', icon: Users },
		{ name: 'Home', href: '/', icon: Home },
	];

	return (
		<div className='h-full flex flex-col bg-[#1A1A1A] text-white/70'>
			{/* HEADER DEL SIDEBAR */}
			<div className='p-6 flex items-center justify-between border-b border-white/5'>
				<div className='flex flex-col'>
					<h2 className='text-2xl font-serif italic text-white tracking-tight'>
						ZÁLEA
					</h2>
					<span className='text-[8px] uppercase tracking-[0.4em] text-[#A07F3A] font-bold'>
						Admin Panel
					</span>
				</div>

				{/* BOTÓN CERRAR: Solo visible en mobile — en iPad el sidebar es fijo */}
				<button
					onClick={onClose}
					className='md:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-[#A07F3A]'
				>
					<X size={20} strokeWidth={1.5} />
				</button>
			</div>

			{/* NAVEGACIÓN PRINCIPAL */}
			<nav className='flex-1 px-4 py-6 space-y-1'>
				{menuItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.name}
							href={item.href}
							onClick={onClose}
							className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] uppercase tracking-[0.2em] font-medium transition-all
                ${
				isActive
					? 'bg-white text-black font-bold shadow-lg shadow-black/20'
					: 'hover:bg-white/5 hover:text-white'
			}
              `}
						>
							<item.icon
								size={17}
								strokeWidth={isActive ? 2 : 1.5}
							/>
							{item.name}
						</Link>
					);
				})}
			</nav>

			{/* FOOTER: Configuración y Salir */}
			<div className='p-4 border-t border-white/5 space-y-1'>
				<Link
					href='/admin/settings'
					onClick={onClose}
					className='flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest hover:text-[#A07F3A] transition-colors rounded-xl hover:bg-white/5'
				>
					<Settings size={15} strokeWidth={1.5} />{' '}
					Configuración
				</Link>
				<button
					onClick={handleLogout}
					className='w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all'
				>
					<LogOut size={15} strokeWidth={1.5} /> Cerrar
					Sesión
				</button>
			</div>
		</div>
	);
}
