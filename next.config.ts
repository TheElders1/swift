import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/admin', destination: '/shipments', permanent: false },
      { source: '/admin/:path*', destination: '/shipments', permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: '/index.html', destination: '/' },
      { source: '/index.php', destination: '/' },
      { source: '/index.php/login', destination: '/login' },
      { source: '/index.php/page/about', destination: '/about' },
      { source: '/index.php/page/services', destination: '/services' },
      { source: '/index.php/page/locations', destination: '/locations' },
      { source: '/index.php/page/why-us', destination: '/why-us' },
      { source: '/index.php/page/track', destination: '/track' },
      { source: '/page/about.html', destination: '/about' },
      { source: '/page/services.html', destination: '/services' },
      { source: '/page/locations.html', destination: '/locations' },
      { source: '/page/why-us.html', destination: '/why-us' },
      { source: '/page/track.html', destination: '/track' },
      { source: '/page/tracking.html', destination: '/track' },
      { source: '/login.html', destination: '/login' },
      { source: '/index.php/admin/shipments/show.html', destination: '/shipments' },
      { source: '/index.php/admin/shipments', destination: '/shipments' }
    ];
  }
};
export default nextConfig;
