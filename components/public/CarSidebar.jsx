'use client';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function CartSidebar({ isOpen, onClose }) {
	const { cart, removeFromCart, cartTotal } = useCart();

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-[100] flex justify-end'>
			{/* Overlay oscuro suave */}
			<div
				className='absolute inset-0 bg-black/40 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Contenedor del Carrito */}
			<div className='relative w-full max-w-md bg-[#F5F1EB] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500'>
				<header className='p-8 border-b border-black/5 flex justify-between items-center bg-[#DBD2C8]'>
					<h2 className='text-xl font-serif italic text-black'>
						Tu Selección
					</h2>
					<button
						onClick={onClose}
						className='hover:rotate-90 transition-transform duration-300'
					>
						<X size={24} strokeWidth={1} />
					</button>
				</header>

				<div className='flex-1 overflow-y-auto p-8 space-y-8'>
					{cart.length === 0 ? (
						<div className='h-full flex flex-col items-center justify-center text-black/40 space-y-4'>
							<ShoppingBag
								size={48}
								strokeWidth={0.5}
							/>
							<p className='text-[10px] uppercase tracking-[0.3em]'>
								Tu bolsa está vacía
							</p>
						</div>
					) : (
						cart.map((item) => (
							<div
								key={item.id}
								className='flex gap-4 items-center group'
							>
								<div className='relative w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm'>
									<Image
										src={item.image_url}
										alt={item.name}
										fill
										className='object-cover'
									/>
								</div>
								<div className='flex-1 space-y-1'>
									<h3 className='text-xs uppercase tracking-widest font-bold text-black'>
										{item.name}
									</h3>
									<p className='text-[10px] text-black/50'>
										{item.quantity}{' '}
										unidad(es)
									</p>
									<p className='text-sm font-serif text-[#A07F3A]'>
										$
										{(
											item.base_price *
											item.quantity
										).toLocaleString()}{' '}
										MXN
									</p>
								</div>
								<button
									onClick={() =>
										removeFromCart(
											item.id,
										)
									}
									className='text-black/20 hover:text-red-400 transition-colors'
								>
									<Trash2
										size={16}
										strokeWidth={1.5}
									/>
								</button>
							</div>
						))
					)}
				</div>

				<footer className='p-8 border-t border-black/5 bg-white space-y-6'>
					<div className='flex justify-between items-end'>
						<span className='text-[10px] uppercase tracking-[0.3em] text-black/40'>
							Subtotal
						</span>
						<span className='text-xl font-serif text-black'>
							${cartTotal.toLocaleString()} MXN
						</span>
					</div>
					<button className='w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A07F3A] transition-all'>
						Finalizar Compra
					</button>
				</footer>
			</div>
		</div>
	);
}
