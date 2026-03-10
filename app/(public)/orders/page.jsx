"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Package,
  ChevronRight,
  Loader2,
  X,
  Check,
  ImageOff,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATUS_STYLES = {
  pagado: { label: "Pagado", classes: "bg-emerald-50 text-emerald-600" },
  pendiente: { label: "Pendiente", classes: "bg-amber-50 text-amber-600" },
  enviado: { label: "Enviado", classes: "bg-blue-50 text-blue-600" },
  entregado: { label: "Entregado", classes: "bg-black/5 text-black/50" },
  cancelado: { label: "Cancelado", classes: "bg-red-50 text-red-400" },
};

export default function OrdersPage() {
  const supabase = createClient();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          "*, item_order(id, quantity, unit_price, product_id, products:product_id(name, image_url))",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error.message);
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F1EB] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold mb-2">
            Mi Cuenta
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-4xl font-serif italic text-black">
              Mis Pedidos
            </h1>
            <Link
              href="/account"
              className="text-[9px] uppercase tracking-widest text-black/30 hover:text-black transition-colors font-bold"
            >
              Ver perfil
            </Link>
          </div>
        </header>

        {/* Contenido */}
        {loading ? (
          <div className="flex justify-center py-20 text-black/20">
            <Loader2 className="animate-spin" size={28} strokeWidth={1} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <div className="w-16 h-16 rounded-full bg-white border border-black/5 flex items-center justify-center mx-auto shadow-sm">
              <Package size={24} strokeWidth={0.8} className="text-black/20" />
            </div>
            <div>
              <p className="text-sm font-serif italic text-black/40">
                Aún no tienes pedidos
              </p>
              <p className="text-[10px] text-black/20 uppercase tracking-widest mt-1">
                Tu historial aparecerá aquí
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#A07F3A] hover:text-black transition-colors"
            >
              Explorar colección
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const status =
                STATUS_STYLES[order.status] || STATUS_STYLES.pendiente;
              const isOpen = expanded === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
                >
                  {/* Fila principal */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#F5F1EB]/50 transition-colors"
                  >
                    <div className="flex items-center gap-5 text-left">
                      <div className="w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center shrink-0">
                        <ShoppingBag
                          size={16}
                          strokeWidth={1.2}
                          className="text-[#A07F3A]"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-black/30">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm font-serif text-[#A07F3A] mt-0.5">
                          $
                          {parseFloat(order.total_amount).toLocaleString(
                            "es-MX",
                          )}{" "}
                          MXN
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span
                          className={`px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${status.classes}`}
                        >
                          {status.label}
                        </span>
                        <p className="text-[9px] text-black/25 mt-1.5">
                          {new Date(order.created_at).toLocaleDateString(
                            "es-MX",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`text-black/20 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Status en mobile */}
                  <div className="sm:hidden px-6 pb-3 flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${status.classes}`}
                    >
                      {status.label}
                    </span>
                    <p className="text-[9px] text-black/25">
                      {new Date(order.created_at).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Detalle expandible */}
                  {isOpen && (
                    <div className="border-t border-black/5 bg-[#F9F8F6] px-6 py-5 space-y-5 animate-in fade-in duration-200">
                      {/* Productos */}
                      {order.item_order?.length > 0 && (
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-black/30 font-bold mb-3">
                            Productos
                          </p>
                          <div className="space-y-2">
                            {order.item_order?.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3"
                              >
                                {/* Foto */}
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F5F1EB] shrink-0">
                                  {item.products?.image_url ? (
                                    <Image
                                      src={item.products.image_url}
                                      fill
                                      className="object-cover"
                                      alt={item.products?.name || "Producto"}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-black/10">
                                      <ImageOff size={12} strokeWidth={0.8} />
                                    </div>
                                  )}
                                </div>

                                {/* Nombre y variante */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-black/70 truncate">
                                    {item.products?.name || "Producto"} ×{" "}
                                    {item.quantity}
                                  </p>
                                  {item.product_variants?.size && (
                                    <p className="text-[9px] text-black/30 mt-0.5">
                                      {item.product_variants.material} ·{" "}
                                      {item.product_variants.size}
                                    </p>
                                  )}
                                </div>

                                {/* Precio */}
                                <p className="text-xs font-serif text-[#A07F3A] shrink-0">
                                  $
                                  {(
                                    item.unit_price * item.quantity
                                  ).toLocaleString("es-MX")}{" "}
                                  MXN
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dirección */}
                      {order.shipping_address && (
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-black/30 font-bold mb-1">
                            Dirección de envío
                          </p>
                          <p className="text-xs text-black/50 leading-relaxed">
                            {order.shipping_address}
                          </p>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex justify-between items-center pt-3 border-t border-black/5">
                        <p className="text-[9px] uppercase tracking-widest text-black/30 font-bold">
                          Total pagado
                        </p>
                        <p className="text-sm font-serif text-black">
                          $
                          {parseFloat(order.total_amount).toLocaleString(
                            "es-MX",
                          )}{" "}
                          MXN
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
