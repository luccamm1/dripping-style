import { NextRequest, NextResponse } from "next/server";

const MP_API_URL = "https://api.mercadopago.com/checkout/preferences";

export async function POST(req: NextRequest) {
  try {
    const { items, customer, total, orderId } = await req.json();

    if (!items?.length || !customer || !orderId) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Falta configurar MERCADOPAGO_ACCESS_TOKEN" },
        { status: 500 }
      );
    }

    const body = {
      items: items.map((item: any) => ({
        title: item.product.name,
        unit_price: Number(item.product.price),
        quantity: Number(item.quantity),
        currency_id: "ARS",
      })),
      payer: {
        name: customer.name,
        email: customer.email,
      },
      back_urls: {
        success: `${baseUrl}/pago/exito`,
        failure: `${baseUrl}/pago/fallo`,
        pending: `${baseUrl}/pago/pendiente`,
      },
      auto_return: "approved",
      external_reference: orderId,
    };

    const mpRes = await fetch(MP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "TKBRONCLOTHS/1.0",
      },
      body: JSON.stringify(body),
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      console.error("Mercado Pago API error:", mpRes.status, JSON.stringify(data));
      return NextResponse.json(
        {
          error: data.message || data.error || "Error de Mercado Pago",
          detail: JSON.stringify(data),
          status: mpRes.status,
        },
        { status: 500 }
      );
    }

    const initPoint = data.init_point;

    if (!initPoint) {
      return NextResponse.json(
        { error: "No se obtuvo URL de pago", detail: JSON.stringify(data) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      init_point: initPoint,
      preference_id: data.id,
    });
  } catch (error: any) {
    console.error("Error creating preference:", error);
    const message = error?.message || "Error al crear la preferencia de pago";
    return NextResponse.json(
      { error: message, detail: JSON.stringify(error, Object.getOwnPropertyNames(error)) },
      { status: 500 }
    );
  }
}
