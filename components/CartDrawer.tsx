"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={toggleCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900/95 backdrop-blur-xl z-50 transform transition-all duration-500 ease-out shadow-2xl ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
            <h2 className="text-lg font-semibold text-white">Carrito ({items.length})</h2>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <svg className="w-16 h-16 mb-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-sm">Tu carrito está vacío</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-4 py-4 border-b border-zinc-800/50 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative w-20 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-zinc-700/50">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/productos/${item.product.slug}`}
                        onClick={toggleCart}
                        className="text-sm font-medium hover:text-zinc-300 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-zinc-500 mt-1">
                        {item.selectedSize} / {item.selectedColor}
                      </p>
                      <p className="text-sm font-semibold mt-1 text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 border border-zinc-700 rounded-md flex items-center justify-center text-sm hover:bg-zinc-800 transition-colors text-zinc-300"
                        >
                          -
                        </button>
                        <span className="text-sm w-6 text-center text-white font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 border border-zinc-700 rounded-md flex items-center justify-center text-sm hover:bg-zinc-800 transition-colors text-zinc-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                          className="ml-auto text-zinc-600 hover:text-red-400 transition-colors p-1"
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
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-zinc-800/80 px-6 py-4 space-y-4 bg-zinc-900/80">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-300">Subtotal</span>
                <span className="text-lg font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={toggleCart}
                className="block w-full text-center bg-white text-black py-3 rounded-xl font-medium hover:bg-zinc-200 transition-all active:scale-[0.98]"
              >
                Ir al checkout
              </Link>
              <Link
                href="/carrito"
                onClick={toggleCart}
                className="block w-full text-center border border-zinc-700 text-zinc-300 py-3 rounded-xl font-medium hover:bg-zinc-800 transition-all text-sm active:scale-[0.98]"
              >
                Ver carrito
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
