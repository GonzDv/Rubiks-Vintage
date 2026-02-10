"use client";
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  // Datos de ejemplo basados en tus diseños (Mock Data)
  const stats = [
    { label: "Ingresos Totales", value: "$128,430", icon: DollarSign, trend: "+12.5%", color: "text-green-600" },
    { label: "Pedidos Activos", value: "45", icon: ShoppingBag, detail: "12 pendientes de envío", color: "text-blue-600" },
    { label: "Productos en Inventario", value: "124", icon: Package, detail: "8 con poco stock", color: "text-purple-600" },
    { label: "Clientes Totales", value: "892", icon: Users, trend: "+5.2%", color: "text-orange-600" },
  ];

  const recentOrders = [
    { id: "#ORD-7829", customer: "Evelyn St. Claire", date: "24 Oct, 2023", amount: "$4,250.00", status: "Enviado" },
    { id: "#ORD-7830", customer: "Julian Vance", date: "24 Oct, 2023", amount: "$1,850.00", status: "Procesando" },
    { id: "#ORD-7831", customer: "Isabella Ross", date: "23 Oct, 2023", amount: "$8,900.00", status: "Pendiente" },
  ];

  return (
    <div className="space-y-10">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-3xl font-serif text-black">Panel de Control</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenido de nuevo. Aquí tienes un resumen de Rubik's Vintage hoy.</p>
      </div>

      {/* Grid de Tarjetas de Estadísticas (Inspirado en image_a809be.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              {stat.trend && (
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={10} /> {stat.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-black mt-1">{stat.value}</h3>
              {stat.detail && <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1"><Clock size={10}/> {stat.detail}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Contenido Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla de Pedidos Recientes (Inspirado en image_a809be.jpg) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-serif">Pedidos Recientes</h2>
            <button className="text-xs text-blue-600 hover:underline">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
                  <th className="px-6 py-4 font-medium">ID Pedido</th>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Monto</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="text-sm hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-400">{order.id}</td>
                    <td className="px-6 py-4 text-black">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 font-bold">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter
                        ${order.status === 'Enviado' ? 'bg-blue-50 text-blue-600' : 
                          order.status === 'Procesando' ? 'bg-purple-50 text-purple-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen de Inventario (Inspirado en image_a809ba.jpg) */}
        <div className="bg-black text-white rounded-xl p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-serif italic mb-2">Estado del Inventario</h2>
            <p className="text-gray-400 text-sm">Tienes piezas que necesitan atención inmediata.</p>
          </div>
          <div className="space-y-6 my-8">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-widest text-gray-500">Sin Stock</span>
              <span className="text-3xl font-bold text-red-400">3</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-widest text-gray-500">Stock Bajo</span>
              <span className="text-3xl font-bold text-yellow-400">8</span>
            </div>
          </div>
          <button className="w-full bg-white text-black py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-200 transition">
            Gestionar Inventario
          </button>
        </div>
      </div>
    </div>
  );
}