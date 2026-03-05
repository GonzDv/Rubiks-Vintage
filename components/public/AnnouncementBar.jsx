import { createClient } from '@/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export default async function AnnouncementBar() {
	noStore(); // ← fuerza que nunca se cachee

	const supabase = await createClient();

	const { data: config } = await supabase
		.from('store_config')
		.select('announcement_bar')
		.limit(1)
		.single();

	if (!config?.announcement_bar) return null;

	return (
		<div className='w-full bg-black text-white py-2.5 px-6 overflow-hidden relative'>
			<div className='max-w-7xl mx-auto flex justify-center items-center'>
				<p className='text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-center animate-pulse'>
					{config.announcement_bar}
				</p>
			</div>
			<div className='absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hidden md:block'>
				<div className='w-1 h-1 bg-[#A07F3A] rounded-full' />
			</div>
		</div>
	);
}
