'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// ─── Reglas de contraseña ────────────────────────────────────────────────────
const PASSWORD_RULES = [
	{
		id: 'length',
		label: 'Mínimo 8 caracteres',
		test: (p) => p.length >= 8,
	},
	{
		id: 'upper',
		label: 'Una letra mayúscula',
		test: (p) => /[A-Z]/.test(p),
	},
	{
		id: 'lower',
		label: 'Una letra minúscula',
		test: (p) => /[a-z]/.test(p),
	},
	{ id: 'number', label: 'Un número', test: (p) => /[0-9]/.test(p) },
];

function getStrength(password) {
	if (!password) return { score: 0, label: '', color: '' };
	const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
	if (passed <= 1)
		return { score: 1, label: 'Muy débil', color: 'bg-red-400' };
	if (passed === 2)
		return { score: 2, label: 'Débil', color: 'bg-orange-400' };
	if (passed === 3)
		return { score: 3, label: 'Buena', color: 'bg-yellow-400' };
	return { score: 4, label: 'Segura', color: 'bg-emerald-400' };
}

// ─── Input de contraseña con toggle ──────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder = '••••••••' }) {
	const [show, setShow] = useState(false);
	return (
		<div className='relative'>
			<input
				type={show ? 'text' : 'password'}
				required
				placeholder={placeholder}
				className='w-full border-b border-black/10 py-2 pr-8 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm'
				value={value}
				onChange={onChange}
			/>
			<button
				type='button'
				onClick={() => setShow(!show)}
				className='absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors'
			>
				{show ? (
					<EyeOff size={14} strokeWidth={1.5} />
				) : (
					<Eye size={14} strokeWidth={1.5} />
				)}
			</button>
		</div>
	);
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function LoginPage() {
	const supabase = createClient();
	const router = useRouter();

	const [isRegistering, setIsRegistering] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);

	const strength = useMemo(() => getStrength(password), [password]);
	const rules = useMemo(
		() =>
			PASSWORD_RULES.map((r) => ({
				...r,
				passed: r.test(password),
			})),
		[password],
	);
	const passwordValid = strength.score === 4;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (isRegistering) {
			if (!passwordValid) {
				setError(
					'La contraseña no cumple todos los requisitos de seguridad.',
				);
				return;
			}
			if (password !== confirmPassword) {
				setError('Las contraseñas no coinciden.');
				return;
			}
		}

		setLoading(true);

		if (isRegistering) {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						first_name: firstName,
						last_name: lastName,
						full_name: `${firstName} ${lastName}`,
					},
				},
			});

			if (error) {
				if (error.message.includes('already registered')) {
					setError(
						'Este correo ya está registrado. Intenta iniciar sesión.',
					);
				} else {
					setError(error.message);
				}
			} else {
				setMessage(
					'¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.',
				);
				setIsRegistering(false);
				setPassword('');
			}
		} else {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				if (error.message.includes('Invalid login')) {
					setError('Correo o contraseña incorrectos.');
				} else if (
					error.message.includes('Email not confirmed')
				) {
					setError(
						'Confirma tu correo antes de iniciar sesión.',
					);
				} else {
					setError(error.message);
				}
			} else {
				router.push('/');
				router.refresh();
			}
		}

		setLoading(false);
	};

	const switchMode = () => {
		setIsRegistering(!isRegistering);
		setError(null);
		setMessage(null);
		setPassword('');
		setConfirmPassword('');
	};

	return (
		<div className='min-h-[85vh] flex items-center justify-center bg-[#F5F1EB] px-4 py-12'>
			<div className='max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-black/5'>
				{/* Header */}
				<div className='text-center mb-10'>
					<h1 className='text-4xl font-serif italic mb-3 text-black tracking-tight'>
						ZÁLEA
					</h1>
					<p className='text-[10px] uppercase tracking-[0.4em] text-[#C4A95E] font-bold'>
						{isRegistering
							? 'Únete a la Colección'
							: 'Panel de Acceso'}
					</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Campos de nombre — solo en registro */}
					{isRegistering && (
						<div className='grid grid-cols-2 gap-4 animate-in fade-in duration-300'>
							<div>
								<label className='block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold'>
									Nombre
								</label>
								<input
									type='text'
									required
									placeholder='Ej. Ana'
									className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm'
									value={firstName}
									onChange={(e) =>
										setFirstName(
											e.target
												.value,
										)
									}
								/>
							</div>
							<div>
								<label className='block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold'>
									Apellido
								</label>
								<input
									type='text'
									required
									placeholder='Ej. Pérez'
									className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm'
									value={lastName}
									onChange={(e) =>
										setLastName(
											e.target
												.value,
										)
									}
								/>
							</div>
						</div>
					)}

					{/* Email */}
					<div>
						<label className='block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold'>
							Email
						</label>
						<input
							type='email'
							required
							className='w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm'
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
						/>
					</div>

					{/* Contraseña */}
					<div className='space-y-3'>
						<label className='block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold'>
							Contraseña
						</label>
						<PasswordInput
							value={password}
							onChange={(e) =>
								setPassword(e.target.value)
							}
						/>

						{/* Indicador de fuerza — solo en registro */}
						{isRegistering && password.length > 0 && (
							<div className='space-y-3 animate-in fade-in duration-200'>
								{/* Barra de fuerza */}
								<div className='flex gap-1 h-1'>
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className={`flex-1 rounded-full transition-all duration-300 ${
												i <=
												strength.score
													? strength.color
													: 'bg-black/5'
											}`}
										/>
									))}
								</div>
								<p
									className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${
										strength.score === 4
											? 'text-emerald-500'
											: strength.score ===
												  3
												? 'text-yellow-500'
												: strength.score ===
													  2
													? 'text-orange-400'
													: 'text-red-400'
									}`}
								>
									{strength.label}
								</p>

								{/* Reglas */}
								<div className='grid grid-cols-2 gap-1.5'>
									{rules.map((rule) => (
										<div
											key={rule.id}
											className='flex items-center gap-1.5'
										>
											{rule.passed ? (
												<Check
													size={
														10
													}
													className='text-emerald-500 shrink-0'
													strokeWidth={
														2.5
													}
												/>
											) : (
												<X
													size={
														10
													}
													className='text-black/20 shrink-0'
													strokeWidth={
														2
													}
												/>
											)}
											<span
												className={`text-[9px] transition-colors ${
													rule.passed
														? 'text-black/60'
														: 'text-black/25'
												}`}
											>
												{
													rule.label
												}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Confirmar contraseña — solo en registro */}
					{isRegistering && (
						<div className='animate-in slide-in-from-top-2 duration-300'>
							<label className='block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold'>
								Confirmar Contraseña
							</label>
							<PasswordInput
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(
										e.target.value,
									)
								}
							/>
							{confirmPassword &&
								confirmPassword !==
									password && (
									<p className='text-[9px] text-red-400 mt-2 flex items-center gap-1'>
										<X
											size={10}
											strokeWidth={
												2
											}
										/>{' '}
										Las contraseñas no
										coinciden
									</p>
								)}
							{confirmPassword &&
								confirmPassword ===
									password && (
									<p className='text-[9px] text-emerald-500 mt-2 flex items-center gap-1'>
										<Check
											size={10}
											strokeWidth={
												2.5
											}
										/>{' '}
										Las contraseñas
										coinciden
									</p>
								)}
						</div>
					)}

					{/* Mensajes de error / éxito */}
					{error && (
						<div className='bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[10px] text-red-500 flex items-start gap-2'>
							<X
								size={12}
								className='shrink-0 mt-0.5'
								strokeWidth={2}
							/>
							{error}
						</div>
					)}
					{message && (
						<div className='bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-[10px] text-emerald-600 flex items-start gap-2'>
							<Check
								size={12}
								className='shrink-0 mt-0.5'
								strokeWidth={2.5}
							/>
							{message}
						</div>
					)}

					{/* Submit */}
					<button
						type='submit'
						disabled={loading}
						className='w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black/90 transition-all flex items-center justify-center gap-3 mt-4 disabled:bg-black/20'
					>
						{loading ? (
							<Loader2
								className='animate-spin'
								size={16}
							/>
						) : isRegistering ? (
							'Crear Cuenta'
						) : (
							'Entrar'
						)}
					</button>

					<button
						type='button'
						onClick={switchMode}
						className='w-full mt-2 text-[9px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors font-bold'
					>
						{isRegistering
							? '¿Ya tienes cuenta? Inicia sesión'
							: '¿No tienes cuenta? Regístrate'}
					</button>
				</form>
			</div>
		</div>
	);
}
