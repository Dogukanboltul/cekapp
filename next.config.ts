import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Kullanıcı ana dizine geldiğinde (localhost:3000)
        source: '/',
        // Onu direkt pazarlama sayfasına fırlat
        destination: '/logout-success', 
        // Geliştirme aşamasında olduğumuz için 'false' (cache yapmasın)
        permanent: false, 
      },
    ];
  },
  // Buluttaki performans için optimize edilmiş görseller (gerekirse)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app',
      },
    ],
  },
};

export default nextConfig;