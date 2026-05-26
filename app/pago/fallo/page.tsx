"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useOrders } from "@/context/OrdersContext";

function FalloContent() {
  const searchParams = useSearchParams();
  const { updateOrder } = useOrders();
  const processed = useRef(false);

  const externalRef = searchParams.get("external_reference");

  useEffect(() => {
    if (processed.current) return;
    if (externalRef) {
      processed.current = true;
      updateOrder(externalRef, { status: "fallido" });
    }
  }, [externalRef, updateOrder]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Pago rechazado</h1>
      <p className="text-zinc-400 mb-8">
        El pago no pudo procesarse. Intentá de nuevo o usá otro medio de pago.
      </p>
      <Link
        href="/carrito"
        className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
      >
        Volver al carrito
      </Link>
    </div>
  );
}

export default function FalloPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    }>
      <FalloContent />
    </Suspense>
  );
}
