"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle, Loader2, PackageCheck } from "lucide-react";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState("loading"); 
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) { router.push("/"); return; }

    const saveOrder = async () => {
      try {
        // Verificar sesión de Stripe desde nuestra API
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setOrderData(data);
        clearCart();
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    saveOrder();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col items-center justify-center gap-4 text-black/30">
        <Loader2 className="animate-spin" size={32} strokeWidth={1} />
        <p className="text-[10px] uppercase tracking-[0.3em]">Confirmando tu pedido...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col items-center justify-center gap-4 text-black/30">
        <p className="text-[10px] uppercase tracking-[0.3em]">Hubo un problema al confirmar tu pedido.</p>
        <p className="text-xs text-black/20">Si realizaste el pago, contáctanos para confirmar tu pedido.</p>
        <button onClick={() => router.push("/")} className="text-[10px] uppercase tracking-[0.3em] text-[#A07F3A] hover:underline mt-2">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-8">

        <div className="flex justify-center">
          <div className="bg-white rounded-full p-6 shadow-sm border border-black/5">
            <CheckCircle size={48} className="text-[#A07F3A]" strokeWidth={1} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-serif italic text-black">¡Gracias por tu pedido!</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/30">Tu selección está confirmada</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm text-left space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <PackageCheck size={14} className="text-[#A07F3A]" />
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-black">Detalles del Pedido</p>
          </div>
          {orderData?.customerName && (
            <div className="flex justify-between text-xs">
              <span className="text-black/30">Cliente</span>
              <span className="font-medium text-black">{orderData.customerName}</span>
            </div>
          )}
          {orderData?.orderId && (
            <div className="flex justify-between text-xs">
              <span className="text-black/30">Pedido</span>
              <span className="font-mono text-black/50 text-[10px]">{orderData.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
          )}
          {orderData?.total && (
            <div className="flex justify-between text-xs border-t border-black/5 pt-3 mt-3">
              <span className="text-black/30 uppercase tracking-widest text-[9px]">Total pagado</span>
              <span className="font-serif text-black">${(orderData.total / 100).toLocaleString()} MXN</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-black/30 leading-relaxed">
          Recibirás un correo de confirmación. Nos pondremos en contacto contigo pronto para coordinar el envío.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A07F3A] transition-all"
        >
          Seguir Explorando
        </button>
      </div>
    </div>
  );
}
