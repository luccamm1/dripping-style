import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] bg-zinc-800 rounded-xl overflow-hidden mb-3 ring-1 ring-transparent hover:ring-zinc-600 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-500" />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <span className="bg-zinc-900 text-zinc-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-zinc-700">
              Agotado
            </span>
          </div>
        )}
        {product.stock > 0 && product.isNew && (
          <span className="absolute top-3 left-3 bg-white text-black text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide shadow-lg">
            NUEVO
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg">
            -{discount}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors line-clamp-1">{product.name}</h3>
      <p className="text-xs text-zinc-500 mt-0.5">{product.material}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-sm font-bold text-white">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-xs text-zinc-600 line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-[11px] text-orange-400/80 mt-1">Últimas {product.stock} unidades</p>
      )}
    </Link>
  );
}
