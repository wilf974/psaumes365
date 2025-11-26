import { MetadataRoute } from 'next'

/**
 * Génère le fichier robots.txt pour le SEO
 * Next.js génère automatiquement le fichier robots.txt à partir de ce fichier
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://psaumes365.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

