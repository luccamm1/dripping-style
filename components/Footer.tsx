import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Dripping Style
            </h3>
            <p className="text-sm text-zinc-500">
              Tu tienda de ropa moderna con las últimas tendencias.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Tienda
            </h4>
            <ul className="space-y-2">
              <li><Link href="/productos" className="text-sm hover:text-white transition-colors">Todos los productos</Link></li>
              <li><Link href="/productos?categoria=nuevos" className="text-sm hover:text-white transition-colors">Nuevos</Link></li>
              <li><Link href="/productos?categoria=destacados" className="text-sm hover:text-white transition-colors">Destacados</Link></li>
              <li><Link href="/admin" className="text-sm hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Categorías
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/productos?categoria=${cat.slug}`} className="text-sm hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>dripingstore@gmail.com</li>
              <li>+54 9 381 648 8648</li>
              <li>Argentina, Tucumán</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Dripping Style. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
