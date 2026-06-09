import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] bg-zinc-800 rounded-2xl overflow-hidden mb-3 ring-1 ring-transparent transition-all duration-500 hover:ring-zinc-500/50 hover:shadow-[0_0_30px_-8px_rgba(255,255,255,0.1)]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-[2px]">
            <span className="bg-zinc-900 text-zinc-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-zinc-700">
              Agotado
            </span>
          </div>
        )}
        {product.stock > 0 && product.isNew && (
          <span className="absolute top-3 left-3 bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full tracking-wider shadow-lg z-10">
            NUEVO
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg z-10">
            -{discount}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors line-clamp-1">{product.name}</h3>
      <p className="text-xs text-zinc-600 mt-0.5">{product.material}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-base font-bold text-white">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-xs text-zinc-600 line-through">{formatPrice(product.originalPrice)}</span>
        )}
      </div>
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-[11px] text-orange-400/70 mt-1.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400/60" />
          Últimas {product.stock} unidades
        </p>
      )}
    </Link>
  );
}
