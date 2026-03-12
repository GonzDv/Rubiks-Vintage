// app/api/webhook/route.js
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	// Verificar que el evento viene realmente de Stripe
	let event;
	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		console.error('Webhook signature error:', err.message);
		return NextResponse.json(
			{ error: 'Invalid signature' },
			{ status: 400 },
		);
	}

	// Solo nos interesa este evento
	if (event.type !== 'checkout.session.completed') {
		return NextResponse.json({ received: true });
	}

	const session = event.data.object;

	// Solo procesar si el pago fue exitoso
	if (session.payment_status !== 'paid') {
		return NextResponse.json({ received: true });
	}

	try {
		const supabase = await createClient();

		// Evitar duplicados — puede que verify/route.js ya lo haya guardado
		const { data: existing } = await supabase
			.from('orders')
			.select('id')
			.eq('stripe_payment_intent', session.payment_intent)
			.maybeSingle();

		if (existing) {
			console.log(
				'Pedido ya existe, ignorando webhook:',
				existing.id,
			);
			return NextResponse.json({ received: true });
		}

		// Guardar pedido
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.insert([
				{
					user_id: session.metadata.user_id,
					status: 'pagado',
					total_amount: session.amount_total / 100,
					stripe_payment_intent: session.payment_intent,
					customer_email: session.customer_email,
					customer_name: session.metadata.customer_name,
					shipping_address:
						session.metadata.shipping_address,
					phone: session.metadata.customer_phone,
					notes: session.metadata.notes,
				},
			])
			.select()
			.single();

		if (orderError) throw orderError;

		// Guardar items del pedido
		const items = JSON.parse(session.metadata.items);
		const itemsToInsert = items.map((item) => ({
			order_id: order.id,
			variant_id: null,
			product_id: item.id,
			quantity: item.quantity,
			unit_price: item.unit_price,
		}));

		const { error: itemsError } = await supabase
			.from('item_order')
			.insert(itemsToInsert);

		if (itemsError) throw itemsError;
		
		for (const item of items) {
			await supabase.rpc('decrement_stock', {
				p_product_id: item.id,
				p_quantity: item.quantity,
			});
		}

		console.log('Pedido guardado via webhook:', order.id);
		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Webhook processing error:', error.message);
		// Retornamos 200 igual — si retornamos 500 Stripe reintenta indefinidamente
		return NextResponse.json({ received: true });
	}
}
