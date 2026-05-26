"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Order } from "@/lib/types";

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

async function migrateLocalStorage() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("orders");
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) return;
    for (const order of parsed) {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    }
    localStorage.removeItem("orders");
  } catch {
    // ignore migration errors
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await migrateLocalStorage();
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
      setLoading(false);
    })();
  }, []);

  const addOrder = useCallback(async (order: Order) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const created = await res.json();
      setOrders((prev) => [created, ...prev]);
    }
  }, []);

  const updateOrder = useCallback(async (id: string, data: Partial<Order>) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateOrder, deleteOrder, getOrder, loading }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
