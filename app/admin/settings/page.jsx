'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Store, Save, Loader2, Mail } from 'lucide-react';
import NotificationSuccess from '@/components/admin/NotificationSuccess';
export const dynamic = 'force-dynamic';
export default function SettingsPage() {
	const supabase = createClient();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [user, setUser] = useState(null);

	const [profile, setProfile] = useState({
		first_name: '',
		last_name: '',
	});

	const [store, setStore] = useState({
		id: null,
		store_name: '',
		contact_email: '',
		shipping_fee: 0,
		announcement_bar: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			// Traer usuario de auth (donde están los metadatos de nombre)
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUser(user);
				setProfile({
					first_name: user.user_metadata?.first_name || '',
					last_name: user.user_metadata?.last_name || '',
				});
			}

			// Traer configuración de la tienda
			const { data: storeData } = await supabase
				.from('store_config')
				.select('*')
				.limit(1)
				.single();
			if (storeData) setStore(storeData);

			setLoading(false);
		};
		fetchData();
	}, []);

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);

		try {
			// Actualizar metadatos de nombre en Supabase Auth
			const { error: authError } = await supabase.auth.updateUser({
				data: {
					first_name: profile.first_name,
					last_name: profile.last_name,
					full_name: `${profile.first_name} ${profile.last_name}`,
				},
			});
			if (authError) throw authError;

			// Actualizar store_config
			if (store.id) {
				const { error: storeError } = await supabase
					.from('store_config')
					.update({
						store_name: store.store_name,
						contact_email: store.contact_email,
						shipping_fee:
							parseFloat(store.shipping_fee) || 0,
						announcement_bar: store.announcement_bar,
					})
					.eq('id', store.id);
				if (storeError) throw storeError;
			}

			setShowSuccess(true);
			setTimeout(() => setShowSuccess(false), 3000);
		} catch (error) {
			alert('Error al guardar: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className='h-96 flex items-center justify-center italic text-black/20 text-sm'>
				Cargando configuración de ZÁLEA...
			</div>
		);

	return (
		<div className='max-w-4xl mx-auto space-y-10 pb-20'>
			{showSuccess && <NotificationSuccess />}

			{/* Header */}
			<header className='space-y-1'>
				<h1 className='text-3xl md:text-4xl font-serif italic text-black'>
					Configuración
				</h1>
				<p className='text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold'>
					Personaliza la experiencia de tu marca
				</p>
			</header>

			<form onSubmit={handleSave} className='space-y-8'>
				{/* SECCIÓN: Perfil del admin */}
				<section className='bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-black/5 space-y-8'>
					<div className='flex items-center gap-3 border-b border-black/5 pb-4'>
						<User
							size={16}
							className='text-[#A07F3A]'
						/>
						<h2 className='text-[10px] uppercase tracking-widest font-bold'>
							Información del Administrador
						</h2>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<div className='space-y-2'>
							<label className='text-[9px] uppercase tracking-widest text-black/40 font-bold'>
								Nombre
							</label>
							<input
								type='text'
								value={profile.first_name}
								onChange={(e) =>
									setProfile({
										...profile,
										first_name:
											e.target
												.value,
									})
								}
								className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent italic text-sm'
							/>
						</div>
						<div className='space-y-2'>
							<label className='text-[9px] uppercase tracking-widest text-black/40 font-bold'>
								Apellido
							</label>
							<input
								type='text'
								value={profile.last_name}
								onChange={(e) =>
									setProfile({
										...profile,
										last_name:
											e.target
												.value,
									})
								}
								className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent italic text-sm'
							/>
						</div>
						<div className='space-y-2 md:col-span-2'>
							<label className='text-[9px] uppercase tracking-widest text-black/40 font-bold'>
								Correo Electrónico
							</label>
							<div className='flex items-center gap-2 text-black/30 py-2 italic text-sm border-b border-black/5'>
								<Mail size={13} />
								<span>{user?.email}</span>
								<span className='text-[9px] bg-black/5 px-2 py-0.5 rounded-full uppercase tracking-widest not-italic ml-auto'>
									Solo lectura
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* SECCIÓN: Configuración de la tienda */}
				<section className='bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-black/5 space-y-8'>
					<div className='flex items-center gap-3 border-b border-black/5 pb-4'>
						<Store
							size={16}
							className='text-[#A07F3A]'
						/>
						<h2 className='text-[10px] uppercase tracking-widest font-bold'>
							Detalles de la Boutique
						</h2>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<div className='space-y-2'>
							<label className='text-[9px] uppercase tracking-widest text-black/40 font-bold'>
								Nombre del Bazar
							</label>
							<input
								type='text'
								value={store.store_name}
								onChange={(e) =>
									setStore({
										...store,
										store_name:
											e.target
												.value,
									})
								}
								className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent font-serif italic text-lg'
							/>
						</div>

						<div className='space-y-2'>
							<label className='text-[9px] uppercase tracking-widest text-black/40 font-bold'>
								Costo de Envío (MXN)
							</label>
							<input
								type='number'
								min='0'
								value={store.shipping_fee}
								onChange={(e) =>
									setStore({
										...store,
										shipping_fee:
											e.target
												.value,
									})
								}
								className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent font-serif text-lg'
							/>
						</div>

						<div className='space-y-2 md:col-span-2'>
							<label className='text-[9px] uppercase tracking-widest text-black/40 font-bold'>
								Barra de Anuncios
							</label>
							<input
								type='text'
								placeholder='Ej. Envío gratis en compras mayores a $999 MXN'
								value={store.announcement_bar}
								onChange={(e) =>
									setStore({
										...store,
										announcement_bar:
											e.target
												.value,
									})
								}
								className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-xs italic'
							/>
							<p className='text-[9px] text-black/25'>
								Este texto aparece en la barra
								superior de la tienda
							</p>
						</div>
					</div>
				</section>

				{/* Botón guardar */}
				<div className='flex justify-center md:justify-end'>
					<button
						type='submit'
						disabled={saving}
						className='w-full md:w-64 bg-black text-white py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3 hover:bg-[#A07F3A] transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50'
					>
						{saving ? (
							<Loader2
								size={16}
								className='animate-spin'
							/>
						) : (
							<Save size={16} />
						)}
						Guardar Cambios
					</button>
				</div>
			</form>
		</div>
	);
}
