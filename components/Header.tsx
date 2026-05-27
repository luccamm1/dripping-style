"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { categories } from "@/lib/categories";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCatClick = () => {
    setCatOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            Dripping Style
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Inicio
            </Link>
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Productos
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/productos?categoria=${cat.slug}`}
                      onClick={handleCatClick}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-sm font-medium text-white" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="block text-sm text-zinc-400 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
