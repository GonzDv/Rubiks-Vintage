'use client';
import Image from 'next/image';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<div
				className='group cursor-pointer'
				onClick={() => setShowModal(true)}
			>
				<div className='relative aspect-3/4 bg-white overflow-hidden rounded-xl mb-4 shadow-sm'>
					<Image
						src={product.image_url}
						alt={product.name}
						fill
						className='object-cover transition-transform duration-700 group-hover:scale-110'
					/>
					{/* Badge de "Vista Rápida" al hacer hover */}
					<div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6'>
						<span className='bg-white/90 px-4 py-2 text-[8px] uppercase tracking-[0.2em] font-bold backdrop-blur-sm'>
							Vista Rápida
						</span>
					</div>
				</div>
				<h3 className='text-[11px] uppercase tracking-widest text-black/80 font-medium mb-1 truncate'>
					{product.name}
				</h3>
				<p className='text-sm font-serif italic text-[#A07F3A]'>
					${product.base_price?.toLocaleString()} MXN
				</p>
			</div>

			{showModal && (
				<QuickViewModal
					product={product}
					onClose={(e) => {
						e.stopPropagation(); // Evita que el clic cierre y abra al mismo tiempo
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
}
