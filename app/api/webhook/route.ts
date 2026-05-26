import { NextRequest, NextResponse } from "next/server";

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

        const externalReference = paymentData.external_reference;
        const status = paymentData.status;

        if (externalReference && status === "approved") {
          const fs = await import("fs");
          const path = await import("path");
          const ordersPath = path.join(process.cwd(), "data", "orders.json");
          if (fs.existsSync(ordersPath)) {
            const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
            const idx = orders.findIndex((o: any) => o.id === externalReference);
            if (idx !== -1) {
              orders[idx].status = "pagado";
              orders[idx].paymentId = paymentId;
              fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
            }
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
