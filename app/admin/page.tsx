"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useOrders } from "@/context/OrdersContext";
import { Product, Order } from "@/lib/types";
import { categories } from "@/lib/categories";
import { fileToDataUrl } from "@/lib/utils";

export default function AdminPage() {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, deleteOrder } = useOrders();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "remeras",
    sizes: "",
    colors: "",
    material: "",
    images: [] as string[],
    stock: "",
    isNew: false,
    isFeatured: false,
  });

  const [tab, setTab] = useState<"products" | "orders">("products");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const dataUrl = await fileToDataUrl(files[i]);
      newImages.push(dataUrl);
    }
    setPreviewImages((prev) => [...prev, ...newImages]);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openNewForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "camisetas",
      sizes: "",
      colors: "",
      material: "",
      images: [],
      stock: "",
      isNew: false,
      isFeatured: false,
    });
    setPreviewImages([]);
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    const existingImages = product.images.filter((img) => img.startsWith("data:"));
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category,
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      material: product.material,
      images: existingImages,
      stock: product.stock != null ? product.stock.toString() : "0",
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
    });
    setPreviewImages(existingImages);
    setEditingProduct(product);
    setShowForm(true);
  };

  const [slugError, setSlugError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    const duplicate = products.find(
      (p) => p.slug === slug && (!editingProduct || p.id !== editingProduct.id)
    );
    if (duplicate) {
      setSlugError("Ya existe un producto con este slug");
      return;
    }
    setSlugError("");
    const productData = {
      name: form.name,
      slug,
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      images: form.images.length ? form.images : ["/images/placeholder.svg"],
      stock: Number(form.stock) || 0,
      category: form.category,
      sizes: form.sizes.split(",").map((s) => s.trim()),
      colors: form.colors.split(",").map((c) => c.trim()),
      material: form.material,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      rating: 0,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch {
      alert("Error al guardar el producto");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await deleteProduct(id);
      } catch {
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-red-500 underline underline-offset-2 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-zinc-800">
        <button
          onClick={() => setTab("products")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "products" ? "border-white text-white" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Productos ({products.length})
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "orders" ? "border-white text-white" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Pedidos ({orders.length})
        </button>
      </div>

      {tab === "products" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={openNewForm}
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              + Nuevo producto
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-zinc-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {editingProduct ? "Editar producto" : "Nuevo producto"}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Nombre</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Slug</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => {
                          setForm({ ...form, slug: e.target.value });
                          setSlugError("");
                        }}
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        required
                      />
                      {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Precio ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Precio original ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.originalPrice}
                        onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Tallas (separadas por coma)</label>
                      <input
                        type="text"
                        value={form.sizes}
                        onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Colores (separados por coma)</label>
                      <input
                        type="text"
                        value={form.colors}
                        onChange={(e) => setForm({ ...form, colors: e.target.value })}
                        placeholder="Negro, Blanco, Rojo"
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Categoría</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Material</label>
                      <input
                        type="text"
                        value={form.material}
                        onChange={(e) => setForm({ ...form, material: e.target.value })}
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Imágenes</label>
                      <div className="flex flex-wrap gap-3">
                        {previewImages.map((img, i) => (
                          <div key={i} className="relative w-20 h-24 bg-zinc-800 rounded-lg overflow-hidden group">
                            <Image
                              src={img}
                              alt={`Imagen ${i + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <label className="w-20 h-24 bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 transition-colors text-zinc-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs mt-1">Agregar</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-300">Stock (unidades)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        required
                      />
                    </div>
                    <div className="col-span-2 flex gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={form.isNew}
                          onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                          className="accent-white"
                        />
                        Nuevo
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={form.isFeatured}
                          onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                          className="accent-white"
                        />
                        Destacado
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                    >
                      {editingProduct ? "Guardar cambios" : "Crear producto"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 border border-zinc-700 text-zinc-300 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Nombre</th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Categoría</th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Precio</th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Estado</th>
                    <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-zinc-400 capitalize">{product.category}</td>
                      <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {product.isNew && <span className="text-xs bg-white text-black px-2 py-0.5 rounded-full">Nuevo</span>}
                          {product.isFeatured && <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">Destacado</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEditForm(product)}
                          className="text-zinc-400 hover:text-white mr-3 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "orders" && (
        <>
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-zinc-400">{selectedOrders.length} seleccionados</span>
              <button
                onClick={() => {
                  if (window.confirm(`¿Eliminar ${selectedOrders.length} pedidos?`)) {
                    selectedOrders.forEach(deleteOrder);
                    setSelectedOrders([]);
                  }
                }}
                className="text-sm text-red-500 hover:text-red-400 underline underline-offset-2 transition-colors"
              >
                Eliminar seleccionados
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="text-sm text-zinc-500 hover:text-zinc-400 underline underline-offset-2 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={orders.length > 0 && selectedOrders.length === orders.length}
                        onChange={() => {
                          if (selectedOrders.length === orders.length) {
                            setSelectedOrders([]);
                          } else {
                            setSelectedOrders(orders.map((o) => o.id));
                          }
                        }}
                        className="accent-white"
                      />
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Pedido</th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Cliente</th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Fecha</th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Total</th>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Estado</th>
                    <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-zinc-400">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">No hay pedidos</td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const statusColors: Record<string, string> = {
                        pendiente: "bg-yellow-100 text-yellow-800",
                        pagado: "bg-green-100 text-green-800",
                        fallido: "bg-red-100 text-red-800",
                        enviado: "bg-blue-100 text-blue-800",
                        entregado: "bg-green-100 text-green-800",
                        cancelado: "bg-red-100 text-red-800",
                      };
                      const statusLabels: Record<string, string> = {
                        pendiente: "Pendiente",
                        pagado: "Pagado",
                        fallido: "Fallido",
                        enviado: "Enviado",
                        entregado: "Entregado",
                        cancelado: "Cancelado",
                      };
                      const isSelected = selectedOrders.includes(order.id);
                      return (
                      <tr key={order.id} className={`hover:bg-zinc-800/50 ${isSelected ? "bg-zinc-800/30" : ""}`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedOrders((prev) =>
                                prev.includes(order.id)
                                  ? prev.filter((id) => id !== order.id)
                                  : [...prev, order.id]
                              );
                            }}
                            className="accent-white"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{order.id}</td>
                        <td className="px-4 py-3">{order.shippingInfo?.name || "—"}</td>
                        <td className="px-4 py-3 text-zinc-400">{order.date}</td>
                        <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="text-zinc-400 hover:text-white mr-3 transition-colors text-sm"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar pedido ${order.id}?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="text-zinc-400 hover:text-red-500 transition-colors text-sm"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {viewingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewingOrder(null)}>
              <div className="bg-zinc-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4 border border-zinc-800" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Pedido {viewingOrder.id}</h2>
                  <button
                    onClick={() => setViewingOrder(null)}
                    className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Cliente</h3>
                    <div className="bg-zinc-800 rounded-lg p-3 space-y-1.5 text-sm">
                      <p><span className="text-zinc-400">Nombre:</span> {viewingOrder.shippingInfo?.name || "—"}</p>
                      <p><span className="text-zinc-400">Email:</span> {viewingOrder.shippingInfo?.email || "—"}</p>
                      <p><span className="text-zinc-400">Teléfono:</span> {viewingOrder.shippingInfo?.phone || "—"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Dirección de envío</h3>
                    <div className="bg-zinc-800 rounded-lg p-3 space-y-1.5 text-sm">
                      <p>{viewingOrder.shippingInfo?.address || "—"}</p>
                      <p>{viewingOrder.shippingInfo?.city}, {viewingOrder.shippingInfo?.state} — CP: {viewingOrder.shippingInfo?.zip || "—"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Productos</h3>
                    <div className="bg-zinc-800 rounded-lg p-3 space-y-2">
                      {viewingOrder.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-zinc-300">
                            {item.product.name} ({item.selectedSize}/{item.selectedColor}) x{item.quantity}
                          </span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-700 pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Subtotal</span>
                      <span>${viewingOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Envío</span>
                      <span>{viewingOrder.shipping === 0 ? <span className="text-green-500">Gratis</span> : `$${viewingOrder.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-1">
                      <span>Total</span>
                      <span>${viewingOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-zinc-500">{viewingOrder.date}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      viewingOrder.status === "pagado" ? "bg-green-100 text-green-800" :
                      viewingOrder.status === "pendiente" ? "bg-yellow-100 text-yellow-800" :
                      viewingOrder.status === "fallido" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {viewingOrder.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
