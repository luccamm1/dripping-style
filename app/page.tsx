"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { categories } from "@/lib/categories";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  const categoryImages: Record<string, string> = {
    remeras: "/images/cat-remeras.jfif",
    hoodies: "/images/cat-hoodies.jfif",
    shorts: "/images/cat-shorts.jfif",
    pantalones: "/images/cat-pantalones.jfif",
    zapatillas: "/images/cat-zapatillas.jfif",
  };

  return (
    <div>
      <section className="relative bg-zinc-900 min-h-[70vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="w-full lg:w-5/12 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Colección 2026
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight text-white">
                Define tu
                <br />
                <span className="italic">propio estilo</span>
              </h1>
              <p className="text-zinc-400 mt-4 text-lg leading-relaxed">
                Descubre las últimas tendencias en moda moderna. Calidad y diseño en cada prenda.
              </p>
              <div className="flex gap-4 mt-8">
                <Link
                  href="/productos"
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                >
                  Comprar ahora
                </Link>
                <Link
                  href="/productos"
                  className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                >
                  Ver colección
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-7/12 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <Image
                  src="/images/duki-fashion-week.jfif"
                  alt="Fashion"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group translate-y-6">
                <Image
                  src="/images/cench.jfif"
                  alt="Style"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group -translate-y-6">
                <Image
                  src="/images/roa-pr.jfif"
                  alt="Urban"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <Image
                  src="/images/centralcee.jfif"
                  alt="Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-white">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden"
            >
              <Image
                src={categoryImages[cat.slug] || "/images/placeholder.svg"}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-white text-lg font-semibold tracking-wide drop-shadow-md">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Destacados</h2>
          <Link href="/productos" className="text-sm font-medium underline underline-offset-2 text-zinc-400 hover:text-white">
            Ver todos
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <section className="bg-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-white">Novedades</h2>
          <ProductGrid products={newProducts} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-white">Envío gratis</h3>
            <p className="text-sm text-zinc-400">En pedidos superiores a $80.000</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-white">Devoluciones gratis</h3>
            <p className="text-sm text-zinc-400">Hasta 30 días después de la compra</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-white">Pago seguro</h3>
            <p className="text-sm text-zinc-400">Compra protegida con encriptación SSL</p>
          </div>
        </div>
      </section>
    </div>
  );
}
