"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">No hay productos en tu carrito</h1>
        <p className="text-zinc-400 mb-8">Agrega productos antes de continuar.</p>
        <Link
          href="/productos"
          className="inline-block bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-200"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Requerido";
    if (!form.email.trim()) errs.email = "Requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido";
    if (!form.phone.trim()) errs.phone = "Requerido";
    if (!form.address.trim()) errs.address = "Requerido";
    if (!form.city.trim()) errs.city = "Requerido";
    if (!form.state.trim()) errs.state = "Requerido";
    if (!form.zip.trim()) errs.zip = "Requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const orderId = `ORD-${Date.now()}`;

    const order = {
      id: orderId,
      items: items,
      subtotal,
      shipping,
      total,
      shippingInfo: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
      },
      date: new Date().toISOString().split("T")[0],
      status: "pendiente" as const,
    };

    await addOrder(order);

    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: form,
          total,
          orderId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al procesar el pago");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch {
      alert("Error de conexión. Intentalo de nuevo.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-white">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Información de envío</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full border ${errors.name ? "border-red-500" : "border-zinc-700"} bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-white`}
                  placeholder="Juan Pérez"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full border ${errors.email ? "border-red-500" : "border-zinc-700"} bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-white`}
                    placeholder="juan@email.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-300">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full border ${errors.phone ? "border-red-500" : "border-zinc-700"} bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-white`}
                    placeholder="+54 9 381 648 8648"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                    className={`w-full border ${errors.address ? "border-red-500" : "border-zinc-700"} bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-white`}
                  placeholder="Calle Principal 123"
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-300">Ciudad</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={`w-full border ${errors.city ? "border-red-500" : "border-zinc-700"} bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-white`}
                    placeholder="San Miguel de Tucumán"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-300">Provincia</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={`w-full border ${errors.state ? "border-red-500" : "border-zinc-700"} bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-white`}
                    placeholder="Tucumán"
                  />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-300">Código postal</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    className={`w-full border ${errors.zip ? "border-red-500" : "border-zinc-700"} bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-white`}
                    placeholder="4000"
                  />
                  {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirigiendo a Mercado Pago..." : `Confirmar pedido — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="lg:col-span-2">
          <div className="border border-zinc-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-white">Tu pedido</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                  <div className="relative w-14 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-zinc-400">
                      {item.selectedSize} / {item.selectedColor} x{item.quantity}
                    </p>
                    <p className="text-sm font-semibold mt-0.5">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-zinc-800 mt-4 pt-4 space-y-2 text-sm">
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
              <div className="border-t border-zinc-800 pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
