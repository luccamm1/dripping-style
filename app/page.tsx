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
      {/* ─── HERO ─── */}
      <section className="relative bg-zinc-900 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 via-zinc-900/60 to-zinc-950/80 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#27272a_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-5/12 shrink-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-xs font-medium text-zinc-400 mb-6 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-glow" />
                Nueva colección 2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mt-4 leading-[1.1] text-white">
                Define tu
                <br />
                <span className="text-gradient-white italic">propio estilo</span>
              </h1>
              <p className="text-zinc-400 mt-5 text-lg leading-relaxed max-w-md">
                Descubre las últimas tendencias en moda moderna. Calidad y diseño en cada prenda.
              </p>
              <div className="flex gap-4 mt-10">
                <Link href="/productos" className="btn-primary">
                  Comprar ahora
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/productos" className="btn-outline">
                  Ver colección
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-7/12 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                <Image
                  src="/images/duki-fashion-week.jfif"
                  alt="Fashion"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group translate-y-8">
                <Image
                  src="/images/cench.jfif"
                  alt="Style"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group -translate-y-8">
                <Image
                  src="/images/roa-pr.jfif"
                  alt="Urban"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                <Image
                  src="/images/centralcee.jfif"
                  alt="Trend"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORÍAS ─── */}
      <ScrollSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white">Categorías</h2>
            <Link href="/productos" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Explorar todo &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden card-glow"
              >
                <Image
                  src={categoryImages[cat.slug] || "/images/placeholder.svg"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <span className="text-white text-lg font-bold tracking-wide block group-hover:translate-x-1 transition-transform duration-300">
                    {cat.name}
                  </span>
                  <span className="text-zinc-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 block">
                    Explorar &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollSection>

      {/* ─── DESTACADOS ─── */}
      <ScrollSection>
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Selección</span>
                <h2 className="text-3xl font-bold mt-1 text-white">Destacados</h2>
              </div>
              <Link href="/productos" className="btn-outline text-sm py-2 px-5">
                Ver todos
              </Link>
            </div>
            {loading ? <ProductGridSkeleton count={8} /> : <ProductGrid products={featuredProducts} />}
          </div>
        </section>
      </ScrollSection>

      {/* ─── NOVEDADES ─── */}
      <ScrollSection>
        <section className="py-24 bg-zinc-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Nuevos ingresos</span>
                <h2 className="text-3xl font-bold mt-1 text-white">Novedades</h2>
              </div>
            </div>
            {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={newProducts} />}
          </div>
        </section>
      </ScrollSection>

      {/* ─── TRUST BADGES ─── */}
      <ScrollSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Por qué elegirnos</span>
            <h2 className="text-3xl font-bold mt-1 text-white">Tu compra segura</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-hover bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-700 transition-colors">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Envío gratis</h3>
              <p className="text-sm text-zinc-500">En pedidos superiores a $80.000</p>
            </div>
            <div className="card-hover bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-700 transition-colors">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Devoluciones gratis</h3>
              <p className="text-sm text-zinc-500">Hasta 30 días después de la compra</p>
            </div>
            <div className="card-hover bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-700 transition-colors">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Pago seguro</h3>
              <p className="text-sm text-zinc-500">Compra protegida con encriptación SSL</p>
            </div>
          </div>
        </section>
      </ScrollSection>
    </div>
  );
}
