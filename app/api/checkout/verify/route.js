// app/api/checkout/verify/route.js
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get('session_id');
		if (!sessionId)
			return NextResponse.json(
				{ error: 'session_id requerido' },
				{ status: 400 },
			);

		// Verificar pago con Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		if (session.payment_status !== 'paid') {
			return NextResponse.json(
				{ error: 'Pago no completado' },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// Evitar pedidos duplicados si el usuario recarga la página
		const { data: existing } = await supabase
			.from('orders')
			.select('id')
			.eq('stripe_payment_intent', session.payment_intent)
			.single();

		if (existing) {
			return NextResponse.json({
				orderId: existing.id,
				customerName: session.metadata.customer_name,
				total: session.amount_total,
			});
		}

		// Guardar pedido en Supabase
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
					phone: session.metadata.customer_phone,
					notes: session.metadata.notes,
					shipping_address:
						session.metadata.shipping_address,
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

		return NextResponse.json({
			orderId: order.id,
			customerName: session.metadata.customer_name,
			total: session.amount_total,
		});
	} catch (error) {
		console.error('Verify error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
