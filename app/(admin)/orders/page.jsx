"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  Filter,
  MoreVertical
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulamos la carga de datos para el diseño inicial
  useEffect(() => {
    const fetchOrders = async () => {
      // Aquí irá tu consulta real a la tabla 'orders'
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const stats = [
    { label: "Pendientes", value: "12", icon: Clock, color: "text-amber-500" },
    { label: "En Camino", value: "05", icon: Truck, color: "text-blue-500" },
    { label: "Entregados", value: "48", icon: CheckCircle2, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-10">
      {/* HEADER EDITORIAL */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-serif italic text-black">Gestión de Pedidos</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">Control de ventas y logística de ZÁLEA</p>
        </div>
        
        {/* BUSCADOR RÁPIDO */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
          <input 
            type="text" 
            placeholder="Buscar pedido o cliente..." 
            className="w-full bg-white border border-black/5 rounded-full py-3 pl-12 pr-4 text-xs outline-none focus:border-[#A07F3A] transition-all italic shadow-sm"
          />
        </div>
      </header>

      {/* STATS RÁPIDAS: Mobile Scrollable */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-[140px] flex-1 bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <stat.icon className={`${stat.color} mb-4`} size={20} strokeWidth={1.5} />
            <p className="text-2xl font-serif italic text-black">{stat.value}</p>
            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* TABLA DE PEDIDOS: Responsiva */}
      <section className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm">
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-black/60">Últimos Movimientos</h3>
          <button className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-[#A07F3A] hover:bg-[#F5F1EB] px-3 py-2 rounded-lg transition-all">
            <Filter size={12} /> Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F8F6] text-[9px] uppercase tracking-[0.2em] text-black/40">
                <th className="px-8 py-5 font-bold">Pedido</th>
                <th className="px-8 py-5 font-bold">Cliente</th>
                <th className="px-8 py-5 font-bold hidden md:table-cell">Fecha</th>
                <th className="px-8 py-5 font-bold">Total</th>
                <th className="px-8 py-5 font-bold">Estado</th>
                <th className="px-8 py-5 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {/* Ejemplo de fila */}
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="group hover:bg-[#F5F1EB]/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-xs font-serif italic font-bold">#ZA-202{i}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-black">Ana García</p>
                    <p className="text-[9px] text-black/40 truncate max-w-[100px]">ana.g@email.com</p>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell text-[10px] text-black/60">
                    24 Feb, 2026
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-serif text-[#A07F3A]">$1,250 MXN</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[8px] uppercase tracking-widest font-bold rounded-full">
                      Pendiente
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white rounded-full transition-shadow hover:shadow-md text-black/20 hover:text-black">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER DE TABLA */}
        <footer className="p-6 bg-[#F9F8F6] flex justify-center">
          <button className="text-[9px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors">
            Ver todo el historial
          </button>
        </footer>
      </section>
    </div>
  );
}