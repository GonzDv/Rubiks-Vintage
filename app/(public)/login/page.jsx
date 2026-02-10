"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
    } else {
      // Si el login es exitoso, redirigimos al inventario
      router.push("/inventory");
      router.refresh(); // Refrescamos para que el layout detecte al usuario
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F8F6] px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif italic mb-2">Rubik's <span className="text-gray-400 not-italic">Vintage</span></h1>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Panel de Acceso</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 text-xs p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition disabled:bg-gray-400 mt-4"
          >
            {loading ? "Iniciando sesión..." : "Entrar al Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}