import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { action, data } = body;
    if (action === "payment.created" || action === "payment.updated") {
      const paymentId = data?.id;
      if (paymentId) {
        const MercadoPagoConfig = (await import("mercadopago")).MercadoPagoConfig;
        const Payment = (await import("mercadopago")).Payment;

        const client = new MercadoPagoConfig({
          accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
        });

        const payment = new Payment(client);
        const paymentData = await payment.get({ id: paymentId });

        const externalRef = paymentData.external_reference;
        const status = paymentData.status;

        if (externalRef && status === "approved") {
          const { data: order } = await supabase
            .from("orders")
            .select("items, status")
            .eq("id", externalRef)
            .single();

          if (order && order.status !== "pagado") {
            if (order.items) {
              for (const item of order.items) {
                const productId = item.product?.id || item.product_id;
                const qty = item.quantity || 1;

                const { data: product } = await supabase
                  .from("products")
                  .select("stock")
                  .eq("id", productId)
                  .single();

                if (product) {
                  const newStock = Math.max(0, (product.stock || 0) - qty);
                  await supabase
                    .from("products")
                    .update({ stock: newStock })
                    .eq("id", productId);
                }
              }
            }

            await supabase
              .from("orders")
              .update({ status: "pagado", payment_id: paymentId })
              .eq("id", externalRef);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
