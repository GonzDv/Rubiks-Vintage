'use client';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

export default function QuickViewModal({ product, onClose }) {
	const [currentImg, setCurrentImg] = useState(0);
	const router = useRouter();

	if (!product) return null;

	const images = product.images?.length
		? product.images
		: [product.image_url];
	const hasMultiple = images.length > 1;

	const prev = (e) => {
		e.stopPropagation();
		setCurrentImg((i) => (i === 0 ? images.length - 1 : i - 1));
	};

	const next = (e) => {
		e.stopPropagation();
		setCurrentImg((i) => (i === images.length - 1 ? 0 : i + 1));
	};

	const goToDetail = () => {
		onClose();
		router.push(`/products/${product.id}`);
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			onClick={onClose}
		>
			{/* Overlay */}
			<div className='absolute inset-0 bg-black/60 backdrop-blur-md' />

			{/* Modal */}
			<div
				className='relative bg-[#F5F1EB] w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300'
				onClick={(e) => e.stopPropagation()}
			>
				{/* BOTÓN CERRAR */}
				<button
					onClick={onClose}
					className='absolute top-4 right-4 z-20 p-2 bg-white/70 hover:bg-white rounded-full transition-all hover:rotate-90 duration-300'
				>
					<X size={18} strokeWidth={1.5} />
				</button>

				{/* IMAGEN */}
				<div className='md:w-3/5 relative aspect-square md:aspect-auto overflow-hidden bg-white'>
					{images[currentImg] && (
						<Image
							src={images[currentImg]}
							alt={product.name}
							fill
							sizes='(max-width: 768px) 100vw, 60vw'
							className='object-cover transition-opacity duration-300'
						/>
					)}

					{/* Controles de imagen — solo si hay múltiples */}
					{hasMultiple && (
						<>
							<button
								onClick={prev}
								className='absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full transition-all shadow-sm'
							>
								<ChevronLeft
									size={18}
									strokeWidth={1.5}
								/>
							</button>
							<button
								onClick={next}
								className='absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full transition-all shadow-sm'
							>
								<ChevronRight
									size={18}
									strokeWidth={1.5}
								/>
							</button>

							{/* Indicadores */}
							<div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5'>
								{images.map((_, i) => (
									<button
										key={i}
										onClick={(e) => {
											e.stopPropagation();
											setCurrentImg(
												i,
											);
										}}
										className={`w-1.5 h-1.5 rounded-full transition-all ${
											i ===
											currentImg
												? 'bg-white w-3'
												: 'bg-white/40'
										}`}
									/>
								))}
							</div>
						</>
					)}
				</div>

				{/* CONTENIDO */}
				<div className='w-full md:w-2/5 p-8 flex flex-col justify-center overflow-y-auto'>
					<span className='text-[9px] uppercase tracking-[0.4em] text-[#C4A95E] font-bold mb-4 block'>
						{product.categories?.name}
					</span>

					<h2 className='text-2xl md:text-3xl font-serif italic text-black mb-3'>
						{product.name}
					</h2>

					<p className='text-xl text-[#A07F3A] font-serif tracking-wide mb-6'>
						$
						{product.base_price?.toLocaleString(
							'es-MX',
						)}{' '}
						MXN
					</p>

					<p className='text-black/50 text-sm leading-relaxed mb-8 font-light italic'>
						{product.description ||
							'Pieza exclusiva de oro laminado con detalles vintage.'}
					</p>

					<AddToCartButton
						product={product}
						onClose={onClose}
					/>

					<button
						onClick={goToDetail}
						className='w-full mt-3 text-[9px] uppercase tracking-[0.2em] text-black/30 hover:text-black transition-colors font-bold py-2'
					>
						Ver Detalles Completos →
					</button>
				</div>
			</div>
		</div>
	);
}
