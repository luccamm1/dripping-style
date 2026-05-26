"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Order } from "@/lib/types";

function ExitoContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const processed = useRef(false);
  const [order, setOrder] = useState<Order | undefined>();

  const paymentId = searchParams.get("payment_id");
  const externalRef = searchParams.get("external_reference");

  useEffect(() => {
    if (processed.current) return;
    if (externalRef) {
      processed.current = true;
      (async () => {
        await fetch(`/api/orders/${externalRef}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "pagado",
            payment_id: paymentId || undefined,
          }),
        });
        const res = await fetch(`/api/orders/${externalRef}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
        clearCart();
      })();
    }
  }, [externalRef, paymentId, clearCart]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Pago exitoso</h1>
      <p className="text-zinc-400 mb-6">
        Gracias por tu compra{order ? `, ${order.shippingInfo.name}` : ""}.
      </p>

      {order && (
        <div className="border border-zinc-800 rounded-xl p-6 mb-6 text-left">
          <p className="text-sm text-zinc-400 mb-1">Pedido: <span className="text-white font-medium">{order.id}</span></p>
          <p className="text-sm text-zinc-400 mb-1">Total: <span className="text-white font-medium">${order.total.toFixed(2)}</span></p>
          <p className="text-sm text-zinc-400">Productos: <span className="text-white font-medium">{order.items.length}</span></p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          Volver al inicio
        </Link>
        <Link
          href="/productos"
          className="border border-zinc-700 text-zinc-300 px-8 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

export default function ExitoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    }>
      <ExitoContent />
    </Suspense>
  );
}
