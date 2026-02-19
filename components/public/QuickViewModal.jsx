'use client';
import Image from 'next/image';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function QuickViewModal({ product, onClose }) {
	const { addToCart } = useCart();
	const [currentImg, setCurrentImg] = useState(0);

	if (!product) return null;

	const images = product.images || [product.image_url];

	return (
		<div className='fixed inset-0 z-110 flex items-center justify-center p-4'>
			<div
				className='absolute inset-0 bg-black/60 backdrop-blur-md'
				onClick={onClose}
			/>

			<div className='relative bg-[#F5F1EB] w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-all'
				>
					<X size={20} strokeWidth={1} />
				</button>

				<div className=' md:w-3/5 relative bg-whit aspect-ratio-3/4 aspect-square md:aspect-auto'>
					<Image
						src={images[currentImg]}
						alt={product.name}
						fill
						className='object-fill object-center'
					/>
					{images.length > 1 && (
						<div className='absolute inset-0 flex items-center justify-between px-4'>
							<button className='p-2 bg-white/20 hover:bg-white rounded-full transition-all'>
								<ChevronLeft size={20} />
							</button>
							<button className='p-2 bg-white/20 hover:bg-white rounded-full transition-all'>
								<ChevronRight size={20} />
							</button>
						</div>
					)}
				</div>
				<div className='w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-[#F5F1EB]'>
					<span className='text-[9px] uppercase tracking-[0.4em] text-[#C4A95E] font-bold mb-4 block'>
						{product.categories?.name}
					</span>

					<h2 className='text-3xl md:text-4xl font-serif italic text-black mb-4'>
						{product.name}
					</h2>

					<p className='text-xl text-[#A07F3A] font-light tracking-widest mb-8'>
						${product.base_price?.toLocaleString()} MXN
					</p>

					<p className='text-black/60 text-sm leading-relaxed mb-10 font-light italic'>
						{product.description ||
							'Pieza exclusiva de oro laminado con detalles vintage.'}
					</p>

					<button
						onClick={() => {
							addToCart(product);
							onClose();
						}}
						className='w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A07F3A] transition-all flex items-center justify-center gap-3'
					>
						<ShoppingBag size={16} />
						Añadir a la Bolsa
					</button>

					<button
						onClick={() =>
							(window.location.href = `/products/${product.id}`)
						}
						className='w-full mt-4 text-[9px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors font-bold'
					>
						Ver Detalles Completos
					</button>
				</div>
			</div>
		</div>
	);
}
