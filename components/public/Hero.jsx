import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-[85vh] bg-[#F5F1EB]">
      
      <div className="w-full md:w-[45%] flex flex-col justify-center items-start px-12 md:px-24 py-20 order-2 md:order-1">
        
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#C4A95E] mb-6 font-bold">
          Fine Jewelry Collection
        </span>

        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-black leading-[1.1] mb-8 italic">
          Esencia que <br/> perdura.
        </h2>
        
        <p className="text-black/60 text-sm md:text-base max-w-sm mb-12 font-light leading-relaxed">
          Piezas únicas en oro laminado diseñadas para elevar cada momento. Calidad artesanal que captura la luz y define tu estilo.
        </p>
        
        <Link 
          href="/products" 
          className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-bold text-black border-b border-black/20 pb-2 hover:border-black transition-all duration-500"
        >
          Explorar Tienda
          <ArrowRight 
            size={16} 
            className="group-hover:translate-x-3 transition-transform duration-500"
            strokeWidth={1.5}
          />
        </Link>
      </div>

      <div className="w-full md:w-[55%] relative h-[60vh] md:h-auto order-1 md:order-2">
        <Image
          src="https://jewelrydesignhouse.com/cdn/shop/collections/Mermaid_Fine_Jewelry_Collection.jpg?crop=center&height=1332&v=1692209360&width=2000" 
          alt="Detalle de joyería ZÁLEA"
          fill
          className="object-cover object-center grayscale-20 hover:grayscale-0 transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-[#DBD2C8]/10 mix-blend-multiply pointer-events-none"></div>
      </div>
    </section>
  );
}