import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { ShoppingBag, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/public/ProductCard";

async function getRelatedProducts(categoryId, currentProductId) {
  const { data } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(4);
  return data || [];
}

async function getProduct(id) {
  const { data } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", id)
    .single();
  return data;
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EB]">
        <p className="font-serif italic text-black/40">
          Este tesoro ya no está disponible...
        </p>
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category_id, id);

  return (
    <main className="bg-[#F5F1EB] pt-24 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cambio a flex-col para mobile y items-center para centrar todo */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">
          
          {/* SECCIÓN IMAGEN: Eliminamos h-170 para usar aspectos responsivos */}
          <div className="w-full max-w-md lg:max-w-none lg:w-1/2 mx-auto">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5">
              <Image
                src={product.image_url}
                alt={product.name}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* SECCIÓN INFO: Centrada en mobile, izquierda en desktop */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-6 md:space-y-8 text-center lg:text-left items-center lg:items-start">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/40">
              <Link href={"/products"} className="hover:text-black font-bold">
                Tienda
              </Link>
              <ChevronRight size={10} />
              <span className="text-[#C4A95E] font-bold">
                {product.categories?.name}
              </span>
            </nav>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-serif italic text-black leading-tight">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl font-light text-[#A07F3A] tracking-wider">
                ${product.base_price?.toLocaleString("es-MX")} MXN
              </p>
            </div>

            <p className="text-black/60 leading-relaxed font-light text-sm md:text-base max-w-lg italic">
              {product.description ||
                "Una pieza atemporal diseñada para capturar la esencia de la elegancia contemporánea."}
            </p>

            <div className="w-full pt-4 flex justify-center lg:justify-start">
              <button className="w-full sm:w-80 bg-black text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-all flex items-center justify-center gap-4 group">
                <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                Añadir al Carrito
              </button>
            </div>

            {/* Garantías: 2 columnas en tablets, 1 en móviles pequeños */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-black/5 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <Truck size={18} strokeWidth={1} />
                </div>
                <p className="text-[10px] uppercase tracking-widest leading-tight text-black/50">
                  Envío asegurado<br />
                  <span className="text-black font-bold">Todo México</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <ShieldCheck size={18} strokeWidth={1} />
                </div>
                <p className="text-[10px] uppercase tracking-widest leading-tight text-black/50">
                  Calidad certificada<br />
                  <span className="text-black font-bold">Oro Laminado</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24 md:mt-32 border-t border-black/5 pt-20">
          <header className="mb-12 text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C4A95E] font-bold mb-4 block">
              Completar el Look
            </span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-black">
              También te podría gustar
            </h2>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}