'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
	ShoppingBag,
	Users,
	DollarSign,
	Package,
	TrendingUp,
	Clock,
	Loader2,
	ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLES = {
	pagado: 'bg-emerald-50 text-emerald-600',
	pendiente: 'bg-amber-50 text-amber-600',
	enviado: 'bg-blue-50 text-blue-600',
	entregado: 'bg-black/5 text-black/50',
	cancelado: 'bg-red-50 text-red-400',
};

export default function DashboardPage() {
	const supabase = createClient();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [stats, setStats] = useState({
		totalRevenue: 0,
		activeOrders: 0,
		pendingOrders: 0,
		totalProducts: 0,
		outOfStock: 0,
		lowStock: 0,
		totalCustomers: 0,
	});
	const [recentOrders, setRecentOrders] = useState([]);

	useEffect(() => {
		const fetchAll = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);

			const [ordersRes, productsRes, customersRes] =
				await Promise.all([
					supabase
						.from('orders')
						.select('*')
						.order('created_at', { ascending: false }),
					supabase.from('products').select('id'),
					supabase
						.from('profiles')
						.select('id')
						.eq('is_admin', false),
				]);

			const orders = ordersRes.data || [];
			const products = productsRes.data || [];
			const customers = customersRes.data || [];

			const totalRevenue = orders
				.filter(
					(o) =>
						o.status === 'pagado' ||
						o.status === 'entregado',
				)
				.reduce(
					(sum, o) => sum + parseFloat(o.total_amount || 0),
					0,
				);

			const activeOrders = orders.filter((o) =>
				['pagado', 'pendiente', 'enviado'].includes(o.status),
			).length;

			const pendingOrders = orders.filter(
				(o) => o.status === 'pendiente',
			).length;

			setStats({
				totalRevenue,
				activeOrders,
				pendingOrders,
				totalProducts: products.length,
				outOfStock: 0,
				lowStock: 0,
				totalCustomers: customers.length,
			});

			setRecentOrders(orders.slice(0, 5));
			setLoading(false);
		};

		fetchAll();
	}, []);

	const statCards = [
		{
			label: 'Ingresos Totales',
			value: `$${stats.totalRevenue.toLocaleString('es-MX')}`,
			icon: DollarSign,
			detail: 'Pedidos pagados y entregados',
			color: 'text-emerald-600',
			bg: 'bg-emerald-50',
		},
		{
			label: 'Pedidos Activos',
			value: String(stats.activeOrders).padStart(2, '0'),
			icon: ShoppingBag,
			detail: `${stats.pendingOrders} pendientes de envío`,
			color: 'text-blue-600',
			bg: 'bg-blue-50',
		},
		{
			label: 'Productos',
			value: String(stats.totalProducts).padStart(2, '0'),
			icon: Package,
			detail: 'En la colección',
			color: 'text-[#A07F3A]',
			bg: 'bg-[#F5F1EB]',
		},
		{
			label: 'Clientes',
			value: String(stats.totalCustomers).padStart(2, '0'),
			icon: Users,
			detail: 'Registrados',
			color: 'text-purple-600',
			bg: 'bg-purple-50',
		},
	];

	const firstName = user?.user_metadata?.first_name || 'Admin';

	if (loading)
		return (
			<div className='h-96 flex items-center justify-center text-black/20'>
				<Loader2
					className='animate-spin'
					size={28}
					strokeWidth={1}
				/>
			</div>
		);

	return (
		<div className='space-y-8'>
			{/* HEADER */}
			<header>
				<h1 className='text-3xl md:text-4xl font-serif italic text-black'>
					Bienvenida, {firstName}.
				</h1>
				<p className='text-[10px] uppercase tracking-[0.3em] text-black/30 font-bold mt-1'>
					Resumen de ZÁLEA —{' '}
					{new Date().toLocaleDateString('es-MX', {
						weekday: 'long',
						day: 'numeric',
						month: 'long',
					})}
				</p>
			</header>

			{/* STATS */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{statCards.map((stat) => (
					<div
						key={stat.label}
						className='bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow'
					>
						<div className='flex justify-between items-start mb-5'>
							<div
								className={`p-2 rounded-xl ${stat.bg}`}
							>
								<stat.icon
									size={18}
									className={stat.color}
									strokeWidth={1.5}
								/>
							</div>
						</div>
						<p className='text-[9px] uppercase tracking-widest text-black/30 font-bold'>
							{stat.label}
						</p>
						<h3 className='text-2xl font-serif italic text-black mt-1'>
							{stat.value}
						</h3>
						{stat.detail && (
							<p className='text-[9px] text-black/25 mt-2 flex items-center gap-1'>
								<Clock size={9} /> {stat.detail}
							</p>
						)}
					</div>
				))}
			</div>

			{/* CONTENIDO INFERIOR */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* PEDIDOS RECIENTES */}
				<div className='lg:col-span-2 bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden'>
					<div className='p-6 border-b border-black/5 flex justify-between items-center'>
						<h2 className='text-sm font-serif italic text-black'>
							Pedidos Recientes
						</h2>
						<Link
							href='/admin/orders'
							className='text-[9px] uppercase tracking-widest text-[#A07F3A] hover:text-black transition-colors flex items-center gap-1 font-bold'
						>
							Ver todos <ArrowRight size={10} />
						</Link>
					</div>

					{recentOrders.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-16 text-black/15'>
							<ShoppingBag
								size={32}
								strokeWidth={0.5}
								className='mb-3'
							/>
							<p className='text-[10px] uppercase tracking-widest'>
								Sin pedidos aún
							</p>
						</div>
					) : (
						<div className='overflow-x-auto'>
							<table className='w-full text-left'>
								<thead>
									<tr className='text-[9px] uppercase tracking-widest text-black/30 bg-[#F9F8F6]'>
										<th className='px-6 py-4 font-bold'>
											Pedido
										</th>
										<th className='px-6 py-4 font-bold'>
											Cliente
										</th>
										<th className='px-6 py-4 font-bold hidden md:table-cell'>
											Total
										</th>
										<th className='px-6 py-4 font-bold'>
											Estado
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-black/5'>
									{recentOrders.map(
										(order) => (
											<tr
												key={
													order.id
												}
												className='hover:bg-[#F5F1EB]/30 transition-colors'
											>
												<td className='px-6 py-4'>
													<span className='text-[10px] font-mono text-black/40'>
														#
														{order.id
															.slice(
																0,
																8,
															)
															.toUpperCase()}
													</span>
												</td>
												<td className='px-6 py-4'>
													<p className='text-xs font-bold text-black truncate max-w-[120px]'>
														{order.customer_name ||
															'—'}
													</p>
													<p className='text-[9px] text-black/25 truncate max-w-[120px]'>
														{
															order.customer_email
														}
													</p>
												</td>
												<td className='px-6 py-4 hidden md:table-cell'>
													<span className='text-xs font-serif text-[#A07F3A]'>
														$
														{parseFloat(
															order.total_amount,
														).toLocaleString(
															'es-MX',
														)}{' '}
														MXN
													</span>
												</td>
												<td className='px-6 py-4'>
													<span
														className={`text-[8px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${
															STATUS_STYLES[
																order
																	.status
															] ||
															STATUS_STYLES.pendiente
														}`}
													>
														{
															order.status
														}
													</span>
												</td>
											</tr>
										),
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{/* ESTADO DEL INVENTARIO */}
				<div className='bg-[#1A1A1A] text-white rounded-3xl p-8 flex flex-col justify-between'>
					<div>
						<h2 className='text-xl font-serif italic mb-2'>
							Inventario
						</h2>
						<p className='text-white/30 text-[10px] uppercase tracking-widest'>
							Estado actual de la colección
						</p>
					</div>

					<div className='space-y-5 my-8'>
						<div className='flex justify-between items-center border-b border-white/5 pb-4'>
							<span className='text-[10px] uppercase tracking-widest text-white/30'>
								Total piezas
							</span>
							<span className='text-3xl font-serif italic text-white'>
								{stats.totalProducts}
							</span>
						</div>
						<div className='flex justify-between items-center border-b border-white/5 pb-4'>
							<span className='text-[10px] uppercase tracking-widest text-white/30'>
								Pedidos activos
							</span>
							<span className='text-3xl font-serif italic text-[#C4A95E]'>
								{stats.activeOrders}
							</span>
						</div>
						<div className='flex justify-between items-center'>
							<span className='text-[10px] uppercase tracking-widest text-white/30'>
								Clientes
							</span>
							<span className='text-3xl font-serif italic text-white'>
								{stats.totalCustomers}
							</span>
						</div>
					</div>

					<Link
						href='/admin/inventory'
						className='w-full bg-white text-black py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#F5F1EB] transition-colors text-center block'
					>
						Gestionar Inventario
					</Link>
				</div>
			</div>
		</div>
	);
}
