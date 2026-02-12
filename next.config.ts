import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  images: {
    remotePatterns: [new URL('https://lh3.googleusercontent.com/aida-public/**')
      ,new URL('https://eartxzbtywjsuezcbtlj.supabase.co/storage/v1/object/public/product_image/**'),
      new URL('https://i.pinimg.com/736x/90/d4/a7/90d4a7fb75e33c4cef894a6772d87a50.jpg'),
      new URL('https://jewelrydesignhouse.com/cdn/shop/collections/Mermaid_Fine_Jewelry_Collection.jpg?crop=center&height=1332&v=1692209360&width=2000'),
    ],
    
  },
}