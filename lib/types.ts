export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  material: string;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
  date: string;
  status: "pendiente" | "pagado" | "fallido" | "enviado" | "entregado" | "cancelado";
  preferenceId?: string;
  paymentId?: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export type Category = {
  id: string;
  name: string;
  slug: string;
};
