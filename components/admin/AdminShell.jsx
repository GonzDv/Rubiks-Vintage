'use client';
import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Menu } from 'lucide-react';

export default function AdminShell({ children }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className='min-h-screen bg-[#F5F1EB] flex relative overflow-hidden'>
			{/* SIDEBAR
          - Mobile (<768px):  drawer oculto, se abre con botón
          - iPad+ (≥768px):   fijo y siempre visible
      */}
			<aside
				className={`
          fixed inset-y-0 left-0 z-60 w-56 bg-[#1A1A1A] text-white
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:inset-0 md:w-56 md:shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
			>
				<Sidebar onClose={() => setIsSidebarOpen(false)} />
			</aside>

			{/* OVERLAY — solo en mobile */}
			{isSidebarOpen && (
				<div
					className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in'
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* CONTENIDO PRINCIPAL */}
			<div className='flex-1 flex flex-col min-w-0 h-screen'>
				{/* HEADER MÓVIL — solo visible en mobile (<768px) */}
				<header className='md:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-black/5 shrink-0'>
					<h1 className='text-xl font-serif italic tracking-tight'>
						ZÁLEA{' '}
						<span className='text-[8px] uppercase not-italic opacity-30 tracking-[0.3em] ml-2 font-sans'>
							Admin
						</span>
					</h1>
					<button
						onClick={() => setIsSidebarOpen(true)}
						className='p-2 hover:bg-[#F5F1EB] rounded-full transition-colors'
					>
						<Menu size={22} strokeWidth={1.5} />
					</button>
				</header>

				{/* NAVBAR — visible en iPad y desktop (≥768px) */}
				<div className='hidden md:block'>
					<AdminNavbar />
				</div>

				{/* ÁREA DE TRABAJO */}
				<main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 bg-[#F0EDE9]'>
					<div className='max-w-5xl mx-auto'>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
