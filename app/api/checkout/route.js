// app/api/checkout/route.js
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { items, customerData } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    // Verificar precios reales desde Supabase (nunca confiar en el cliente)
    const productIds = items.map((i) => i.id);
    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("id, name, base_price, image_url")
      .in("id", productIds);

    if (dbError) throw dbError;

    // Crear line_items con precios verificados
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) throw new Error(`Producto no encontrado: ${item.id}`);
      return {
        price_data: {
          currency: "mxn",
          product_data: {
            name: product.name,
            ...(product.image_url && { images: [product.image_url] }),
          },
          unit_amount: Math.round(product.base_price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      };
    });

    // Obtener shipping_fee de store_config
    const { data: storeConfig } = await supabase
      .from("store_config")
      .select("shipping_fee")
      .single();

    const shippingFee = storeConfig?.shipping_fee || 0;

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_options: shippingFee > 0 ? [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingFee * 100, currency: "mxn" },
            display_name: "Envío estándar",
          },
        },
      ] : [],
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        customer_name: customerData.fullName,
        customer_phone: customerData.phone,
        shipping_address: customerData.address,
        notes: customerData.notes || "",
        items: JSON.stringify(items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          unit_price: products.find((p) => p.id === i.id)?.base_price,
        }))),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
