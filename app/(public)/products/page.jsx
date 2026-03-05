'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/public/ProductCard';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
	const supabase = createClient();
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [activeCategory, setActiveCategory] = useState('Todos');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			const [productsRes, categoriesRes] = await Promise.all([
				supabase
					.from('products')
					.select('*, categories(name)')
					.order('created_at', { ascending: false }),
				supabase
					.from('categories')
					.select('name')
					.order('name', { ascending: true }),
			]);

			if (productsRes.error)
				console.error(
					'Error productos:',
					productsRes.error.message,
				);
			if (categoriesRes.error)
				console.error(
					'Error categorías:',
					categoriesRes.error.message,
				);

			setProducts(productsRes.data || []);

			if (categoriesRes.data) {
				setCategories([
					'Todos',
					...categoriesRes.data.map((c) => c.name),
				]);
			}

			setLoading(false);
		}
		fetchData();
	}, []);

	// Filtrado derivado — no necesita estado separado ni useEffect
	const filteredProducts =
		activeCategory === 'Todos'
			? products
			: products.filter(
					(p) => p.categories?.name === activeCategory,
				);

	return (
		<main className='min-h-screen bg-[#F5F1EB] pb-24'>
			{/* HEADER */}
			<header className='pt-32 pb-16 px-6 text-center'>
				<span className='text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold mb-4 block'>
					Shop the Collection
				</span>
				<h1 className='text-4xl md:text-5xl font-serif italic text-black leading-tight'>
					Piezas con Historia
				</h1>
				<div className='w-12 h-px bg-black/20 mx-auto mt-8' />
			</header>

			{/* FILTROS */}
			<section className='max-w-7xl mx-auto px-6 mb-12 border-y border-black/5 py-4 overflow-x-auto'>
				<div className='flex justify-center gap-6 md:gap-10 text-[11px] uppercase tracking-[0.3em] font-medium whitespace-nowrap'>
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`transition-all duration-300 pb-1 ${
								activeCategory === cat
									? 'text-black border-b border-black font-bold'
									: 'text-black/40 hover:text-black'
							}`}
						>
							{cat}
						</button>
					))}
				</div>
			</section>

			{/* PRODUCTOS */}
			<section className='max-w-7xl mx-auto px-6'>
				{loading ? (
					<div className='flex justify-center py-20 text-[#C4A95E]'>
						<Loader2
							className='animate-spin'
							size={32}
						/>
					</div>
				) : filteredProducts.length > 0 ? (
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16'>
						{filteredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
							/>
						))}
					</div>
				) : (
					<div className='text-center py-20'>
						<p className='text-sm font-light italic text-black/40'>
							No se encontraron piezas en &quot;
							{activeCategory}&quot;.
						</p>
					</div>
				)}
			</section>
		</main>
	);
}
