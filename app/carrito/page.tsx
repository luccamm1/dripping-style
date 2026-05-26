"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 mx-auto text-zinc-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-zinc-400 mb-8">Agrega productos para comenzar tu compra.</p>
        <Link
          href="/productos"
          className="inline-block bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm text-zinc-400 hover:text-red-500 underline underline-offset-2 transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 p-4 border border-zinc-800 rounded-xl"
              >
                <Link
                  href={`/productos/${item.product.slug}`}
                  className="relative w-24 h-28 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/productos/${item.product.slug}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {item.product.name}
                  </Link>
                    <p className="text-xs text-zinc-400 mt-0.5">
                    {item.selectedSize} / {item.selectedColor}
                  </p>
                  <p className="text-sm font-bold mt-2">${item.product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 border border-zinc-700 rounded-lg flex items-center justify-center text-sm hover:bg-zinc-800 text-zinc-300"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center text-white">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border border-zinc-700 rounded-lg flex items-center justify-center text-sm hover:bg-zinc-800 text-zinc-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.selectedSize, item.selectedColor)
                      }
                      className="ml-auto text-zinc-500 hover:text-red-500 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-zinc-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-white">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Envío</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full text-center bg-white text-black py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              Proceder al pago
            </Link>
            <Link
              href="/productos"
              className="mt-3 block w-full text-center border border-zinc-700 text-zinc-300 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors text-sm"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
