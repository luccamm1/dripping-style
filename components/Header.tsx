"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { categories } from "@/lib/categories";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 shadow-[0_1px_20px_-5px_rgba(0,0,0,0.5)]"
          : "bg-zinc-950/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white hover:text-zinc-200 transition-colors">
            <span className="text-white">TKBRON</span>{" "}
            <span className="text-zinc-400 font-normal italic">CLOTHS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="relative text-sm font-medium text-zinc-300 hover:text-white transition-colors
                after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-white
                after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Inicio
            </Link>
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="relative text-sm font-medium text-zinc-300 hover:text-white transition-colors
                  after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-white
                  after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                Productos
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-3 w-48 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-xl shadow-2xl animate-scale-in overflow-hidden">
                  <div className="py-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/productos?categoria=${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative p-2.5 hover:bg-zinc-800/80 rounded-full transition-colors text-zinc-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span key={totalItems} className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-white text-black text-[11px] font-bold rounded-full flex items-center justify-center px-1 animate-pop shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 hover:bg-zinc-800/80 rounded-full transition-colors text-zinc-300"
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

      <div
        className={`md:hidden border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-5 space-y-3">
          <Link href="/" className="block text-sm font-medium text-white" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
          <div className="border-t border-zinc-800/50 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-1">Categorías</p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="block text-sm text-zinc-400 hover:text-white transition-colors py-1.5 px-1"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
