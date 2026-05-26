"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/lib/types";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

async function migrateLocalStorage() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("products");
  if (!stored) return;

  try {
    const res = await fetch("/api/products");
    const existing = await res.json();
    if (Array.isArray(existing) && existing.length > 0) return;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;

    for (const p of parsed) {
      const { id, ...rest } = p;
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
    }

    localStorage.removeItem("products");
  } catch {
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }

    load();
    migrateLocalStorage();
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Error al crear producto");
    const created = await res.json();
    setProducts((prev) => [...prev, created]);
  }, []);

  const updateProduct = useCallback(async (id: number, data: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar producto");
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar producto");
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct }}
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
