"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import ProductGrid from "@/components/ProductGrid";

export default function ProductoPage() {
  const params = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.slug === params.id);

  if (!product) notFound();

  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-zinc-400 mb-8">
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/productos" className="hover:text-white transition-colors">Productos</Link>
        <span className="mx-2">/</span>
        <Link href={`/productos?categoria=${product.category}`} className="hover:text-white transition-colors">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="relative aspect-[4/5] bg-zinc-800 rounded-2xl overflow-hidden">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-white text-black text-xs font-medium px-3 py-1.5 rounded-full">
                Nuevo
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === i ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {product.material}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2">{product.name}</h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-zinc-500 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-zinc-400 mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-4 flex items-center gap-3">
            {product.stock === 0 ? (
              <span className="text-sm font-medium text-red-500">Producto agotado</span>
            ) : product.stock <= 5 ? (
              <span className="text-sm font-medium text-orange-500">Solo quedan {product.stock} unidades</span>
            ) : (
              <span className="text-sm text-zinc-400">En stock ({product.stock} uds.)</span>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3 text-white">Talla</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                    selectedSize === size
                      ? "border-white bg-white text-black"
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3 text-white">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                    selectedColor === color
                      ? "border-white bg-white text-black"
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3 text-white">Cantidad</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock === 0}
                className="w-10 h-10 border border-zinc-700 rounded-lg flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300"
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 border border-zinc-700 rounded-lg flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300"
              >
                +
              </button>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-sm text-orange-500 mt-2">Solo quedan {product.stock} unidades</p>
            )}
          </div>

          <button
            onClick={() => addItem(product, selectedSize, selectedColor, quantity)}
            disabled={product.stock === 0}
            className="mt-8 w-full bg-white text-black py-3.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Agotado" : `Agregar al carrito — $${(product.price * quantity).toFixed(2)}`}
          </button>

          <div className="mt-6 space-y-3 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Envío gratis en pedidos +$80.000
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Devoluciones gratis hasta 30 días
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-white">Productos relacionados</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
