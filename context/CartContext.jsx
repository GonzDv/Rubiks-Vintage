'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem('zalea_cart');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setCart(() => parsed);
			} catch (e) {
				console.error('Error en ZÁLEA Cart:', e);
			}
		}
		setIsLoaded(true);
	}, []);

	// 2. Persistencia automática
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('zalea_cart', JSON.stringify(cart));
		}
	}, [cart, isLoaded]);

	const addToCart = (product) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) {
				return prev.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				);
			}
			return [...prev, { ...product, quantity: 1 }];
		});
		setIsCartOpen(true);
	};

	const removeFromCart = (id) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	};

	const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
	const cartTotal = cart.reduce(
		(total, item) => total + item.base_price * item.quantity,
		0,
	);

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				cartCount,
				cartTotal,
				isCartOpen,
				setIsCartOpen,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export const useCart = () => useContext(CartContext);
