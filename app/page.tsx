"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { categories } from "@/lib/categories";
import ProductGrid from "@/components/ProductGrid";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { ProductGridSkeleton } from "@/components/Skeleton";

function ScrollSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useScrollAnimation();
  const delayClass = delay > 0 ? `scroll-fade-delay-${delay}` : "";
  return (
    <div ref={ref} className={`scroll-fade ${delayClass}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const { products, loading } = useProducts();
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
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/60 via-transparent to-zinc-950/40 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#18181b_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="w-full lg:w-5/12 shrink-0 animate-fade-in-up">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Colección 2026
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight text-white">
                Define tu
                <br />
                <span className="italic">propio estilo</span>
              </h1>
              <p className="text-zinc-400 mt-4 text-lg leading-relaxed max-w-md">
                Descubre las últimas tendencias en moda moderna. Calidad y diseño en cada prenda.
              </p>
              <div className="flex gap-4 mt-8">
                <Link
                  href="/productos"
                  className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Comprar ahora
                </Link>
                <Link
                  href="/productos"
                  className="border border-zinc-600 text-zinc-300 px-8 py-3 rounded-xl font-medium hover:border-zinc-400 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group translate-y-6">
                <Image
                  src="/images/cench.jfif"
                  alt="Style"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group -translate-y-6">
                <Image
                  src="/images/roa-pr.jfif"
                  alt="Urban"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <Image
                  src="/images/centralcee.jfif"
                  alt="Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/70" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-white text-lg font-semibold tracking-wide drop-shadow-md">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollSection>

      <ScrollSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Destacados</h2>
            <Link href="/productos" className="text-sm font-medium underline underline-offset-4 text-zinc-500 hover:text-white transition-colors">
              Ver todos
            </Link>
          </div>
          {loading ? <ProductGridSkeleton count={8} /> : <ProductGrid products={featuredProducts} />}
        </section>
      </ScrollSection>

      <ScrollSection>
        <section className="bg-zinc-900/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-white">Novedades</h2>
            {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={newProducts} />}
          </div>
        </section>
      </ScrollSection>

      <ScrollSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-zinc-700/80 transition-colors duration-300 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-white">Envío gratis</h3>
              <p className="text-sm text-zinc-500">En pedidos superiores a $80.000</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-zinc-700/80 transition-colors duration-300 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-white">Devoluciones gratis</h3>
              <p className="text-sm text-zinc-500">Hasta 30 días después de la compra</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-zinc-700/80 transition-colors duration-300 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-white">Pago seguro</h3>
              <p className="text-sm text-zinc-500">Compra protegida con encriptación SSL</p>
            </div>
          </div>
        </section>
      </ScrollSection>
    </div>
  );
}
