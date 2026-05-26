"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Product } from "@/lib/types";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function migrateProduct(p: Record<string, unknown>): Product {
  return {
    ...p,
    stock: (p.stock as number) ?? 0,
    rating: (p.rating as number) ?? 0,
    sizes: (p.sizes as string[]) ?? [],
    colors: (p.colors as string[]) ?? [],
    images: (p.images as string[]) ?? ["/images/placeholder.svg"],
  } as Product;
}

function deduplicateSlugs(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.map((p) => {
    let slug = p.slug;
    let i = 2;
    while (seen.has(slug)) {
      slug = `${p.slug}-${i}`;
      i++;
    }
    seen.add(slug);
    return { ...p, slug };
  });
}

function getInitialProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("products");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return deduplicateSlugs(parsed.map(migrateProduct));
      }
      return [];
    } catch {
      return [];
    }
  }
  return [];
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(getInitialProducts);

  const persist = useCallback((updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  }, []);

  const addProduct = useCallback(
    (product: Omit<Product, "id">) => {
      const newId =
        products.length > 0
          ? Math.max(...products.map((p) => p.id)) + 1
          : 1;
      const updated = [...products, { ...product, id: newId }];
      persist(updated);
    },
    [products, persist]
  );

  const updateProduct = useCallback(
    (id: number, data: Partial<Product>) => {
      const updated = products.map((p) =>
        p.id === id ? { ...p, ...data } : p
      );
      persist(updated);
    },
    [products, persist]
  );

  const deleteProduct = useCallback(
    (id: number) => {
      const updated = products.filter((p) => p.id !== id);
      persist(updated);
    },
    [products, persist]
  );

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
