import Navbar from "@/components/public/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-scree">

      <Navbar />

      <main className="flex-grow bg-[#f0ede9]">
        {children}
      </main>

      <footer className="border-t border-gray-100 py-12 bg-[#F9F8F6]/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-serif italic text-xl">
              Rubik's <span className="text-gray-400 not-italic">Vintage</span>
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">
              Joyas con historia, elegancia para hoy.
            </p>
          </div>

          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
            <a href="#" className="hover:text-black transition">Instagram</a>
            <a href="#" className="hover:text-black transition">Términos</a>
            <a href="#" className="hover:text-black transition">Contacto</a>
          </div>

          <p className="text-[10px] text-gray-400">
            © {new Date().getFullYear()} Rubik's Vintage. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}