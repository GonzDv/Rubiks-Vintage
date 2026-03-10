import Navbar from '@/components/public/Navbar';
import AnnouncementBar from '@/components/public/AnnouncementBar';

export default function PublicLayout({ children }) {
	return (
		<div className='flex flex-col min-h-screen'>
			<AnnouncementBar />
			<Navbar />

			<main className='grow bg-[#F0EDE9]'>{children}</main>

			<footer className='border-t border-black/5 py-12 bg-[#F9F8F6]'>
				<div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8'>
					{/* Marca */}
					<div className='text-center md:text-left'>
						<h3 className='font-serif italic text-xl text-black'>
							ZÁLEA
						</h3>
						<p className='text-[10px] uppercase tracking-widest text-black/30 mt-1'>
							Joyas con historia, elegancia para
							hoy.
						</p>
					</div>

					{/* Links */}
					<div className='flex gap-8 text-[10px] uppercase tracking-widest text-black/40 font-medium'>
						<a
							href='https://www.instagram.com/zalea.jewelry'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-black transition-colors'
						>
							Instagram
						</a>
						<a
							href='#'
							className='hover:text-black transition-colors'
						>
							Términos
						</a>
						<a
							href='#'
							className='hover:text-black transition-colors'
						>
							Contacto
						</a>
					</div>

					{/* Copyright */}
					<p className='text-[10px] text-black/25 text-center md:text-right'>
						© {new Date().getFullYear()} ZÁLEA. Todos
						los derechos reservados.
					</p>
				</div>
			</footer>
		</div>
	);
}
