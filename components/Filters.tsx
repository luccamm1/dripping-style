"use client";

import { useState } from "react";
import { categories } from "@/lib/categories";

interface FiltersProps {
  selectedCategory: string;
  selectedSize: string;
  maxPrice: string;
  sortBy: string;
  inStock: boolean;
  onCategoryChange: (cat: string) => void;
  onSizeChange: (size: string) => void;
  onPriceChange: (price: string) => void;
  onSortChange: (sort: string) => void;
  onInStockChange: (inStock: boolean) => void;
  onReset: () => void;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Única"];

export default function Filters({
  selectedCategory,
  selectedSize,
  maxPrice,
  sortBy,
  inStock,
  onCategoryChange,
  onSizeChange,
  onPriceChange,
  onSortChange,
  onInStockChange,
  onReset,
}: FiltersProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtersContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Categoría
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`block text-sm transition-colors ${selectedCategory === "" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`block text-sm transition-colors ${selectedCategory === cat.slug ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Talla
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(selectedSize === size ? "" : size)}
              className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${
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

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Precio máximo
        </h3>
        <input
          type="range"
          min="0"
          max="300"
          step="10"
          value={maxPrice}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full accent-white"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>$0</span>
          <span>${maxPrice}</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="accent-white"
          />
          Solo en stock
        </label>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Ordenar
        </h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-zinc-700 bg-zinc-800 text-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
        >
          <option value="">Relevancia</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
          <option value="name-asc">A - Z</option>
          <option value="name-desc">Z - A</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="w-full text-sm text-zinc-400 hover:text-white underline underline-offset-2 transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="md:hidden flex items-center gap-2 text-sm font-medium mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
      </button>

      <aside className="hidden md:block w-56 flex-shrink-0">
        {filtersContent}
      </aside>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-zinc-950 p-6 overflow-y-auto shadow-xl border-r border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filtersContent}
          </div>
        </div>
      )}
    </>
  );
}
