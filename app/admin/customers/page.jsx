'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
	Users,
	UserPlus,
	Search,
	Star,
	Loader2,
	X,
	ShoppingBag,
	Mail,
} from 'lucide-react';
export const dynamic = 'force-dynamic';
export default function CustomersPage() {
	const supabase = createClient();
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [customerOrders, setCustomerOrders] = useState([]);
	const [loadingOrders, setLoadingOrders] = useState(false);

	const fetchCustomers = async () => {
		setLoading(true);

		// Traer perfiles con sus pedidos agregados
		const { data: profiles, error } = await supabase
			.from('profiles')
			.select('*, orders(id, total_amount, status, created_at)')
			.eq('is_admin', false)
			.order('email', { ascending: true });

		if (error) console.error('Error:', error.message);
		setCustomers(profiles || []);
		setLoading(false);
	};

	const fetchCustomerOrders = async (userId) => {
		setLoadingOrders(true);
		const { data } = await supabase
			.from('orders')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });
		setCustomerOrders(data || []);
		setLoadingOrders(false);
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleSelectCustomer = async (customer) => {
		setSelectedCustomer(customer);
		await fetchCustomerOrders(customer.id);
	};

	const filtered = customers.filter((c) =>
		c.email?.toLowerCase().includes(search.toLowerCase()),
	);

	// Stats calculadas
	const thisMonth = new Date();
	thisMonth.setDate(1);
	const newThisMonth = customers.filter((c) =>
		c.orders?.some((o) => new Date(o.created_at) >= thisMonth),
	).length;

	const topCustomers = customers.filter(
		(c) => (c.orders?.length || 0) >= 2,
	).length;

	const stats = [
		{ label: 'Total Clientes', value: customers.length, icon: Users },
		{ label: 'Activos este Mes', value: newThisMonth, icon: UserPlus },
		{ label: 'Clientes Frecuentes', value: topCustomers, icon: Star },
	];

	// Iniciales del nombre
	const getInitials = (email) => {
		if (!email) return '?';
		return email.slice(0, 2).toUpperCase();
	};

	// Total gastado por cliente
	const getTotalSpent = (orders) => {
		if (!orders?.length) return 0;
		return orders.reduce(
			(sum, o) => sum + parseFloat(o.total_amount || 0),
			0,
		);
	};

	return (
		<div className='space-y-8'>
			{/* HEADER */}
			<header className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
				<div className='space-y-1'>
					<h1 className='text-3xl md:text-4xl font-serif italic text-black'>
						Directorio de Clientes
					</h1>
					<p className='text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold'>
						Base de datos y fidelización de ZÁLEA
					</p>
				</div>
				<div className='relative w-full md:w-72'>
					<Search
						className='absolute left-4 top-1/2 -translate-y-1/2 text-black/20'
						size={14}
					/>
					<input
						type='text'
						placeholder='Buscar por correo...'
						className='w-full bg-white border border-black/5 rounded-full py-3 pl-10 pr-4 text-xs outline-none focus:border-[#A07F3A] transition-all shadow-sm'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</header>

			{/* STATS */}
			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
				{stats.map((stat) => (
					<div
						key={stat.label}
						className='bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center justify-between'
					>
						<div>
							<p className='text-[9px] uppercase tracking-widest text-black/40 font-bold mb-1'>
								{stat.label}
							</p>
							<p className='text-2xl font-serif italic text-black'>
								{loading
									? '—'
									: String(
											stat.value,
										).padStart(2, '0')}
							</p>
						</div>
						<div className='p-3 bg-[#F9F8F6] rounded-2xl'>
							<stat.icon
								size={18}
								className='text-[#A07F3A]'
								strokeWidth={1.5}
							/>
						</div>
					</div>
				))}
			</div>

			{/* TABLA */}
			<section className='bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm'>
				<div className='p-6 border-b border-black/5'>
					<h3 className='text-[10px] uppercase tracking-widest font-bold text-black/50'>
						Lista de Compradores
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
							<Users
								size={36}
								strokeWidth={0.5}
								className='mx-auto mb-3'
							/>
							<p className='text-[10px] uppercase tracking-widest'>
								{search
									? 'Sin resultados'
									: 'No hay clientes aún'}
							</p>
						</div>
					) : (
						<table className='w-full text-left'>
							<thead>
								<tr className='bg-[#F9F8F6] text-[9px] uppercase tracking-[0.2em] text-black/40'>
									<th className='px-6 py-4 font-bold'>
										Cliente
									</th>
									<th className='px-6 py-4 font-bold text-center'>
										Pedidos
									</th>
									<th className='px-6 py-4 font-bold'>
										Total Gastado
									</th>
									<th className='px-6 py-4 font-bold text-right'>
										Ver
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-black/5'>
								{filtered.map((customer) => {
									const totalSpent =
										getTotalSpent(
											customer.orders,
										);
									const orderCount =
										customer.orders
											?.length || 0;
									const isFrequent =
										orderCount >= 2;

									return (
										<tr
											key={
												customer.id
											}
											className='hover:bg-[#F5F1EB]/30 transition-colors'
										>
											<td className='px-6 py-5'>
												<div className='flex items-center gap-3'>
													<div className='w-9 h-9 rounded-full bg-[#DBD2C8] flex items-center justify-center text-[10px] font-bold text-black/50 shrink-0'>
														{getInitials(
															customer.email,
														)}
													</div>
													<div>
														<p className='text-xs font-bold text-black flex items-center gap-1.5'>
															{
																customer.email?.split(
																	'@',
																)[0]
															}
															{isFrequent && (
																<Star
																	size={
																		9
																	}
																	className='fill-amber-400 text-amber-400'
																/>
															)}
														</p>
														<p className='text-[9px] text-black/30 truncate max-w-[160px]'>
															{
																customer.email
															}
														</p>
													</div>
												</div>
											</td>
											<td className='px-6 py-5 text-center'>
												<span className='text-xs font-medium bg-[#F9F8F6] px-2 py-1 rounded-md border border-black/5'>
													{String(
														orderCount,
													).padStart(
														2,
														'0',
													)}
												</span>
											</td>
											<td className='px-6 py-5'>
												<span className='text-xs font-serif text-[#A07F3A]'>
													$
													{totalSpent.toLocaleString(
														'es-MX',
													)}{' '}
													MXN
												</span>
											</td>
											<td className='px-6 py-5 text-right'>
												<button
													onClick={() =>
														handleSelectCustomer(
															customer,
														)
													}
													className='p-2 text-black/20 hover:text-black transition-colors hover:bg-[#F5F1EB] rounded-full'
												>
													<Mail
														size={
															15
														}
														strokeWidth={
															1.5
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
							? 'cliente'
							: 'clientes'}{' '}
						registrados
					</p>
				</footer>
			</section>

			{/* MODAL DETALLE CLIENTE */}
			{selectedCustomer && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
					<div
						className='absolute inset-0 bg-black/50 backdrop-blur-sm'
						onClick={() => setSelectedCustomer(null)}
					/>
					<div className='relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden'>
						{/* Header */}
						<div className='px-8 py-6 border-b border-black/5 flex items-center justify-between shrink-0'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-[#DBD2C8] flex items-center justify-center text-[11px] font-bold text-black/50'>
									{getInitials(
										selectedCustomer.email,
									)}
								</div>
								<div>
									<h2 className='text-sm font-bold text-black'>
										{
											selectedCustomer.email?.split(
												'@',
											)[0]
										}
									</h2>
									<p className='text-[9px] text-black/30'>
										{
											selectedCustomer.email
										}
									</p>
								</div>
							</div>
							<button
								onClick={() =>
									setSelectedCustomer(null)
								}
								className='hover:rotate-90 transition-transform duration-300 text-black/20 hover:text-black'
							>
								<X
									size={20}
									strokeWidth={1.5}
								/>
							</button>
						</div>

						{/* Stats del cliente */}
						<div className='grid grid-cols-2 gap-4 p-6 border-b border-black/5 shrink-0'>
							<div className='bg-[#F9F8F6] rounded-xl p-4 text-center'>
								<p className='text-xl font-serif italic text-black'>
									{selectedCustomer.orders
										?.length || 0}
								</p>
								<p className='text-[9px] uppercase tracking-widest text-black/30 mt-1'>
									Pedidos
								</p>
							</div>
							<div className='bg-[#F9F8F6] rounded-xl p-4 text-center'>
								<p className='text-lg font-serif text-[#A07F3A]'>
									$
									{getTotalSpent(
										selectedCustomer.orders,
									).toLocaleString('es-MX')}
								</p>
								<p className='text-[9px] uppercase tracking-widest text-black/30 mt-1'>
									Total MXN
								</p>
							</div>
						</div>

						{/* Historial de pedidos */}
						<div className='flex-1 overflow-y-auto p-6 space-y-3'>
							<p className='text-[9px] uppercase tracking-widest text-black/30 font-bold mb-4'>
								Historial de Pedidos
							</p>
							{loadingOrders ? (
								<div className='flex justify-center py-8 text-black/20'>
									<Loader2
										className='animate-spin'
										size={20}
										strokeWidth={1}
									/>
								</div>
							) : customerOrders.length === 0 ? (
								<div className='text-center py-8 text-black/20'>
									<ShoppingBag
										size={28}
										strokeWidth={0.5}
										className='mx-auto mb-2'
									/>
									<p className='text-[9px] uppercase tracking-widest'>
										Sin pedidos aún
									</p>
								</div>
							) : (
								customerOrders.map((order) => (
									<div
										key={order.id}
										className='flex items-center justify-between p-3 bg-[#F9F8F6] rounded-xl'
									>
										<div>
											<p className='text-[10px] font-mono text-black/40'>
												#
												{order.id
													.slice(
														0,
														8,
													)
													.toUpperCase()}
											</p>
											<p className='text-[9px] text-black/30 mt-0.5'>
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
											</p>
										</div>
										<div className='text-right'>
											<p className='text-xs font-serif text-[#A07F3A]'>
												$
												{parseFloat(
													order.total_amount,
												).toLocaleString(
													'es-MX',
												)}{' '}
												MXN
											</p>
											<span className='text-[8px] uppercase tracking-widest text-black/30'>
												{
													order.status
												}
											</span>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
