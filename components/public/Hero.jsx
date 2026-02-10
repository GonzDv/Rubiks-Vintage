import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-[85vh] top-0">
      
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8 md:px-24 py-16 md:py-0 bg-black/90 order-2 md:order-1">
        
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
          Tesoros Vintage & Tendencias
        </span>
        
        <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
          Elegancia para tu día a día, reinventada
        </h2>
        
        <p className="text-gray-300 text-lg max-w-md mb-10 font-light leading-relaxed">
          Explora nuestra selección de collares, pulseras y aretes en oro laminado. El equilibrio perfecto entre diseños en tendencia y calidad duradera. Ideal para ti, o para sorprender a alguien especial.
        </p>
        
        <Link href="/shop" className="group flex items-center gap-4 text-sm uppercase tracking-widest font-medium border-b border-white pb-2 text-white hover:text-gray-300 hover:border-gray-400 transition-all">
          Explorar Colección
          <ArrowRight size={18} color='white' strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300"/>
        </Link>

      </div>

      {/* Visual Content */}
      <div className="w-full md:w-1/2 relative h-[50vh] md:h-auto order-1 md:order-2">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJtdBfd5s8PsBKdlQUA0JqpU-md4zlAcIbAFLOzNdtcbI43ckbkk4InyNGCbR_u5FQiZbuV2vbl5hPcuaOYhvsm4FdzaMV7EGE6ViMWTVEpxjA5rGqJLVEUAhw8gOliaTPJYQmVoDIOBpBYQrLheIusLRiDvBhtGLYtcCRSybLXdO38Q6yxHcjXs0xVEosvlpDrLfQF_kH6oA6UX25fd2VrmdQwtmmNwmtZXbzRhEQ9msFeHPIncx8F1GE9ke8MwLvYJ6yeEpQvy4"
          alt="Joyas vintage de Rubik's"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}