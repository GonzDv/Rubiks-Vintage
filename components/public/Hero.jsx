import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
	return (
		<section className='relative flex flex-col md:flex-row w-full min-h-[90vh] bg-[#F5F1EB] overflow-hidden'>
			{/* ── LADO IZQUIERDO — Contenido ── */}
			<div className='relative w-full md:w-[50%] flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 py-16 md:py-24 order-2 md:order-1 z-10'>
				{/* Número decorativo de fondo */}
				<span className='absolute -top-4 -left-2 text-[160px] md:text-[220px] font-serif italic text-black/3 leading-none select-none pointer-events-none'>
					Z
				</span>

				<div className='flex flex-col justify-center items-center flex-1 space-y-4'>
					{/* Eyebrow */}
					<div className='flex items-center gap-4'>
						<div className='w-8 h-px bg-[#C4A95E]' />
						<span className='text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold'>
							Fine Jewelry · ZÁLEA
						</span>
					</div>

					{/* Headline principal */}
					<div className='space-y-2'>
						<h1 className='text-5xl md:text-6xl lg:text-8xl font-serif italic text-black leading-[0.95] tracking-tight'>
							Esencia
						</h1>
						<h1 className='text-5xl md:text-6xl lg:text-8xl font-serif italic text-black leading-[0.95] tracking-tight pl-8 md:pl-16'>
							que
						</h1>
						<h1 className='text-5xl md:text-6xl lg:text-8xl font-serif italic text-[#A07F3A] leading-[0.95] tracking-tight'>
							perdura.
						</h1>
					</div>

					{/* Descripción */}
					<p className='text-black/50 text-sm max-w-xs font-light leading-relaxed'>
						Piezas únicas en oro laminado diseñadas para
						elevar cada momento. Calidad artesanal que
						captura la luz y define tu estilo.
					</p>

					{/* CTA */}
					<Link
						href='/products'
						className='group inline-flex items-center gap-4 self-start'
					>
						<span className='w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-[#A07F3A] transition-colors duration-500'>
							<ArrowRight
								size={16}
								className='text-white group-hover:translate-x-0.5 transition-transform duration-300'
								strokeWidth={1.5}
							/>
						</span>
						<span className='text-[10px] uppercase tracking-[0.4em] font-bold text-black group-hover:text-[#A07F3A] transition-colors duration-300'>
							Explorar Tienda
						</span>
					</Link>
				</div>

				{/* Stats en el footer del lado izquierdo */}
				<div className='flex gap-8 pt-8 border-t border-black/5'>
					<div>
						<p className='text-2xl font-serif italic text-black'>
							100%
						</p>
						<p className='text-[9px] uppercase tracking-widest text-black/30 mt-1'>
							Oro Laminado
						</p>
					</div>
					<div className='border-l border-black/5 pl-10'>
						<p className='text-2xl font-serif italic text-black'>
							18k
						</p>
						<p className='text-[9px] uppercase tracking-widest text-black/30 mt-1'>
							Calidad
						</p>
					</div>
					<div className='border-l border-black/5 pl-10'>
						<p className='text-2xl font-serif italic text-black'>
							∞
						</p>
						<p className='text-[9px] uppercase tracking-widest text-black/30 mt-1'>
							Estilo
						</p>
					</div>
				</div>
			</div>

			{/* ── LADO DERECHO — Placeholder visual ── */}
			<div className='w-full md:w-[50%] relative h-[55vw] md:h-auto order-1 md:order-2 bg-[#DBD2C8]'>
				{/* Patrón de fondo geométrico */}
				<div
					className='absolute inset-0 opacity-10'
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)`,
						backgroundSize: '32px 32px',
					}}
				/>

				{/* Marco decorativo central */}
				<div className='absolute inset-8 md:inset-12 border border-[#A07F3A]/20 rounded-sm' />
				<div className='absolute inset-10 md:inset-14 border border-[#A07F3A]/10 rounded-sm' />

				{/* Contenido central del placeholder */}
				<div className='absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-12'>
					{/* Ícono de joya estilizado con CSS */}
					<div className='relative w-20 h-20'>
						<div className='absolute inset-0 rotate-45 border-2 border-[#A07F3A]/40 rounded-sm' />
						<div className='absolute inset-3 rotate-45 border border-[#A07F3A]/20 rounded-sm' />
						<div className='absolute inset-0 flex items-center justify-center'>
							<div className='w-3 h-3 bg-[#A07F3A]/30 rotate-45 rounded-sm' />
						</div>
					</div>

					<div className='space-y-2'>
						<p className='text-[9px] uppercase tracking-[0.5em] text-[#A07F3A]/60 font-bold'>
							Tu imagen aquí
						</p>
						<p className='text-[9px] text-black/20 tracking-wider'>
							Sube tu foto en Supabase Storage
						</p>
					</div>
				</div>

				{/* Etiqueta decorativa esquina */}
				<div className='absolute bottom-8 right-8 text-right'>
					<p className='text-[8px] uppercase tracking-[0.4em] text-black/20 font-bold'>
						Nueva Colección
					</p>
					<p className='text-[8px] uppercase tracking-[0.4em] text-[#A07F3A]/40'>
						2025
					</p>
				</div>

				{/* Franja vertical decorativa */}
				<div className='absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-transparent via-[#A07F3A]/20 to-transparent' />
			</div>
		</section>
	);
}
