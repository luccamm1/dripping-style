"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import ProductGrid from "@/components/ProductGrid";
import Filters from "@/components/Filters";

function ProductosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("categoria") || "";
  const { products } = useProducts();

  const selectedCategory = categoryParam;
  const [selectedSize, setSelectedSize] = useState("");
  const [maxPrice, setMaxPrice] = useState("300000");
  const [sortBy, setSortBy] = useState("");
  const [inStock, setInStock] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    result = result.filter((p) => p.price <= Number(maxPrice));

    if (inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [products, selectedCategory, selectedSize, maxPrice, sortBy, inStock]);

  const resetFilters = () => {
    setSelectedSize("");
    setMaxPrice("300000");
    setSortBy("");
    setInStock(false);
    router.push("/productos");
  };

  return (
    <div className="flex gap-8">
      <Filters
        selectedCategory={selectedCategory}
        selectedSize={selectedSize}
        maxPrice={maxPrice}
        sortBy={sortBy}
        inStock={inStock}
        onCategoryChange={(cat) => router.push(cat ? `/productos?categoria=${cat}` : "/productos")}
        onSizeChange={setSelectedSize}
        onPriceChange={setMaxPrice}
        onSortChange={setSortBy}
        onInStockChange={setInStock}
        onReset={resetFilters}
      />

      {filteredProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-zinc-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          </svg>
          <p className="text-lg font-medium mt-2">No hay productos</p>
          <p className="text-sm mt-1">Prueba con otros filtros</p>
        </div>
      ) : (
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      )}
    </div>
  );
}

export default function ProductosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Todos los productos</h1>
      </div>

      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Cargando...</div>}>
        <ProductosContent />
      </Suspense>
    </div>
  );
}
