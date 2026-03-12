"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Camera, Tag, Package, Loader2, Info, Plus, Sparkles,
  Truck, ShieldCheck, Pencil, Trash2, X, Search, ImageOff,
  Eye, EyeOff
} from "lucide-react";
import NotificationSuccess from "@/components/admin/NotificationSuccess";
import Image from "next/image";

export const dynamic = 'force-dynamic'

// ─── MODAL EDICIÓN ────────────────────────────────────────────────────────────
function EditModal({ product, categories, onClose, onSaved }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(product.image_url || null);
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    base_price: product.base_price || "",
    category_id: product.category_id || "",
    stock: product.stock ?? 1,
    is_active: product.is_active ?? true,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = product.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product_image").upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from("product_image").getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const stockVal = parseInt(formData.stock);
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          base_price: parseFloat(formData.base_price),
          category_id: formData.category_id,
          image_url: imageUrl,
          stock: stockVal,
          is_active: stockVal > 0 ? formData.is_active : false,
        })
        .eq("id", product.id);

      if (error) throw error;
      onSaved();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-black/5 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-lg font-serif italic text-black">Editar Pieza</h2>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 mt-0.5">{product.name}</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 text-black/30 hover:text-black">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">Fotografía</label>
            <div className="relative w-full aspect-video border-2 border-dashed border-black/10 rounded-2xl overflow-hidden cursor-pointer hover:bg-[#F9F8F6] transition-all group">
              {previewUrl ? (
                <>
                  <Image src={previewUrl} fill unoptimized className="object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-all" size={28} />
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <div className="bg-[#F5F1EB] p-3 rounded-full"><Camera className="text-[#A07F3A]" size={20} /></div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-black/30">Cambiar imagen</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Package size={11} /> Nombre</label>
              <input type="text" required
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm italic"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Tag size={11} /> Categoría</label>
              <select required className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm cursor-pointer appearance-none"
                value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                <option value="" disabled>Seleccionar...</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black font-bold">$ Precio Base (MXN)</label>
              <input type="number" required placeholder="0.00"
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent font-serif text-2xl text-black"
                value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Package size={11} /> Stock disponible</label>
              <input type="number" min="0" required
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent font-serif text-2xl text-black"
                value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Info size={11} /> Descripción</label>
              <textarea rows="3" placeholder="Detalles únicos..."
                className="w-full border border-black/5 rounded-xl p-4 focus:border-[#C4A95E] outline-none bg-[#F9F8F6] text-sm italic font-light resize-none"
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <button type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-[10px] uppercase tracking-widest font-bold transition-all ${
                  formData.is_active ? "border-emerald-100 bg-emerald-50 text-emerald-600" : "border-black/5 bg-black/5 text-black/30"
                }`}>
                {formData.is_active ? <><Eye size={13} /> Visible en la tienda</> : <><EyeOff size={13} /> Oculto en la tienda</>}
              </button>
              {parseInt(formData.stock) <= 0 && (
                <p className="text-[9px] text-amber-500 mt-2">⚠ Stock en 0 — el producto se ocultará automáticamente</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-black/10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black hover:border-black/30 transition-all rounded-xl">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-2 hover:bg-[#A07F3A] transition-all disabled:bg-black/20 rounded-xl">
              {loading ? <><Loader2 className="animate-spin" size={14} /> Guardando...</> : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── FORMULARIO NUEVO PRODUCTO ────────────────────────────────────────────────
function AddProductForm({ categories, onSaved, onCancel }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "", description: "", base_price: "", category_id: "", stock: 1
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) return alert("Por favor elige una categoría");
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product_image").upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from("product_image").getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
      const { error } = await supabase.from("products").insert([{
        name: formData.name,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        category_id: formData.category_id,
        image_url: imageUrl,
        stock: parseInt(formData.stock),
        is_active: true,
      }]);
      if (error) throw error;
      onSaved();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <section className="lg:col-span-7">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-black/5 space-y-8">
          <div className="flex items-center justify-between border-b border-black/5 pb-6">
            <div className="flex items-center gap-3">
              <Plus className="text-[#A07F3A]" size={18} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-black">Nueva Pieza</h2>
            </div>
            <button type="button" onClick={onCancel} className="text-black/20 hover:text-black transition-colors">
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">Fotografía del Producto</label>
            <div className="group relative w-full aspect-video border-2 border-dashed border-black/5 rounded-2xl flex flex-col items-center justify-center hover:bg-[#F9F8F6] transition-all cursor-pointer overflow-hidden">
              {previewUrl
                ? <Image src={previewUrl} fill unoptimized className="object-cover" alt="Preview" />
                : <div className="text-center">
                    <div className="bg-[#F5F1EB] p-4 rounded-full inline-block mb-3"><Camera className="text-[#A07F3A]" size={22} /></div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Haz clic para subir</p>
                  </div>
              }
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Package size={12} /> Nombre</label>
              <input type="text" required placeholder="Ej. Collar Oro Laminado"
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm italic"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Tag size={12} /> Categoría</label>
              <select required className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm cursor-pointer appearance-none"
                value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                <option value="" disabled>Seleccionar...</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black font-bold">$ Precio Base (MXN)</label>
              <input type="number" required placeholder="0.00"
                className="w-full border-b border-black/10 py-3 focus:border-[#C4A95E] outline-none transition bg-transparent font-serif text-3xl text-black"
                value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Package size={12} /> Stock</label>
              <input type="number" min="0" required placeholder="1"
                className="w-full border-b border-black/10 py-3 focus:border-[#C4A95E] outline-none transition bg-transparent font-serif text-3xl text-black"
                value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2"><Info size={12} /> Descripción</label>
              <textarea rows="3" placeholder="Detalles únicos..."
                className="w-full border border-black/5 rounded-xl p-4 focus:border-[#C4A95E] outline-none bg-[#F9F8F6] text-sm italic font-light resize-none"
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3 hover:bg-[#A07F3A] transition-all disabled:bg-black/20 shadow-xl shadow-black/10">
            {loading ? <><Loader2 className="animate-spin" size={16} /> Subiendo...</> : "Publicar en la Tienda"}
          </button>
        </form>
      </section>

      <aside className="lg:col-span-5 lg:sticky lg:top-8">
        <div className="bg-[#F9F8F6] p-6 md:p-10 rounded-3xl border border-black/5 space-y-8">
          <h2 className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-bold text-center">Vista previa del Bazar</h2>
          <div className="max-w-[240px] mx-auto bg-white p-4 rounded-2xl shadow-sm border border-black/5">
            <div className="relative aspect-[3/4] bg-[#F5F1EB] rounded-xl overflow-hidden mb-4">
              {previewUrl
                ? <Image src={previewUrl} fill unoptimized className="object-cover" alt="Preview" />
                : <div className="w-full h-full flex items-center justify-center text-black/10"><ImageOff size={28} strokeWidth={0.8} /></div>
              }
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-black truncate">{formData.name || "Nombre de la Pieza"}</h3>
              <p className="text-sm font-serif italic text-[#A07F3A]">${formData.base_price ? parseFloat(formData.base_price).toLocaleString() : "0.00"}</p>
              <div className="pt-2 border-t border-black/5 flex justify-center gap-4">
                <Truck size={13} className="text-black/10" />
                <ShieldCheck size={13} className="text-black/10" />
              </div>
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-xl flex items-center gap-3 border border-black/5">
            <Sparkles size={15} className="text-[#C4A95E]" />
            <p className="text-[9px] text-black/40 italic leading-tight">Así se verá tu pieza en la colección principal de ZÁLEA.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function InventoryPage() {
  const supabase = createClient();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
    const getCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name").order("name");
      if (data) setCategories(data);
    };
    getCategories();
  }, []);

  const handleSaved = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setShowSuccess(true);
    fetchProducts();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta pieza de la colección?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleToggleActive = async (product) => {
    await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    fetchProducts();
  };

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (filter === "active") return p.is_active;
      if (filter === "hidden") return !p.is_active;
      return true;
    });

  const hiddenCount = products.filter((p) => !p.is_active).length;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {showSuccess && <NotificationSuccess />}
      {editingProduct && (
        <EditModal product={editingProduct} categories={categories}
          onClose={() => setEditingProduct(null)} onSaved={handleSaved} />
      )}

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-black italic">Gestión de Inventario</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold mt-1">
            {products.length} {products.length === 1 ? "pieza en colección" : "piezas en colección"}
            {hiddenCount > 0 && (
              <span className="ml-2 text-amber-500">· {hiddenCount} agotada{hiddenCount > 1 ? "s" : ""}</span>
            )}
          </p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all rounded-full ${
            showAddForm ? "bg-black/5 text-black/40 hover:bg-black/10" : "bg-black text-white hover:bg-[#A07F3A]"
          }`}>
          {showAddForm ? <><X size={14} /> Cancelar</> : <><Plus size={14} /> Nueva Pieza</>}
        </button>
      </header>

      {showAddForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <AddProductForm categories={categories} onSaved={handleSaved} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {!showAddForm && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
              <input type="text" placeholder="Buscar pieza..."
                className="w-full bg-white border border-black/5 rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C4A95E] transition"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {[["all", "Todas"], ["active", "Visibles"], ["hidden", "Agotadas"]].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)}
                  className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all ${
                    filter === val ? "bg-black text-white" : "bg-white border border-black/5 text-black/40 hover:text-black"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-20 text-black/20">
              <Loader2 className="animate-spin" size={28} strokeWidth={1} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-black/20 space-y-3">
              <ImageOff size={40} strokeWidth={0.5} className="mx-auto" />
              <p className="text-[10px] uppercase tracking-[0.3em]">{search ? "Sin resultados" : "No hay piezas aún"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <div key={product.id} className={`group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all ${
                  !product.is_active ? "border-amber-100 opacity-60" : "border-black/5"
                }`}>
                  <div className="relative aspect-3/4 bg-[#F5F1EB] overflow-hidden">
                    {product.image_url ? (
                      <Image src={product.image_url} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/10"><ImageOff size={24} strokeWidth={0.8} /></div>
                    )}
                    {!product.is_active && (
                      <div className="absolute top-2 left-2 bg-amber-400 text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-full">
                        Agotado
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => setEditingProduct(product)}
                        className="bg-white text-black p-2.5 rounded-full hover:bg-[#A07F3A] hover:text-white transition-all shadow-lg">
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                      <button onClick={() => handleToggleActive(product)}
                        className={`bg-white text-black p-2.5 rounded-full transition-all shadow-lg ${
                          product.is_active ? "hover:bg-amber-400 hover:text-white" : "hover:bg-emerald-500 hover:text-white"
                        }`} title={product.is_active ? "Ocultar" : "Reactivar"}>
                        {product.is_active ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="bg-white text-black p-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg">
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black truncate">{product.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-serif text-[#A07F3A]">${parseFloat(product.base_price).toLocaleString()} MXN</p>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${
                        (product.stock ?? 0) <= 0 ? "text-amber-400" : "text-emerald-500"
                      }`}>
                        Stock: {product.stock ?? 0}
                      </p>
                    </div>
                    {product.categories?.name && (
                      <p className="text-[9px] text-black/25 uppercase tracking-wider">{product.categories.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}