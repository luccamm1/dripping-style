"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Order } from "@/lib/types";

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

function getInitialOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("orders");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);

  const persist = useCallback((updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  }, []);

  const addOrder = useCallback(
    (order: Order) => {
      const updated = [...orders, order];
      persist(updated);
    },
    [orders, persist]
  );

  const updateOrder = useCallback(
    (id: string, data: Partial<Order>) => {
      const updated = orders.map((o) =>
        o.id === id ? { ...o, ...data } : o
      );
      persist(updated);
    },
    [orders, persist]
  );

  const deleteOrder = useCallback(
    (id: string) => {
      const updated = orders.filter((o) => o.id !== id);
      persist(updated);
    },
    [orders, persist]
  );

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateOrder, deleteOrder, getOrder }}
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
