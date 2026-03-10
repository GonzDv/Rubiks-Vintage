import Link from "next/link";
import { ArrowRight, MapPin, Instagram } from "lucide-react";

const VALUES = [
  {
    number: "01",
    title: "Selección propia",
    description:
      "Cada pieza es elegida a mano. No vendemos catálogo — vendemos criterio. Si no nos convence, no llega a ti.",
  },
  {
    number: "02",
    title: "Materiales que duran",
    description:
      "Oro laminado de 18k y acero inoxidable. Materiales elegidos por su resistencia y brillo, no solo por su apariencia.",
  },
  {
    number: "03",
    title: "Trato cercano",
    description:
      "Somos una marca pequeña y queremos seguir siéndolo. Cada pedido es personal, cada cliente importa.",
  },
];

const STATS = [
  { value: "18k",   label: "Oro laminado" },
  { value: "316L",  label: "Acero inoxidable" },
  { value: "100%",  label: "Selección propia" },
  { value: "Qro",   label: "México" },
];

export default function AboutPage() {
  return (
    <main className="bg-[#F5F1EB] min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-[#C4A95E]" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold">
              Nuestra Historia
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic text-black leading-[0.95]">
            Brilla en<br />
            <span className="text-[#A07F3A]">lo cotidiano.</span>
          </h1>
        </div>

        <div className="space-y-6 lg:pb-4">
          <p className="text-black/60 text-base md:text-lg font-light leading-relaxed max-w-md">
            ZÁLEA nació en Querétaro con una idea simple: que la joyería elegante no debería reservarse para ocasiones especiales.
          </p>
          <p className="text-black/40 text-sm font-light leading-relaxed max-w-md">
            Oro laminado y acero inoxidable seleccionados con criterio, para mujeres que quieren brillar todos los días sin pretensiones.
          </p>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-black/25 font-bold">
            <MapPin size={11} strokeWidth={1.5} />
            Querétaro, México
          </div>
        </div>
      </section>

      {/* ── LÍNEA DIVISORIA ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full h-px bg-black/5" />
      </div>

      {/* ── MARCA ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Texto */}
        <div className="space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C4A95E] font-bold">
              Detrás de la marca
            </span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-black mt-3 leading-tight">
              Una visión, una colección.
            </h2>
          </div>
          <div className="space-y-4 text-black/50 font-light leading-relaxed text-sm md:text-base">
            <p>
              ZÁLEA es el proyecto de una mujer con ojo para lo bello y convicción en lo que selecciona. Cada pieza — desde aretes statement hasta cadenas y pulseras — pasa por sus manos antes de llegar a las tuyas.
            </p>
            <p>
              La curaduría no es casualidad. Es el criterio de alguien que entiende que la joyería no es solo adorno, es expresión de quién eres cada día.
            </p>
          </div>
          <a
            href="https://www.instagram.com/zalea.jewelry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors"
          >
            <Instagram size={14} strokeWidth={1.5} />
            @zalea.jewelry
          </a>
        </div>

        {/* Stats en grid */}
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <p className="text-3xl font-serif italic text-black">{stat.value}</p>
              <p className="text-[9px] uppercase tracking-widest text-black/30 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold">
              Filosofía
            </span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-white mt-3">
              Lo que nos define.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {VALUES.map((value) => (
              <div key={value.number} className="space-y-4 border-t border-white/10 pt-8">
                <span className="text-[10px] font-mono text-[#C4A95E]/50">{value.number}</span>
                <h3 className="text-xl font-serif italic text-white">{value.title}</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-black">
            ¿Lista para encontrar tu pieza?
          </h2>
          <p className="text-black/40 text-sm mt-2 font-light">
            Cada joya espera a la persona indicada.
          </p>
        </div>
        <Link
          href="/products"
          className="group inline-flex items-center gap-4 shrink-0"
        >
          <span className="w-12 h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-[#A07F3A] transition-colors duration-500">
            <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform duration-300" strokeWidth={1.5} />
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-black group-hover:text-[#A07F3A] transition-colors duration-300">
            Ver Colección
          </span>
        </Link>
      </section>

    </main>
  );
}