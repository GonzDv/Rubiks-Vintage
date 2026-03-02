"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  Store,
  Shield,
  Bell,
  Save,
  Loader2,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import NotificationSuccess from "@/components/admin/NotificationSuccess";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [store, setStore] = useState({
    store_name: "",
    contact_email: "",
    shipping_fee: 0,
    announcement_bar: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileData) setProfile(profileData);

        const { data: storeData } = await supabase
          .from("store_config")
          .select("*")
          .limit(1)
          .single();
        if (storeData) setStore(storeData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
        })
        .eq("id", user.id);

      await supabase.from("store_config").update(store).eq("id", store.id);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center italic text-black/20">
        Cargando configuración de ZÁLEA...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {showSuccess && <NotificationSuccess />}

      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif italic text-black">
          Configuración
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">
          Personaliza la experiencia de tu marca
        </p>
      </header>

      <form onSubmit={handleUpdateSettings} className="space-y-10">
        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-black/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <User size={18} className="text-[#A07F3A]" />
            <h2 className="text-[10px] uppercase tracking-widest font-bold">
              Información del Administrador
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">
                Nombre
              </label>
              <input
                type="text"
                value={profile.first_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, first_name: e.target.value })
                }
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent italic text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">
                Apellido
              </label>
              <input
                type="text"
                value={profile.last_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, last_name: e.target.value })
                }
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent italic text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">
                Correo Electrónico (Solo lectura)
              </label>
              <div className="flex items-center gap-2 text-black/30 py-2 italic text-sm">
                <Mail size={14} /> {profile.email}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-black/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <Store size={18} className="text-[#A07F3A]" />
            <h2 className="text-[10px] uppercase tracking-widest font-bold">
              Detalles de la Boutique
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
  <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">Nombre del Bazar</label>
  <input 
    type="text" 
    value={store.store_name || ""} 
    onChange={(e) => setStore({...store, store_name: e.target.value})}
    className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent font-serif italic text-lg" 
  />
</div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">
                Costo de Envío (MXN)
              </label>
              <input
                type="number"
                value={store.shipping_fee}
                onChange={(e) =>
                  setStore({ ...store, shipping_fee: e.target.value })
                }
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent font-serif text-lg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold">
                Barra de Anuncios (Texto en el Top)
              </label>
              <input
                type="text"
                placeholder="Ej. Envío gratis en compras mayores a $999"
                value={store.announcement_bar}
                onChange={(e) =>
                  setStore({ ...store, announcement_bar: e.target.value })
                }
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-[#F9F8F6] px-4 rounded-t-md text-xs italic"
              />
            </div>
          </div>
        </section>

        {/* BOTÓN GUARDAR FLOTANTE */}
        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-64 bg-black text-white py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3 hover:bg-[#A07F3A] transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
