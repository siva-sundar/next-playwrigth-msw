import type { NextConfig } from "next";

// Vite-style proxy configuration
const proxyConfig = {
  '/api': {
    target: process.env.API_PROXY_TARGET || 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
};

const nextConfig: NextConfig = {
  // Proxy configuration similar to Vite
  // Maps API requests to proxy target (can be used for MSW interception)
  async rewrites() {
    const rewrites: Array<{ source: string; destination: string }> = [];
    
    // Apply proxy during tests when MSW is enabled, or when API_PROXY_TARGET is set
    if (process.env.ENABLE_MSW === 'true' || process.env.API_PROXY_TARGET) {
      const target = proxyConfig['/api'].target;
      
      rewrites.push({
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      });
    }
    
    return rewrites;
  },
};

export default nextConfig;
