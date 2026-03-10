'use client';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar({ isOpen, onClose }) {
	const {
		cart,
		removeFromCart,
		cartTotal,
		updateQuantity,
		clearCart,
		cartCount,
	} = useCart();

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-100 flex justify-end'>
			<div
				className='absolute inset-0 bg-black/40 backdrop-blur-sm'
				onClick={onClose}
			/>

			<div className='relative w-full max-w-md bg-[#F5F1EB] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500'>
				{/* HEADER */}
				<header className='px-8 py-6 border-b border-black/5 flex justify-between items-center bg-[#DBD2C8]'>
					<div>
						<h2 className='text-xl font-serif italic text-black'>
							Tu Selección
						</h2>
						{cartCount > 0 && (
							<p className='text-[9px] uppercase tracking-[0.3em] text-black/40 mt-0.5'>
								{cartCount}{' '}
								{cartCount === 1
									? 'pieza'
									: 'piezas'}
							</p>
						)}
					</div>
					<button
						onClick={onClose}
						className='hover:rotate-90 transition-transform duration-300'
					>
						<X size={22} strokeWidth={1} />
					</button>
				</header>

				{/* ITEMS */}
				<div className='flex-1 overflow-y-auto p-6 space-y-4'>
					{cart.length === 0 ? (
						<div className='h-full flex flex-col items-center justify-center text-black/30 space-y-4'>
							<ShoppingBag
								size={44}
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
								className='flex gap-4 items-center bg-white rounded-xl p-3 shadow-sm'
							>
								{/* Imagen */}
								<div className='relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F5F1EB]'>
									<Image
										src={item.image_url}
										alt={item.name}
										fill
										className='object-cover'
									/>
								</div>

								{/* Info */}
								<div className='flex-1 min-w-0'>
									<h3 className='text-[11px] uppercase tracking-widest font-bold text-black truncate'>
										{item.name}
									</h3>
									<p className='text-sm font-serif text-[#A07F3A] mt-1'>
										$
										{(
											item.base_price *
											item.quantity
										).toLocaleString()}{' '}
										MXN
									</p>
									{item.quantity > 1 && (
										<p className='text-[9px] text-black/30 mt-0.5'>
											$
											{item.base_price.toLocaleString()}{' '}
											c/u
										</p>
									)}
								</div>

								{/* Controles de cantidad */}
								<div className='flex items-center gap-0 border border-black/10 rounded-full overflow-hidden shrink-0'>
									<button
										onClick={() =>
											updateQuantity(
												item.id,
												item.quantity -
													1,
											)
										}
										className='w-8 h-8 flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-colors'
									>
										<Minus
											size={12}
											strokeWidth={
												2
											}
										/>
									</button>
									<span className='w-7 text-center text-xs font-bold text-black select-none'>
										{item.quantity}
									</span>
									<button
										onClick={() =>
											updateQuantity(
												item.id,
												item.quantity +
													1,
											)
										}
										className='w-8 h-8 flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-colors'
									>
										<Plus
											size={12}
											strokeWidth={
												2
											}
										/>
									</button>
								</div>

								{/* Eliminar */}
								<button
									onClick={() =>
										removeFromCart(
											item.id,
										)
									}
									className='text-black/15 hover:text-red-400 transition-colors ml-1 shrink-0'
								>
									<Trash2
										size={15}
										strokeWidth={1.5}
									/>
								</button>
							</div>
						))
					)}
				</div>

				{/* FOOTER */}
				<footer className='p-6 border-t border-black/5 bg-white space-y-5'>
					<div className='flex justify-between items-end'>
						<span className='text-[10px] uppercase tracking-[0.3em] text-black/40'>
							Subtotal
						</span>
						<span className='text-xl font-serif text-black'>
							${cartTotal.toLocaleString()} MXN
						</span>
					</div>

					{cart.length > 0 && (
						<button
							onClick={clearCart}
							className='w-full text-[9px] uppercase tracking-[0.3em] text-black/25 hover:text-black/50 transition-colors py-1'
						>
							Vaciar bolsa
						</button>
					)}

					<Link
						href='/checkout'
						onClick={onClose}
						className='w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A07F3A] transition-all flex items-center justify-center gap-3'
					>
						Finalizar Compra
					</Link>
				</footer>
			</div>
		</div>
	);
}
