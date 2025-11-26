'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

/**
 * Page d'accueil de Meditatio
 * Présente l'application et invite l'utilisateur à commencer
 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Fond décoratif */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-olive-200/30 dark:bg-olive-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-ciel-200/30 dark:bg-ciel-800/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sable-100/50 dark:bg-sable-900/10 rounded-full blur-3xl" />
      </div>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-2xl text-center"
      >
        {/* Logo / Titre */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="mb-6 flex justify-center">
            <Logo size={120} showText={false} />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-foreground mb-2">
            Psaumes365
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Méditation Biblique Quotidienne
          </p>
        </motion.div>

        {/* Verset d'introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="verse-container mb-10"
        >
          <p className="verse-text text-foreground/90 mb-3">
            « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
          </p>
          <p className="verse-reference">
            — Psaume 119:105
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-10 leading-relaxed"
        >
          Prenez un moment chaque jour pour méditer la Parole de Dieu.
          <br />
          Lectures guidées, journal spirituel et plans de méditation thématiques.
        </motion.p>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/accueil"
            className="btn-spiritual inline-flex items-center justify-center gap-2"
          >
            <span>Commencer la méditation</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl font-medium text-foreground/80 border border-border
                     hover:bg-secondary hover:border-border/80 transition-all duration-300"
          >
            Se connecter
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer subtil */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 text-sm text-muted-foreground/60"
      >
        100% gratuit • Sans publicité • Pour la gloire de Dieu
      </motion.footer>
    </main>
  )
}

