import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] bg-zinc-800 rounded-xl overflow-hidden mb-3">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full">
              Agotado
            </span>
          </div>
        )}
        {product.stock > 0 && product.isNew && (
          <span className="absolute top-3 left-3 bg-white text-black text-xs font-medium px-2.5 py-1 rounded-full">
            Nuevo
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-white line-clamp-1">{product.name}</h3>
      <p className="text-xs text-zinc-400 mt-0.5">{product.material}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-xs text-zinc-500 line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs text-orange-500 mt-1">Últimas {product.stock} unidades</p>
      )}
    </Link>
  );
}
