/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.coastglobal.org',
  generateRobotsTxt: true,
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/portal',
    '/portal/*',
    '/payment-success',
    '/subscription-success',
    '/intake',
    '/intake/*',
    '/brand-builder',
    '/cbi',            // noindex placeholder
    '/sitemap.xml',    // sitemap file should not be a page URL entry
    '/sitemap-0.xml',
    // Next.js auto-generated icon/manifest routes
    '/apple-icon.png',
    '/icon0.svg',
    '/icon1.png',
    '/manifest.json',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/portal', '/payment-success', '/subscription-success', '/intake'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    additionalSitemaps: [],
    // Note: next-sitemap appends "Host" and "Sitemap" from siteUrl automatically.
    // The siteUrl above (www.coastglobal.org) will be used for both directives.
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/services': 0.9,
      '/pricing': 0.9,
      '/get-started': 0.9,
      '/about': 0.8,
      '/blog': 0.8,
      '/work': 0.8,
      '/brand-avatar': 0.7,
      '/vision': 0.6,
    }
    const changefreqs = {
      '/': 'weekly',
      '/blog': 'daily',
      '/pricing': 'weekly',
      '/services': 'monthly',
    }

    return {
      loc: path,
      changefreq: changefreqs[path] ?? 'monthly',
      priority: priorities[path] ?? 0.6,
      lastmod: new Date().toISOString(),
    }
  },
}
