import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { ShoppingBag, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

async function getProduct(id) {
	const { data } = await supabase
		.from('products')
		.select('*, categories(name)')
		.eq('id', id)
		.single();
	return data;
}

export default async function ProductDetailPage({ params }) {
	const { id } = await params;
	const product = await getProduct(id);

	if (!product) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-[#F5F1EB]'>
				<p className='font-serif italic text-black/40'>
					Este tesoro ya no está disponible...
				</p>
			</div>
		);
	}

	return (
		<main className=' bg-[#F5F1EB] pt-32 pb-20'>
			<div className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>
				<div className='relative aspect-3/4 bg-white rounded-2xl overflow-hidden shadow-sm h-170'>
					<Image
						src={product.image_url}
						alt={product.name}
						fill
						className='object-cover'
						priority
					/>
				</div>

				{/* Información Editorial */}
				<div className='flex flex-col space-y-8 lg:sticky lg:top-32'>
					<nav className='flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/40'>
						<Link
							href={'/products'}
							className='hover:text-black cursor-pointer font-bold'
						>
							Tienda
						</Link>
						<ChevronRight size={10} />
						<span className='text-[#C4A95E] font-bold'>
							{product.categories?.name}
						</span>
					</nav>

					<div>
						<h1 className='text-4xl md:text-5xl font-serif italic text-black mb-4 leading-tight'>
							{product.name}
						</h1>
						<p className='text-2xl font-light text-[#A07F3A] tracking-wider'>
							$
							{product.base_price?.toLocaleString(
								'es-MX',
							)}{' '}
							MXN
						</p>
					</div>

					<p className='text-black/60 leading-relaxed font-light text-base max-w-lg'>
						{product.description ||
							'Una pieza atemporal diseñada para capturar la esencia de la elegancia contemporánea. Oro laminado de alta calidad con acabados artesanales.'}
					</p>

					<div className='space-y-4 pt-6'>
						<button className='w-full bg-black text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-all flex items-center justify-center gap-4 group'>
							<ShoppingBag
								size={18}
								className='group-hover:scale-110 transition-transform'
							/>
							Añadir al Carrito
						</button>
					</div>

					{/* Garantías de Lujo (Trust Badges) */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-black/5'>
						<div className='flex items-center gap-4'>
							<div className='p-3 bg-white rounded-full'>
								<Truck
									size={18}
									strokeWidth={1}
								/>
							</div>
							<p className='text-[10px] uppercase tracking-widest leading-tight text-black/50'>
								Envío asegurado
								<br />
								<span className='text-black font-bold'>
									Todo México
								</span>
							</p>
						</div>
						<div className='flex items-center gap-4'>
							<div className='p-3 bg-white rounded-full'>
								<ShieldCheck
									size={18}
									strokeWidth={1}
								/>
							</div>
							<p className='text-[10px] uppercase tracking-widest leading-tight text-black/50'>
								Calidad certificada
								<br />
								<span className='text-black font-bold'>
									Oro Laminado
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
