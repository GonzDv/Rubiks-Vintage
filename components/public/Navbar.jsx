'use client';
import Link from 'next/link';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartSidebar from './CarSidebar';
export default function Navbar() {
	const { cartCount, isCartOpen, setIsCartOpen } = useCart();
	return (
		<>
			<nav className='w-full bg-[#F5F1EB]/80 backdrop-blur-md sticky top-0 z-50 border-b border-black/5'>
				<div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
					<div className='hidden md:flex space-x-10 text-[10px] uppercase tracking-[0.4em] font-light text-black/60'>
						<Link
							href='/products'
							className='hover:text-black transition-all duration-500 font-bold'
						>
							Tienda
						</Link>
						<Link
							href='/products'
							className='hover:text-black transition-all duration-500 font-bold'
						>
							Colecciones
						</Link>
					</div>

					<div className='flex-1 flex justify-center'>
						<Link href='/'>
							<h1 className='text-2xl md:text-3xl font-serif tracking-[0.15em] text-black italic font-bold'>
								ZÁLEA
							</h1>
						</Link>
					</div>

					<div className='flex items-center space-x-6 text-black/70'>
						<button className='hover:text-black transition-colors hidden sm:block'>
							<Search size={18} strokeWidth={1} />
						</button>

						<Link
							href='/login'
							className='hover:text-black transition-colors'
						>
							<User size={18} strokeWidth={1} />
						</Link>

						<div className='flex items-center space-x-5 text-black'>
							{/* Botón del Carrito */}
							<button
								onClick={() =>
									setIsCartOpen(true)
								}
								className='relative group transition-transform active:scale-90'
							>
								<ShoppingBag
									size={20}
									strokeWidth={1.5}
									className='group-hover:text-[#A07F3A] transition-colors'
								/>
								{cartCount > 0 && (
									<span className='absolute -top-1 -right-1 bg-[#A07F3A] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-in zoom-in'>
										{cartCount}
									</span>
								)}
							</button>
						</div>

						<button className='md:hidden'>
							<Menu size={20} strokeWidth={1.5} />
						</button>
					</div>
				</div>
			</nav>
			<CartSidebar
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
			/>
		</>
	);
}
