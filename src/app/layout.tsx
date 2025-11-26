import type { Metadata } from 'next'
import './globals.css'
import { OfflineProvider } from '@/components/providers/offline-provider'

/**
 * Métadonnées de l'application Meditatio
 */
export const metadata: Metadata = {
  title: 'Psaumes365 - Méditation Biblique Quotidienne',
  description: 'Application gratuite de méditation de la Parole de Dieu. Lecture biblique quotidienne, méditations guidées et journal spirituel.',
  keywords: ['bible', 'méditation', 'chrétien', 'prière', 'spiritualité', 'verset du jour', 'psaumes'],
  authors: [{ name: 'Psaumes365' }],
  manifest: '/manifest.json',
  themeColor: '#6A8847',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Psaumes365',
  },
  openGraph: {
    title: 'Psaumes365 - Méditation Biblique Quotidienne',
    description: 'Application gratuite de méditation de la Parole de Dieu. Lecture biblique quotidienne, méditations guidées et journal spirituel.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Psaumes365',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psaumes365 - Méditation Biblique Quotidienne',
    description: 'Application gratuite de méditation de la Parole de Dieu.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/**
 * Layout racine de l'application
 * Applique les styles globaux et la structure HTML de base
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/logo-1.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen bg-texture">
        <OfflineProvider>
          {children}
        </OfflineProvider>
      </body>
    </html>
  )
}

