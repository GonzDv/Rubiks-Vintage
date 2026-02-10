import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  images: {
    remotePatterns: [new URL('https://lh3.googleusercontent.com/aida-public/**')
      ,new URL('https://eartxzbtywjsuezcbtlj.supabase.co/storage/v1/object/public/product_image/**')
    ],
    
  },
}