"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check } from "lucide-react";

export default function AddToCartButton({ product, onClose }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    addToCart(product);

    // Micro-interacción: 1 segundo de éxito antes de abrir el carrito
    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
      
      // Si el botón está en un modal, ejecuta onClose. Si no, lo ignora.
      if (onClose) onClose();
    }, 500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdded}
      className={`w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A07F3A] transition-all flex items-center justify-center gap-3 
        ${isAdded 
          ? "bg-[#C4A95E] text-white" // Dorado ZÁLEA para confirmación
          : "bg-black text-white hover:bg-black/90"
        }`}
    >
      {isAdded ? (
        <>
          <Check size={18} className="animate-in zoom-in duration-300" />
          ¡Añadido!
        </>
      ) : (
        <>
          <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
          Añadir al Carrito
        </>
      )}
    </button>
  );
}