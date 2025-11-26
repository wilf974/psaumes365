/**
 * Système d'analytics respectueux de la vie privée
 * Aucun cookie, aucune collecte de données personnelles
 * Utilise uniquement des données anonymes et agrégées
 */

/**
 * Types d'événements trackés
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'verse_read'
  | 'meditation_started'
  | 'meditation_completed'
  | 'plan_started'
  | 'plan_completed'
  | 'favorite_added'
  | 'audio_played'
  | 'search_performed'
  | 'share_clicked'

/**
 * Données d'un événement (anonymisées)
 */
export interface AnalyticsEventData {
  event: AnalyticsEvent
  timestamp: number
  page?: string
  metadata?: Record<string, string | number>
}

/**
 * Vérifie si l'analytics est activé (basé sur les préférences utilisateur)
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  
  // Vérifier les préférences de l'utilisateur (localStorage)
  const analyticsPref = localStorage.getItem('psaumes365_analytics_enabled')
  
  // Par défaut, activé (mais l'utilisateur peut le désactiver)
  if (analyticsPref === null) {
    return true // Activé par défaut
  }
  
  return analyticsPref === 'true'
}

/**
 * Active ou désactive l'analytics
 */
export function setAnalyticsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('psaumes365_analytics_enabled', enabled.toString())
}

/**
 * Envoie un événement analytics (si activé)
 * Les données sont anonymisées et ne contiennent aucune information personnelle
 */
export async function trackEvent(
  event: AnalyticsEvent,
  metadata?: Record<string, string | number>
): Promise<void> {
  if (!isAnalyticsEnabled()) {
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  const eventData: AnalyticsEventData = {
    event,
    timestamp: Date.now(),
    page: window.location.pathname,
    metadata: metadata || {},
  }

  try {
    // Envoyer l'événement au serveur (anonymisé)
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
  } catch (error) {
    // Ignorer silencieusement les erreurs d'analytics
    // Ne pas perturber l'expérience utilisateur
    console.debug('Analytics error (ignored):', error)
  }
}

/**
 * Track une vue de page
 */
export function trackPageView(page: string): void {
  trackEvent('page_view', { page })
}

/**
 * Track la lecture d'un verset
 */
export function trackVerseRead(verseRef: string): void {
  trackEvent('verse_read', { verseRef })
}

/**
 * Track le démarrage d'une méditation
 */
export function trackMeditationStarted(): void {
  trackEvent('meditation_started')
}

/**
 * Track la complétion d'une méditation
 */
export function trackMeditationCompleted(duration: number): void {
  trackEvent('meditation_completed', { duration })
}

/**
 * Track l'ajout d'un favori
 */
export function trackFavoriteAdded(verseRef: string): void {
  trackEvent('favorite_added', { verseRef })
}

/**
 * Track la lecture audio
 */
export function trackAudioPlayed(verseRef?: string): void {
  trackEvent('audio_played', verseRef ? { verseRef } : {})
}

/**
 * Track une recherche
 */
export function trackSearch(query: string, resultCount: number): void {
  trackEvent('search_performed', { 
    queryLength: query.length, // Longueur seulement, pas le contenu
    resultCount 
  })
}

/**
 * Track un partage
 */
export function trackShare(platform: string, verseRef: string): void {
  trackEvent('share_clicked', { platform, verseRef })
}

