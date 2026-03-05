'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
	ShoppingBag,
	Clock,
	Truck,
	CheckCircle2,
	ChevronRight,
	Search,
	Loader2,
	X,
} from 'lucide-react';

const STATUS_STYLES = {
	pagado: { label: 'Pagado', classes: 'bg-emerald-50 text-emerald-600' },
	pendiente: { label: 'Pendiente', classes: 'bg-amber-50 text-amber-600' },
	enviado: { label: 'Enviado', classes: 'bg-blue-50 text-blue-600' },
	entregado: { label: 'Entregado', classes: 'bg-black/5 text-black/50' },
	cancelado: { label: 'Cancelado', classes: 'bg-red-50 text-red-400' },
};

export default function OrdersPage() {
	const supabase = createClient();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [updatingStatus, setUpdatingStatus] = useState(false);

	const fetchOrders = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from('orders')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) console.error('Error:', error.message);
		setOrders(data || []);
		setLoading(false);
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleStatusChange = async (orderId, newStatus) => {
		setUpdatingStatus(true);
		const { error } = await supabase
			.from('orders')
			.update({ status: newStatus })
			.eq('id', orderId);

		if (!error) {
			await fetchOrders();
			if (selectedOrder?.id === orderId) {
				setSelectedOrder((prev) => ({
					...prev,
					status: newStatus,
				}));
			}
		}
		setUpdatingStatus(false);
	};

	const filtered = orders.filter(
		(o) =>
			o.customer_name
				?.toLowerCase()
				.includes(search.toLowerCase()) ||
			o.customer_email
				?.toLowerCase()
				.includes(search.toLowerCase()) ||
			o.id
				?.slice(0, 8)
				.toLowerCase()
				.includes(search.toLowerCase()),
	);

	const stats = [
		{
			label: 'Pendientes',
			value: orders.filter((o) => o.status === 'pendiente').length,
			icon: Clock,
			color: 'text-amber-500',
		},
		{
			label: 'Enviados',
			value: orders.filter((o) => o.status === 'enviado').length,
			icon: Truck,
			color: 'text-blue-500',
		},
		{
			label: 'Entregados',
			value: orders.filter((o) => o.status === 'entregado').length,
			icon: CheckCircle2,
			color: 'text-emerald-500',
		},
		{
			label: 'Total',
			value: orders.length,
			icon: ShoppingBag,
			color: 'text-black/40',
		},
	];

	return (
		<div className='space-y-8'>
			{/* HEADER */}
			<header className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
				<div className='space-y-1'>
					<h1 className='text-3xl md:text-4xl font-serif italic text-black'>
						Gestión de Pedidos
					</h1>
					<p className='text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold'>
						Control de ventas y logística de ZÁLEA
					</p>
				</div>
				<div className='relative w-full md:w-72'>
					<Search
						className='absolute left-4 top-1/2 -translate-y-1/2 text-black/20'
						size={14}
					/>
					<input
						type='text'
						placeholder='Buscar pedido o cliente...'
						className='w-full bg-white border border-black/5 rounded-full py-3 pl-10 pr-4 text-xs outline-none focus:border-[#A07F3A] transition-all shadow-sm'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</header>

			{/* STATS */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				{stats.map((stat) => (
					<div
						key={stat.label}
						className='bg-white p-5 rounded-2xl border border-black/5 shadow-sm'
					>
						<stat.icon
							className={`${stat.color} mb-3`}
							size={18}
							strokeWidth={1.5}
						/>
						<p className='text-2xl font-serif italic text-black'>
							{loading
								? '—'
								: String(stat.value).padStart(
										2,
										'0',
									)}
						</p>
						<p className='text-[9px] uppercase tracking-widest text-black/40 font-bold mt-0.5'>
							{stat.label}
						</p>
					</div>
				))}
			</div>

			{/* TABLA */}
			<section className='bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm'>
				<div className='p-6 border-b border-black/5'>
					<h3 className='text-[10px] uppercase tracking-widest font-bold text-black/50'>
						Últimos Movimientos
					</h3>
				</div>

				<div className='overflow-x-auto'>
					{loading ? (
						<div className='flex items-center justify-center py-20 text-black/20'>
							<Loader2
								className='animate-spin'
								size={28}
								strokeWidth={1}
							/>
						</div>
					) : filtered.length === 0 ? (
						<div className='text-center py-20 text-black/20'>
							<ShoppingBag
								size={36}
								strokeWidth={0.5}
								className='mx-auto mb-3'
							/>
							<p className='text-[10px] uppercase tracking-widest'>
								{search
									? 'Sin resultados'
									: 'No hay pedidos aún'}
							</p>
						</div>
					) : (
						<table className='w-full text-left'>
							<thead>
								<tr className='bg-[#F9F8F6] text-[9px] uppercase tracking-[0.2em] text-black/40'>
									<th className='px-6 py-4 font-bold'>
										Pedido
									</th>
									<th className='px-6 py-4 font-bold'>
										Cliente
									</th>
									<th className='px-6 py-4 font-bold hidden md:table-cell'>
										Fecha
									</th>
									<th className='px-6 py-4 font-bold'>
										Total
									</th>
									<th className='px-6 py-4 font-bold'>
										Estado
									</th>
									<th className='px-6 py-4 font-bold text-right'>
										Detalle
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-black/5'>
								{filtered.map((order) => {
									const status =
										STATUS_STYLES[
											order.status
										] ||
										STATUS_STYLES.pendiente;
									return (
										<tr
											key={order.id}
											className='hover:bg-[#F5F1EB]/30 transition-colors'
										>
											<td className='px-6 py-5'>
												<span className='text-xs font-mono text-black/50'>
													#
													{order.id
														.slice(
															0,
															8,
														)
														.toUpperCase()}
												</span>
											</td>
											<td className='px-6 py-5'>
												<p className='text-xs font-bold text-black'>
													{order.customer_name ||
														'—'}
												</p>
												<p className='text-[9px] text-black/30 truncate max-w-[140px]'>
													{
														order.customer_email
													}
												</p>
											</td>
											<td className='px-6 py-5 hidden md:table-cell text-[10px] text-black/40'>
												{new Date(
													order.created_at,
												).toLocaleDateString(
													'es-MX',
													{
														day: 'numeric',
														month: 'short',
														year: 'numeric',
													},
												)}
											</td>
											<td className='px-6 py-5'>
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
											<td className='px-6 py-5'>
												<span
													className={`px-3 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${status.classes}`}
												>
													{
														status.label
													}
												</span>
											</td>
											<td className='px-6 py-5 text-right'>
												<button
													onClick={() =>
														setSelectedOrder(
															order,
														)
													}
													className='p-2 hover:bg-white rounded-full transition-all hover:shadow-md text-black/20 hover:text-black'
												>
													<ChevronRight
														size={
															15
														}
													/>
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>

				<footer className='p-5 bg-[#F9F8F6] text-center'>
					<p className='text-[9px] uppercase tracking-widest text-black/25'>
						{filtered.length}{' '}
						{filtered.length === 1
							? 'pedido'
							: 'pedidos'}{' '}
						encontrados
					</p>
				</footer>
			</section>

			{/* MODAL DETALLE DE PEDIDO */}
			{selectedOrder && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
					<div
						className='absolute inset-0 bg-black/50 backdrop-blur-sm'
						onClick={() => setSelectedOrder(null)}
					/>
					<div className='relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 overflow-hidden'>
						{/* Header modal */}
						<div className='px-8 py-6 border-b border-black/5 flex items-center justify-between'>
							<div>
								<h2 className='text-lg font-serif italic'>
									Pedido
								</h2>
								<p className='text-[9px] font-mono text-black/30 mt-0.5'>
									#
									{selectedOrder.id
										.slice(0, 8)
										.toUpperCase()}
								</p>
							</div>
							<button
								onClick={() =>
									setSelectedOrder(null)
								}
								className='hover:rotate-90 transition-transform duration-300 text-black/20 hover:text-black'
							>
								<X
									size={20}
									strokeWidth={1.5}
								/>
							</button>
						</div>

						{/* Contenido */}
						<div className='p-8 space-y-5'>
							<div className='grid grid-cols-2 gap-4 text-xs'>
								<div>
									<p className='text-[9px] uppercase tracking-widest text-black/30 mb-1'>
										Cliente
									</p>
									<p className='font-bold'>
										{selectedOrder.customer_name ||
											'—'}
									</p>
									<p className='text-black/40 text-[10px]'>
										{
											selectedOrder.customer_email
										}
									</p>
								</div>
								<div>
									<p className='text-[9px] uppercase tracking-widest text-black/30 mb-1'>
										Total
									</p>
									<p className='font-serif text-[#A07F3A] text-base'>
										$
										{parseFloat(
											selectedOrder.total_amount,
										).toLocaleString(
											'es-MX',
										)}{' '}
										MXN
									</p>
								</div>
								{selectedOrder.phone && (
									<div>
										<p className='text-[9px] uppercase tracking-widest text-black/30 mb-1'>
											Teléfono
										</p>
										<p className='font-medium'>
											{
												selectedOrder.phone
											}
										</p>
									</div>
								)}
								<div>
									<p className='text-[9px] uppercase tracking-widest text-black/30 mb-1'>
										Fecha
									</p>
									<p className='font-medium'>
										{new Date(
											selectedOrder.created_at,
										).toLocaleDateString(
											'es-MX',
											{
												day: 'numeric',
												month: 'long',
												year: 'numeric',
											},
										)}
									</p>
								</div>
							</div>

							{selectedOrder.shipping_address && (
								<div>
									<p className='text-[9px] uppercase tracking-widest text-black/30 mb-1'>
										Dirección
									</p>
									<p className='text-xs text-black/60 leading-relaxed'>
										{
											selectedOrder.shipping_address
										}
									</p>
								</div>
							)}

							{selectedOrder.notes && (
								<div>
									<p className='text-[9px] uppercase tracking-widest text-black/30 mb-1'>
										Notas
									</p>
									<p className='text-xs text-black/50 italic'>
										{
											selectedOrder.notes
										}
									</p>
								</div>
							)}

							{/* Cambiar estado */}
							<div>
								<p className='text-[9px] uppercase tracking-widest text-black/30 mb-3'>
									Actualizar Estado
								</p>
								<div className='flex flex-wrap gap-2'>
									{Object.entries(
										STATUS_STYLES,
									).map(([key, val]) => (
										<button
											key={key}
											disabled={
												updatingStatus ||
												selectedOrder.status ===
													key
											}
											onClick={() =>
												handleStatusChange(
													selectedOrder.id,
													key,
												)
											}
											className={`px-3 py-1.5 text-[8px] uppercase tracking-widest font-bold rounded-full transition-all
                        ${
					selectedOrder.status === key
						? `${val.classes} ring-2 ring-offset-1 ring-current`
						: 'bg-black/5 text-black/30 hover:bg-black/10'
				} disabled:opacity-50`}
										>
											{val.label}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
