'use client';
import { Bell, Search, User, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminNavbar() {
	return (
		<header className='h-16 bg-white border-b border-black/5 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0'>
			{/* IZQUIERDA: Home */}
			<Link
				href='/'
				className='p-2 rounded-full hover:bg-[#F5F1EB] transition-colors text-black/30 hover:text-black'
			>
				<Home size={18} strokeWidth={1.5} />
			</Link>

			{/* CENTRO: Buscador */}
			<div className='flex-1 max-w-sm mx-6'>
				<div className='relative'>
					<Search
						size={14}
						className='absolute left-3 top-1/2 -translate-y-1/2 text-black/20'
					/>
					<input
						type='text'
						placeholder='Buscar pedidos, productos...'
						className='w-full bg-[#F5F1EB] border-none rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#C4A95E] transition'
					/>
				</div>
			</div>

			{/* DERECHA: Notificaciones + Perfil */}
			<div className='flex items-center gap-4 text-black/30'>
				<button className='relative p-2 hover:text-black hover:bg-[#F5F1EB] rounded-full transition-colors'>
					<Bell size={18} strokeWidth={1.5} />
					<span className='absolute top-1.5 right-1.5 bg-red-500 w-1.5 h-1.5 rounded-full border border-white' />
				</button>

				<div className='h-6 w-px bg-black/5' />

				<div className='flex items-center gap-2 cursor-pointer hover:opacity-70 transition'>
					<div className='text-right hidden md:block'>
						<p className='text-[10px] font-bold text-black uppercase tracking-widest'>
							Admin
						</p>
						<p className='text-[9px] text-black/30'>
							ZÁLEA
						</p>
					</div>
					<div className='w-8 h-8 bg-[#F5F1EB] rounded-full flex items-center justify-center border border-black/5'>
						<User size={16} className='text-black/30' />
					</div>
				</div>
			</div>
		</header>
	);
}
