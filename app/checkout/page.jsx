"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import {
  Loader2, ShoppingBag, User, Phone, MapPin, FileText,
  ArrowRight, Lock, ImageOff
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Redirigir si el carrito está vacío
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-black/30 space-y-4 bg-[#F5F1EB]">
        <ShoppingBag size={48} strokeWidth={0.5} />
        <p className="text-[10px] uppercase tracking-[0.3em]">Tu bolsa está vacía</p>
        <button
          onClick={() => router.push("/")}
          className="text-[10px] uppercase tracking-[0.3em] text-[#A07F3A] hover:underline mt-2"
        >
          Explorar colección
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificar sesión
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Llamar a la API route para crear sesión de Stripe
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          customerData: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Redirigir a Stripe
      window.location.href = data.url;
    } catch (err) {
      setError(err.message || "Ocurrió un error, intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif italic text-black">Finalizar Pedido</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 mt-2">ZÁLEA — Colección Vintage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* FORMULARIO */}
          <section className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 space-y-8">
              
              <div className="flex items-center gap-3 border-b border-black/5 pb-6">
                <User size={16} className="text-[#A07F3A]" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-black">Datos de Envío</h2>
              </div>

              <div className="space-y-7">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2">
                    <User size={10} /> Nombre Completo
                  </label>
                  <input
                    type="text" required placeholder="Ej. Ana García López"
                    className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2">
                    <Phone size={10} /> Teléfono
                  </label>
                  <input
                    type="tel" required placeholder="Ej. 55 1234 5678"
                    className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2">
                    <MapPin size={10} /> Dirección de Envío
                  </label>
                  <textarea
                    required rows="3"
                    placeholder="Calle, número, colonia, ciudad, estado, código postal"
                    className="w-full border border-black/5 rounded-xl p-4 focus:border-[#C4A95E] outline-none bg-[#F9F8F6] text-sm resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {/* Notas */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2">
                    <FileText size={10} /> Notas del Pedido <span className="normal-case tracking-normal text-black/20">(opcional)</span>
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Instrucciones especiales, referencias de entrega..."
                    className="w-full border border-black/5 rounded-xl p-4 focus:border-[#C4A95E] outline-none bg-[#F9F8F6] text-sm resize-none italic"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-xs text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3 hover:bg-[#A07F3A] transition-all disabled:bg-black/20"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={16} /> Procesando...</>
                ) : (
                  <><Lock size={14} /> Proceder al Pago</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-black/20">
                <Lock size={10} />
                <p className="text-[9px] uppercase tracking-widest">Pago seguro procesado por Stripe</p>
              </div>
            </form>
          </section>

          {/* RESUMEN DEL PEDIDO */}
          <aside className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
                <ShoppingBag size={15} className="text-[#A07F3A]" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-black">Tu Selección</h2>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#F5F1EB] shrink-0">
                      {item.image_url ? (
                        <Image src={item.image_url} fill className="object-cover" alt={item.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/10">
                          <ImageOff size={16} strokeWidth={0.8} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-black truncate">{item.name}</p>
                      <p className="text-[10px] text-black/30 mt-0.5">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-serif text-[#A07F3A] shrink-0">
                      ${(item.base_price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/5 mt-6 pt-4 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-black/30 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()} MXN</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-black/30 uppercase tracking-widest">
                  <span>Envío</span>
                  <span>Se calcula al pagar</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-black/5">
                  <span className="text-xs uppercase tracking-widest font-bold text-black">Total</span>
                  <span className="text-xl font-serif text-black">${cartTotal.toLocaleString()} MXN</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
