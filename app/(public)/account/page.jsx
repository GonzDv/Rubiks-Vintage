"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  User,
  Lock,
  MapPin,
  Loader2,
  ChevronRight,
  Check,
  X,
  Eye,
  EyeOff,
  Package,
} from "lucide-react";

const STATUS_STYLES = {
  pagado: { label: "Pagado", classes: "bg-emerald-50 text-emerald-600" },
  pendiente: { label: "Pendiente", classes: "bg-amber-50 text-amber-600" },
  enviado: { label: "Enviado", classes: "bg-blue-50 text-blue-600" },
  entregado: { label: "Entregado", classes: "bg-black/5 text-black/50" },
  cancelado: { label: "Cancelado", classes: "bg-red-50 text-red-400" },
};

const SECTIONS = [
  { id: "orders", label: "Mis Pedidos", icon: ShoppingBag },
  { id: "profile", label: "Mi Perfil", icon: User },
  { id: "password", label: "Contraseña", icon: Lock },
  { id: "address", label: "Dirección", icon: MapPin },
];

function Feedback({ type, message }) {
  if (!message) return null;
  return (
    <div
      className={`flex items-start gap-2 px-4 py-3 rounded-xl text-[10px] border ${
        type === "success"
          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
          : "bg-red-50 border-red-100 text-red-500"
      }`}
    >
      {type === "success" ? (
        <Check size={12} className="shrink-0 mt-0.5" strokeWidth={2.5} />
      ) : (
        <X size={12} className="shrink-0 mt-0.5" strokeWidth={2} />
      )}
      {message}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-[9px] uppercase tracking-widest text-black/40 font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}

function OrdersSection({ userId }) {
  const supabase = createClient();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("orders")
        .select(
          "*, item_order(id, quantity, unit_price, product_id, products(name, image_url))",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-black/20">
        <Loader2 className="animate-spin" size={24} strokeWidth={1} />
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center py-20 text-black/20">
        <Package size={40} strokeWidth={0.5} className="mx-auto mb-4" />
        <p className="text-[10px] uppercase tracking-widest">
          Aún no tienes pedidos
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const status = STATUS_STYLES[order.status] || STATUS_STYLES.pendiente;
        const isOpen = expanded === order.id;
        return (
          <div
            key={order.id}
            className="border border-black/5 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : order.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F5F1EB]/50 transition-colors"
            >
              <div className="flex items-center gap-4 text-left">
                <div>
                  <p className="text-[10px] font-mono text-black/40">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs font-bold text-black mt-0.5">
                    ${parseFloat(order.total_amount).toLocaleString("es-MX")}{" "}
                    MXN
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${status.classes}`}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-black/25 hidden sm:block">
                  {new Date(order.created_at).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <ChevronRight
                  size={14}
                  className={`text-black/20 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-5 border-t border-black/5 bg-[#F9F8F6] space-y-4 pt-4">
                {order.shipping_address && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-black/30 mb-1">
                      Dirección de envío
                    </p>
                    <p className="text-xs text-black/60">
                      {order.shipping_address}
                    </p>
                  </div>
                )}
                {order.item_order?.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-black/30 mb-2">
                      Productos
                    </p>
                    <div className="space-y-1.5">
                      {order.item_order.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-xs"
                        >
                          <p className="text-xs text-black/70 truncate">
                            {item.products?.name || "Producto"} ×{" "}
                            {item.quantity}
                          </p>
                          <span className="text-[#A07F3A] font-serif">
                            $
                            {(item.unit_price * item.quantity).toLocaleString(
                              "es-MX",
                            )}{" "}
                            MXN
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Sección: Perfil ───────────────────────────────────────────────────────────
function ProfileSection({ user }) {
  const supabase = createClient();
  const [firstName, setFirstName] = useState(
    user?.user_metadata?.first_name || "",
  );
  const [lastName, setLastName] = useState(
    user?.user_metadata?.last_name || "",
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      },
    });
    setFeedback(
      error
        ? {
            type: "error",
            message: "No se pudo guardar. Intenta de nuevo.",
          }
        : {
            type: "success",
            message: "Perfil actualizado correctamente.",
          },
    );
    setSaving(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Nombre">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm italic"
          />
        </Field>
        <Field label="Apellido">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm italic"
          />
        </Field>
      </div>
      <Field label="Correo electrónico">
        <div className="flex items-center gap-2 py-2 text-sm text-black/30 border-b border-black/5">
          {user?.email}
          <span className="text-[8px] bg-black/5 px-2 py-0.5 rounded-full uppercase tracking-widest ml-auto">
            Solo lectura
          </span>
        </div>
      </Field>
      <Feedback {...(feedback || {})} />
      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#A07F3A] transition-colors disabled:opacity-40 flex items-center gap-2"
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Check size={14} strokeWidth={2.5} />
        )}
        Guardar Cambios
      </button>
    </form>
  );
}

// ── Sección: Contraseña ───────────────────────────────────────────────────────
function PasswordSection() {
  const supabase = createClient();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setFeedback({
        type: "error",
        message: "Las contraseñas no coinciden.",
      });
      return;
    }
    if (newPass.length < 8) {
      setFeedback({
        type: "error",
        message: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      password: newPass,
    });
    setFeedback(
      error
        ? {
            type: "error",
            message: "No se pudo cambiar la contraseña.",
          }
        : {
            type: "success",
            message: "Contraseña actualizada correctamente.",
          },
    );
    if (!error) {
      setCurrent("");
      setNewPass("");
      setConfirm("");
    }
    setSaving(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const inputClass =
    "w-full border-b border-black/10 py-2 pr-8 focus:border-[#C4A95E] outline-none bg-transparent text-sm";

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-sm">
      <Field label="Nueva Contraseña">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className={inputClass}
            required
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
          >
            {show ? (
              <EyeOff size={14} strokeWidth={1.5} />
            ) : (
              <Eye size={14} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </Field>
      <Field label="Confirmar Nueva Contraseña">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
            required
          />
          {confirm && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2">
              {confirm === newPass ? (
                <Check
                  size={12}
                  className="text-emerald-500"
                  strokeWidth={2.5}
                />
              ) : (
                <X size={12} className="text-red-400" strokeWidth={2} />
              )}
            </span>
          )}
        </div>
      </Field>
      <Feedback {...(feedback || {})} />
      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#A07F3A] transition-colors disabled:opacity-40 flex items-center gap-2"
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Lock size={14} strokeWidth={1.5} />
        )}
        Cambiar Contraseña
      </button>
    </form>
  );
}

// ── Sección: Dirección ────────────────────────────────────────────────────────
function AddressSection({ user }) {
  const supabase = createClient();
  const [address, setAddress] = useState(
    user?.user_metadata?.default_address || "",
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { default_address: address },
    });
    setFeedback(
      error
        ? {
            type: "error",
            message: "No se pudo guardar la dirección.",
          }
        : {
            type: "success",
            message: "Dirección guardada correctamente.",
          },
    );
    setSaving(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-lg">
      <Field label="Dirección de Envío Predeterminada">
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="Calle, número, colonia, ciudad, estado, CP"
          className="w-full border-b border-black/10 py-2 focus:border-[#C4A95E] outline-none bg-transparent text-sm italic resize-none leading-relaxed"
        />
      </Field>
      <p className="text-[9px] text-black/25">
        Esta dirección se usará como predeterminada al hacer un pedido.
      </p>
      <Feedback {...(feedback || {})} />
      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#A07F3A] transition-colors disabled:opacity-40 flex items-center gap-2"
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <MapPin size={14} strokeWidth={1.5} />
        )}
        Guardar Dirección
      </button>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("orders");

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EB] text-black/20">
        <Loader2 className="animate-spin" size={28} strokeWidth={1} />
      </div>
    );

  const firstName = user?.user_metadata?.first_name || "Cliente";
  const active = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-[#F5F1EB] pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold mb-2">
            Mi Cuenta
          </p>
          <h1 className="text-4xl font-serif italic text-black">
            Hola, {firstName}.
          </h1>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="w-full md:w-56 shrink-0">
            <nav className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-[10px] uppercase tracking-widest font-bold transition-all border-b border-black/5 last:border-0
                      ${
                        isActive
                          ? "bg-black text-white"
                          : "text-black/40 hover:bg-[#F5F1EB] hover:text-black"
                      }`}
                  >
                    <section.icon size={14} strokeWidth={isActive ? 2 : 1.5} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* CONTENIDO */}
          <main className="flex-1 bg-white rounded-2xl border border-black/5 shadow-sm p-8">
            <h2 className="text-lg font-serif italic text-black mb-6 pb-4 border-b border-black/5">
              {active?.label}
            </h2>

            {activeSection === "orders" && <OrdersSection userId={user?.id} />}
            {activeSection === "profile" && <ProfileSection user={user} />}
            {activeSection === "password" && <PasswordSection />}
            {activeSection === "address" && <AddressSection user={user} />}
          </main>
        </div>
      </div>
    </div>
  );
}
