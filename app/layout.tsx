import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { OrdersProvider } from "@/context/OrdersContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dripping Style - Tienda de Ropa Moderna",
  description: "Descubre las últimas tendencias en moda. Ropa moderna para hombre y mujer.",
  icons: {
    icon: "/favicon.jpg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-zinc-950 text-zinc-100">
        <ProductsProvider>
          <CartProvider>
            <OrdersProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </OrdersProvider>
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
