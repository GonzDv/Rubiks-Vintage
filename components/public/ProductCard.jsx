import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, className }) {
console.log("Renderizando ProductCard con producto:", product.image_url);
  return (
    <div className={`group cursor-pointer ${className}`}>
      <div className="aspect-3/4 bg-[#F9F8F6] mb-4 overflow-hidden relative rounded-sm">
        <Image
          src={product.image_url || "/images/placeholder-jewelry.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-white/90 backdrop-blur-sm text-[8px] uppercase tracking-widest px-2 py-1 text-black font-bold">
            {product.categories?.name}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-start gap-4 px-1">
        <div>
          <h3 className="text-[13px] font-medium text-gray-900 uppercase tracking-[0.15em] leading-tight">
            {product.name}
          </h3>
          <p className="text-[12px] text-gray-400 mt-1 italic">
            Oro Laminado
          </p>
        </div>
        <p className="text-2xs font-bold text-gray-900">
          ${product.base_price?.toLocaleString('es-MX')}
        </p>
      </div>
    </div>
  );
}