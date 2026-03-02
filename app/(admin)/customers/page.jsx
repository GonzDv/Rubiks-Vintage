"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  UserPlus, 
  Star, 
  //Mail, 
  Search, 
  Filter, 
  MoreHorizontal,
  //ArrowUpRight
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí conectarás con tu tabla de 'profiles' o 'customers'
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  const topStats = [
    { label: "Total Clientes", value: "128", icon: Users },
    { label: "Nuevos (Mes)", value: "+14", icon: UserPlus },
    { label: "Clientes VIP", value: "08", icon: Star },
  ];

  return (
    <div className="space-y-10">
      {/* HEADER DE SECCIÓN */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-serif italic text-black">Directorio de Clientes</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">Base de datos y fidelización de ZÁLEA</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            className="w-full bg-white border border-black/5 rounded-full py-3 pl-12 pr-4 text-xs outline-none focus:border-[#A07F3A] transition-all italic shadow-sm"
          />
        </div>
      </header>

      {/* RESUMEN DE AUDIENCIA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topStats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-1">{stat.label}</p>
              <p className="text-2xl font-serif italic text-black">{stat.value}</p>
            </div>
            <div className="p-3 bg-[#F9F8F6] rounded-2xl">
              <stat.icon size={20} className="text-[#A07F3A]" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* TABLA DE CLIENTES */}
      <section className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm">
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-black/60">Lista de Compradores</h3>
          <button className="text-[9px] uppercase tracking-widest font-bold text-[#A07F3A] flex items-center gap-2">
            <Filter size={12} /> Segmentar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F8F6] text-[9px] uppercase tracking-[0.2em] text-black/40">
                <th className="px-8 py-5 font-bold">Cliente</th>
                <th className="px-8 py-5 font-bold hidden lg:table-cell">Ubicación</th>
                <th className="px-8 py-5 font-bold text-center">Pedidos</th>
                <th className="px-8 py-5 font-bold">Total Gastado</th>
                <th className="px-8 py-5 font-bold text-right">Perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="group hover:bg-[#F5F1EB]/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#DBD2C8] flex items-center justify-center text-[10px] font-bold text-black/40">
                        {i === 1 ? "MC" : "RG"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-black flex items-center gap-2">
                          {i === 1 ? "Mariana Costa" : "Roberto Gómez"}
                          {i === 1 && <Star size={10} className="fill-amber-400 text-amber-400" />}
                        </p>
                        <p className="text-[9px] text-black/40 italic">cliente@ejemplo.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell text-[10px] text-black/60 italic">
                    CDMX, México
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-medium bg-[#F9F8F6] px-2 py-1 rounded-md border border-black/5">
                      0{i + 2}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-serif font-bold text-[#A07F3A]">
                      ${(2500 * i).toLocaleString()} MXN
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-black/20 hover:text-black transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}