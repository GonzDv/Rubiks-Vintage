import { createClient } from '@/utils/supabase/server';
import Hero from '@/components/public/Hero';
import ProductCard from '@/components/public/ProductCard';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
async function getFeaturedProducts() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from('products')
		.select('*, categories(name)')
		.order('created_at', { ascending: false })
		.limit(6);

	if (error) {
		console.error('Error al traer productos:', error.message);
		return [];
	}
	return data;
}

export default async function HomePage() {
	const products = await getFeaturedProducts();

	return (
		<main className='min-h-screen bg-[#F0EDE9]'>
			<Hero />

			{/* SECCIÓN DE PRODUCTOS */}
			<section className='max-w-7xl mx-auto px-6 py-20'>
				<div className='flex flex-col md:flex-row md:items-end justify-between items-center mb-16 gap-4'>
					<div>
						<span className='text-[10px] uppercase tracking-[0.3em] text-black/30 font-bold'>
							Selección Exclusiva
						</span>
						<h2 className='text-3xl md:text-4xl font-serif text-black mt-2 italic'>
							Novedades de la Semana
						</h2>
					</div>
					<Link
						href='/products'
						className='text-[10px] uppercase tracking-widest border-b border-black pb-1 hover:text-black/40 hover:border-black/30 transition-colors'
					>
						Ver todas las piezas
					</Link>
				</div>

				{products.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20'>
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
							/>
						))}
					</div>
				) : (
					<div className='py-20 text-center border border-dashed border-black/10 rounded-xl'>
						<p className='text-sm text-black/30 italic'>
							Estamos preparando nuevas piezas para
							ti...
						</p>
					</div>
				)}
			</section>

			{/* SECCIÓN DE VALORES */}
			<section className='bg-[#F9F8F6] py-24 border-y border-black/5'>
				<div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center'>
					<div className='space-y-4'>
						<h4 className='text-[10px] uppercase tracking-[0.2em] font-bold text-black'>
							Envío Asegurado
						</h4>
						<p className='text-xs text-black/40 font-light leading-relaxed'>
							Cuidado absoluto en cada entrega para
							que tus joyas lleguen impecables.
						</p>
					</div>
					<div className='space-y-4 border-y md:border-y-0 md:border-x border-black/5 py-10 md:py-0 px-4'>
						<h4 className='text-[10px] uppercase tracking-[0.2em] font-bold text-black'>
							Oro Laminado
						</h4>
						<p className='text-xs text-black/40 font-light leading-relaxed'>
							Calidad seleccionada para garantizar
							brillo y durabilidad en cada diseño.
						</p>
					</div>
					<div className='space-y-4'>
						<h4 className='text-[10px] uppercase tracking-[0.2em] font-bold text-black'>
							Atención Personal
						</h4>
						<p className='text-xs text-black/40 font-light leading-relaxed'>
							Estamos contigo en cada paso para
							elegir el regalo o accesorio perfecto.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
