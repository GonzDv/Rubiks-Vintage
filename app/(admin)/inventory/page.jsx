"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Camera, Tag, Package, Loader2, Info, Plus } from "lucide-react";
import NotificationSuccess from "@/components/admin/NotificationSuccess";
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
      console.log("Categorías cargadas:", data);
      if (data) setCategories(data);
      if (error) console.error("Error cargando categorías:", error.message);
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
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {showSuccess && <NotificationSuccess />}
      {/* Header de la página */}
      <header className="mb-10">
        <h1 className="text-3xl font-serif text-black italic">Gestión de Inventario</h1>
        <p className="text-sm text-gray-500 mt-2 font-light tracking-wide uppercase">Añade nuevas piezas a la colección Rubik's Vintage</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* SECCIÓN A: FORMULARIO (8 columnas en desktop) */}
        <section className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
              <Plus className="text-black" size={24} />
              <h2 className="text-lg font-medium text-gray-900 tracking-tight">Detalles de la Nueva Pieza</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Carga de Imagen - Span full on mobile */}
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3 font-semibold">Fotografía del Producto</label>
                <div className="group relative w-full h-64 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-black hover:bg-gray-50/50 transition-all cursor-pointer overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                  ) : (
                    <div className="text-center text-gray-400 p-6">
                      <div className="bg-gray-50 p-4 rounded-full inline-block mb-3 group-hover:bg-white transition-colors">
                        <Camera className="mx-auto" size={28} />
                      </div>
                      <p className="text-[11px] uppercase tracking-widest font-medium text-gray-500">Arrastra o haz clic para subir</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-light italic">Recomendado: 3:4 ratio, fondo neutro</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                </div>
              </div>

              {/* Input Nombre */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold flex items-center gap-2">
                  <Package size={12} /> Nombre de la pieza
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Collar Oro Laminado"
                  className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition bg-transparent text-sm placeholder:text-gray-300 placeholder:italic"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Select Categoría */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold flex items-center gap-2">
                  <Tag size={12} /> Categoría
                </label>
                <div className="relative">
                  <select 
                    required
                    className="w-full border-b border-gray-200 py-3 focus:border-black outline-none bg-transparent cursor-pointer appearance-none text-sm pr-10"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Plus size={14} className="rotate-45" />
                  </div>
                </div>
              </div>

              {/* Input Precio */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-black font-bold flex items-center gap-2">
                  $ Precio Base (MXN)
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition bg-transparent font-serif text-2xl text-black placeholder:text-gray-200"
                  value={formData.base_price}
                  onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                />
              </div>

              {/* Input Descripción */}
              <div className="md:col-span-2 space-y-1 mt-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold flex items-center gap-2">
                  <Info size={12} /> Descripción / Detalles
                </label>
                <textarea 
                  rows="3"
                  placeholder="Detalles únicos, medidas o cuidados especiales..."
                  className="w-full border border-gray-100 rounded-lg p-4 focus:border-black focus:ring-1 focus:ring-black/5 outline-none transition bg-gray-50/30 text-sm placeholder:text-gray-300 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="mt-12 w-full bg-black text-white py-5 text-[11px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3 hover:bg-[#1A1A1A] active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl shadow-black/10"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Subiendo Tesoro...</span>
                </>
              ) : (
                "Publicar en la Tienda"
              )}
            </button>
          </form>
        </section>

        {/* SECCIÓN B: VISTA PREVIA (4 columnas en desktop, Sticky) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-[#F9F8F6] p-8 rounded-2xl border border-gray-100">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8 font-bold border-b border-gray-200 pb-2">
              Previsualización de Catálogo
            </h2>
            
            <div className="group bg-white p-4 shadow-sm rounded-lg">
              <div className="aspect-[3/4] bg-gray-50 mb-6 overflow-hidden relative rounded-md">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#F9F8F6] p-4 text-center">
                    <p className="text-[10px] text-gray-300 uppercase italic tracking-widest">Esperando imagen</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-sm font-medium text-black uppercase tracking-wider leading-tight">
                    {formData.name || "Nombre de la Pieza"}
                  </h3>
                  <p className="text-xs font-bold text-gray-900">
                    ${formData.base_price ? parseFloat(formData.base_price).toLocaleString() : "0.00"}
                  </p>
                </div>
                
                <p className="text-[10px] text-gray-400 font-light leading-relaxed line-clamp-3">
                  {formData.description || "Aquí aparecerá la descripción de tu pieza. Intenta ser descriptivo para captar la atención del cliente."}
                </p>

                <div className="pt-4 mt-2 border-t border-gray-50">
                   <div className="inline-block px-2 py-1 bg-black text-[8px] text-white uppercase tracking-widest font-bold rounded">
                    {categories.find(c => c.id === formData.category_id)?.name || "Categoría"}
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-gray-400 text-[10px] italic">
              <Info size={12} />
              <span>Así es como tus clientes verán el producto en el bazar.</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}