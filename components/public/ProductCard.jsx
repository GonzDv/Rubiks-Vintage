'use client';
import Image from 'next/image';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';
import { ImageOff } from 'lucide-react';

export default function ProductCard({ product }) {
	const [showModal, setShowModal] = useState(false);
	const [imgError, setImgError] = useState(false);

	return (
		<>
			<div
				className='group cursor-pointer'
				onClick={() => setShowModal(true)}
			>
				{/* IMAGEN */}
				<div className='relative aspect-[3/4] bg-[#F5F1EB] overflow-hidden rounded-2xl mb-4 shadow-sm border border-black/5'>
					{imgError || !product.image_url ? (
						// Fallback si la imagen falla
						<div className='w-full h-full flex items-center justify-center text-black/10'>
							<ImageOff
								size={32}
								strokeWidth={0.8}
							/>
						</div>
					) : (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
							className='object-cover transition-transform duration-700 group-hover:scale-105'
							onError={() => setImgError(true)}
						/>
					)}

					{/* Overlay hover */}
					<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-5'>
						<span
							className='
              bg-white text-black px-5 py-2 text-[8px] uppercase tracking-[0.3em] font-bold
              shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-300
            '
						>
							Vista Rápida
						</span>
					</div>

					{/* Badge categoría */}
					{product.categories?.name && (
						<div className='absolute top-3 left-3'>
							<span className='bg-white/80 backdrop-blur-sm text-black/50 px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full border border-black/5'>
								{product.categories.name}
							</span>
						</div>
					)}
				</div>

				{/* INFO */}
				<div className='px-1 space-y-1'>
					<h3 className='text-[11px] uppercase tracking-widest text-black font-bold truncate'>
						{product.name}
					</h3>
					<p className='text-sm font-serif italic text-[#A07F3A]'>
						$
						{product.base_price?.toLocaleString(
							'es-MX',
						)}{' '}
						MXN
					</p>
				</div>
			</div>

			{showModal && (
				<QuickViewModal
					product={product}
					onClose={(e) => {
						if (e?.stopPropagation) e.stopPropagation();
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
}
