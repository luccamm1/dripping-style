"use client";

import Link from "next/link";

export default function PendientePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Pago pendiente</h1>
      <p className="text-zinc-400 mb-8">
        Estamos esperando la confirmación del pago. Te notificaremos cuando se acredite.
      </p>
      <Link
        href="/"
        className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
