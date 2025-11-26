'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/notifications'
import { cleanExpiredCache } from '@/lib/offline-cache'

/**
 * Provider pour gérer le mode hors-ligne
 * Enregistre le service worker et nettoie le cache
 */
export function OfflineProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enregistrer le service worker
    if (typeof window !== 'undefined') {
      registerServiceWorker().catch((error) => {
        console.error('Erreur enregistrement service worker:', error)
      })

      // Nettoyer le cache expiré au démarrage
      cleanExpiredCache()

      // Nettoyer le cache toutes les heures
      const interval = setInterval(() => {
        cleanExpiredCache()
      }, 60 * 60 * 1000) // 1 heure

      return () => clearInterval(interval)
    }
  }, [])

  return <>{children}</>
}

