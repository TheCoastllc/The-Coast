import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  turbopack: {
    root: import.meta.dirname,
  },

  // Trim barrel-file imports so only what's used ships in the client bundle.
  experimental: {
    optimizePackageImports: ['motion', 'gsap', '@react-three/drei'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Cache optimized image variants on the CDN/browser for a year.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },

  // Enforce the canonical host in code so it survives any platform change:
  // www.coastglobal.org -> coastglobal.org (apex). http -> https is auto-upgraded
  // by Vercel + HSTS. Subdomains (cbi., offers.) are untouched by the host match.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.coastglobal.org' }],
        destination: 'https://coastglobal.org/:path*',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://assets.calendly.com; img-src 'self' data: blob: https://res.cloudinary.com https://storage.efferd.com https://lh3.googleusercontent.com https://*.calendly.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com; media-src 'self' blob: https://stream.mux.com https://*.mux.com; font-src 'self' https://assets.calendly.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://stream.mux.com https://*.mux.com https://featurable.com https://calendly.com https://*.calendly.com; frame-src 'self' https://calendly.com https://*.calendly.com; frame-ancestors 'self';",
          },
        ],
      },
      {
        // Long-lived caching for static media (images, video, fonts) served from /public.
        source: '/(.*)\\.(avif|webp|jpg|jpeg|png|gif|svg|ico|mp4|webm|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
