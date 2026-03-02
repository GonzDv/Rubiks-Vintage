"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Camera, Tag, Package, Loader2, Info, Plus, Sparkles, Truck, ShieldCheck } from "lucide-react";
import NotificationSuccess from "@/components/admin/NotificationSuccess";
import Image from "next/image";

export default function InventoryPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    category_id: ""
  });

  useEffect(() => {
    const getCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
      if (data) setCategories(data);
    };
    getCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) return alert("Por favor elige una categoría");
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product_image')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product_image')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { error: dbError } = await supabase
        .from("products")
        .insert([{ 
          name: formData.name, 
          description: formData.description, 
          base_price: parseFloat(formData.base_price),
          category_id: formData.category_id,
          image_url: imageUrl
        }]);

      if (dbError) throw dbError;
      
      setShowSuccess(true);
      setFormData({ name: "", description: "", base_price: "", category_id: "" });
      setPreviewUrl(null);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {showSuccess && <NotificationSuccess />}
      
      <header className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl font-serif text-black italic">Gestión de Inventario</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">Añade nuevas piezas a la colección</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* SECCIÓN A: FORMULARIO */}
        <section className="lg:col-span-7 order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-black/5 space-y-8">
            
            <div className="flex items-center gap-3 border-b border-black/5 pb-6">
              <Plus className="text-[#A07F3A]" size={20} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-black">Detalles de la Nueva Pieza</h2>
            </div>

            <div className="space-y-8">
              {/* Carga de Imagen: Aspecto adaptable */}
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">Fotografía del Producto</label>
                <div className="group relative w-full aspect-video md:aspect-[3/4] border-2 border-dashed border-black/5 rounded-2xl flex flex-col items-center justify-center hover:bg-[#F9F8F6] transition-all cursor-pointer overflow-hidden">
                  {previewUrl ? (
                    <Image src={previewUrl} fill unoptimized className="object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <div className="bg-[#F5F1EB] p-4 rounded-full inline-block mb-3">
                        <Camera className="text-[#A07F3A]" size={24} />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Haz clic para subir</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                </div>
              </div>

              {/* Grid de Inputs: Stack en móvil, 2 cols en tablet+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2">
                    <Package size={12} /> Nombre
                  </label>
                  <input type="text" required placeholder="Ej. Collar Oro Laminado" className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm italic" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2">
                    <Tag size={12} /> Categoría
                  </label>
                  <select required className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm cursor-pointer appearance-none" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                    <option value="" disabled>Seleccionar...</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest text-black font-bold flex items-center gap-2">
                    $ Precio Base (MXN)
                  </label>
                  <input type="number" required placeholder="0.00" className="w-full border-b border-black/10 py-3 focus:border-[#C4A95E] outline-none transition bg-transparent font-serif text-3xl text-black" value={formData.base_price} onChange={(e) => setFormData({...formData, base_price: e.target.value})} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold flex items-center gap-2">
                    <Info size={12} /> Descripción
                  </label>
                  <textarea rows="3" placeholder="Detalles únicos..." className="w-full border border-black/5 rounded-xl p-4 focus:border-[#C4A95E] outline-none bg-[#F9F8F6] text-sm italic font-light resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3 hover:bg-[#A07F3A] transition-all disabled:bg-black/20 shadow-xl shadow-black/10">
              {loading ? <><Loader2 className="animate-spin" size={16} /> Subiendo...</> : "Publicar en la Tienda"}
            </button>
          </form>
        </section>

        {/* SECCIÓN B: PREVISUALIZACIÓN */}
        <aside className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-8">
          <div className="bg-[#F9F8F6] p-6 md:p-10 rounded-3xl border border-black/5 space-y-8">
            <h2 className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-bold text-center">Vista previa del Bazar</h2>
            
            <div className="max-w-[280px] mx-auto bg-white p-4 rounded-2xl shadow-sm border border-black/5">
              <div className="relative aspect-[3/4] bg-[#F5F1EB] rounded-xl overflow-hidden mb-6">
                {previewUrl ? <Image src={previewUrl} fill unoptimized className="object-cover" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center italic text-black/10 text-[10px]">Sin imagen</div>}
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-black truncate">{formData.name || "Nombre de la Pieza"}</h3>
                <p className="text-sm font-serif italic text-[#A07F3A]">${formData.base_price ? parseFloat(formData.base_price).toLocaleString() : "0.00"}</p>
                <div className="pt-3 border-t border-black/5 flex justify-center gap-4">
                   <Truck size={14} className="text-black/10" />
                   <ShieldCheck size={14} className="text-black/10" />
                </div>
              </div>
            </div>

            <div className="bg-white/50 p-4 rounded-xl flex items-center gap-3 border border-black/5">
              <Sparkles size={16} className="text-[#C4A95E]" />
              <p className="text-[9px] text-black/40 italic leading-tight">Así se verá tu pieza en la colección principal de ZÁLEA.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}