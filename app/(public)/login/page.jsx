"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isRegistering && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("¡Registro exitoso! Revisa tu correo para confirmar.");
        setIsRegistering(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Credenciales inválidas.");
      } else {
        router.push("/inventory");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F5F1EB] px-4 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-black/5">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif italic mb-3 text-black tracking-tight">ZÁLEA</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C4A95E] font-bold">
            {isRegistering ? "Únete a la Colección" : "Panel de Acceso"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold">Nombre</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Ana"
                  className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold">Apellido</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Pérez"
                  className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold">Email</label>
              <input 
                type="email" 
                required
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold">Contraseña</label>
              <input 
                type="password" 
                required
                className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
            {isRegistering && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[9px] uppercase tracking-[0.3em] text-black/40 mb-2 font-bold">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  required
                  className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none transition bg-transparent text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          

          <button 
            disabled={loading}
            className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black/90 transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (isRegistering ? "Crear Cuenta" : "Entrar")}
          </button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full mt-6 text-[9px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors font-bold"
          >
            {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </button>
        </form>
      </div>
    </div>
  );
}