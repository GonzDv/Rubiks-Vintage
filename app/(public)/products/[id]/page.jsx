import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import {
	ChevronRight,
	ShieldCheck,
	Truck,
	Ruler,
	Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/public/ProductCard';
import AddToCartButton from '@/components/public/AddToCartButton';

async function getProduct(id) {
	const supabase = await createClient();
	const { data } = await supabase
		.from('products')
		.select('*, categories(name)')
		.eq('id', id)
		.eq('is_active', true)
		.single();
	return data;
}

async function getRelatedProducts(categoryId, currentProductId) {
	const supabase = await createClient();
	const { data } = await supabase
		.from('products')
		.select('*, categories(name)')
		.eq('category_id', categoryId)
		.neq('id', currentProductId)
		.limit(4);
	return data || [];
}

export default async function ProductDetailPage({ params }) {
	const { id } = await params;
	const product = await getProduct(id);

	if (!product) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-[#F5F1EB]'>
				<p className='font-serif italic text-black/40 text-lg animate-pulse'>
					Buscando tesoro...
				</p>
			</div>
		);
	}

	const relatedProducts = await getRelatedProducts(product.category_id, id);

	return (
		<main className='bg-[#F5F1EB] pt-24 md:pt-32 pb-24'>
			<div className='max-w-7xl mx-auto px-6 lg:px-12'>
				<div className='flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start'>
					{/* IMAGEN */}
					<div className='w-full max-w-md lg:max-w-none lg:w-1/2'>
						<div className='relative aspect-4/5 bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-black/5 group'>
							<Image
								src={product.image_url}
								alt={product.name}
								fill
								className='object-cover transition-transform duration-1000 group-hover:scale-105'
								priority
							/>
						</div>
					</div>

					{/* DETALLES */}
					<div className='w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left'>
						{/* Breadcrumb */}
						<nav className='flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-black/30 mb-6'>
							<Link
								href='/products'
								className='hover:text-black transition-colors'
							>
								Colección
							</Link>
							<ChevronRight size={10} />
							<span className='text-[#C4A95E] font-bold'>
								{product.categories?.name}
							</span>
						</nav>

						{/* Nombre y precio */}
						<div className='mb-8'>
							<h1 className='text-4xl md:text-6xl font-serif italic text-black leading-tight mb-4'>
								{product.name}
							</h1>
							<p className='text-2xl md:text-3xl font-light text-[#A07F3A] tracking-wider font-serif'>
								$
								{product.base_price?.toLocaleString(
									'es-MX',
								)}{' '}
								MXN
							</p>
						</div>

						{/* Descripción */}
						<p className='text-black/60 leading-relaxed font-light text-base md:text-lg mb-10 max-w-lg'>
							{product.description ||
								'Una pieza atemporal diseñada para elevar cada momento con la elegancia del oro laminado.'}
						</p>

						{/* Botón agregar al carrito */}
						<div className='w-full mb-12 flex justify-center lg:justify-start'>
							<AddToCartButton product={product} />
						</div>

						{/* Detalles del producto */}
						<div className='w-full space-y-6 pt-10 border-t border-black/5'>
							<div className='flex flex-col sm:flex-row gap-8 lg:gap-12'>
								<div className='flex items-start gap-4 flex-1'>
									<div className='p-3 bg-white rounded-full shadow-sm'>
										<Sparkles
											size={18}
											className='text-[#C4A95E]'
											strokeWidth={
												1
											}
										/>
									</div>
									<div>
										<h4 className='text-[10px] uppercase tracking-widest font-bold text-black mb-1'>
											Material
										</h4>
										<p className='text-xs text-black/50 font-light leading-snug'>
											Oro laminado
											de 18k con
											acabado
											artesanal.
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4 flex-1'>
									<div className='p-3 bg-white rounded-full shadow-sm'>
										<Ruler
											size={18}
											className='text-[#C4A95E]'
											strokeWidth={
												1
											}
										/>
									</div>
									<div>
										<h4 className='text-[10px] uppercase tracking-widest font-bold text-black mb-1'>
											Medidas
										</h4>
										<p className='text-xs text-black/50 font-light leading-snug'>
											Diseño
											ajustable
											estándar para
											máxima
											comodidad.
										</p>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-6 pt-6 p-6 bg-white/50 rounded-2xl'>
								<div className='flex items-center gap-3'>
									<Truck
										size={16}
										strokeWidth={1.5}
										className='text-black/40'
									/>
									<p className='text-[9px] uppercase tracking-widest text-black/60 font-medium'>
										Envío asegurado
									</p>
								</div>
								<div className='flex items-center gap-3'>
									<ShieldCheck
										size={16}
										strokeWidth={1.5}
										className='text-black/40'
									/>
									<p className='text-[9px] uppercase tracking-widest text-black/60 font-medium'>
										Calidad certificada
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* PRODUCTOS RELACIONADOS */}
			{relatedProducts.length > 0 && (
				<section className='max-w-7xl mx-auto px-6 mt-32 border-t border-black/5 pt-20'>
					<div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
						<div className='text-center md:text-left'>
							<span className='text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold mb-3 block'>
								Completar el look
							</span>
							<h2 className='text-3xl md:text-4xl font-serif italic text-black'>
								También te podría gustar
							</h2>
						</div>
						<Link
							href='/products'
							className='text-[10px] uppercase tracking-widest border-b border-black pb-1 hover:text-[#C4A95E] hover:border-[#C4A95E] transition-all self-center'
						>
							Ver todo
						</Link>
					</div>

					<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
						{relatedProducts.map((related) => (
							<ProductCard
								key={related.id}
								product={related}
							/>
						))}
					</div>
				</section>
			)}
		</main>
	);
}
