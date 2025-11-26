/**
 * Système de cache hors-ligne pour Psaumes365
 * Utilise localStorage pour stocker les données utilisateur en cache
 */

const CACHE_PREFIX = 'psaumes365_cache_'
const CACHE_VERSION = 'v1'

interface CacheData {
  timestamp: number
  data: any
  version: string
}

/**
 * Durée de validité du cache (en millisecondes)
 */
const CACHE_DURATION = {
  DAILY_VERSE: 24 * 60 * 60 * 1000, // 24 heures
  CURRENT_PLAN: 60 * 60 * 1000, // 1 heure
  PLANS_LIST: 6 * 60 * 60 * 1000, // 6 heures
  PLAN_DETAIL: 12 * 60 * 60 * 1000, // 12 heures
}

/**
 * Vérifie si les données en cache sont encore valides
 */
function isCacheValid(cacheData: CacheData | null, maxAge: number): boolean {
  if (!cacheData) return false
  if (cacheData.version !== CACHE_VERSION) return false
  
  const age = Date.now() - cacheData.timestamp
  return age < maxAge
}

/**
 * Met en cache les données avec un timestamp
 */
function setCache(key: string, data: any): void {
  try {
    const cacheData: CacheData = {
      timestamp: Date.now(),
      data,
      version: CACHE_VERSION,
    }
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Erreur mise en cache:', error)
  }
}

/**
 * Récupère les données du cache si elles sont valides
 */
function getCache(key: string, maxAge: number): any | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (!cached) return null

    const cacheData: CacheData = JSON.parse(cached)
    if (isCacheValid(cacheData, maxAge)) {
      return cacheData.data
    }

    // Cache expiré, le supprimer
    localStorage.removeItem(`${CACHE_PREFIX}${key}`)
    return null
  } catch (error) {
    console.error('Erreur récupération cache:', error)
    return null
  }
}

/**
 * Cache le verset du jour
 */
export function cacheDailyVerse(verse: { reference: string; content: string }): void {
  setCache('daily_verse', verse)
}

/**
 * Récupère le verset du jour depuis le cache
 */
export function getCachedDailyVerse(): { reference: string; content: string } | null {
  return getCache('daily_verse', CACHE_DURATION.DAILY_VERSE)
}

/**
 * Cache le plan en cours
 */
export function cacheCurrentPlan(plan: any): void {
  setCache('current_plan', plan)
}

/**
 * Récupère le plan en cours depuis le cache
 */
export function getCachedCurrentPlan(): any | null {
  return getCache('current_plan', CACHE_DURATION.CURRENT_PLAN)
}

/**
 * Cache la liste des plans
 */
export function cachePlansList(plans: any[]): void {
  setCache('plans_list', plans)
}

/**
 * Récupère la liste des plans depuis le cache
 */
export function getCachedPlansList(): any[] | null {
  return getCache('plans_list', CACHE_DURATION.PLANS_LIST)
}

/**
 * Cache les détails d'un plan
 */
export function cachePlanDetail(planId: string, plan: any): void {
  setCache(`plan_${planId}`, plan)
}

/**
 * Récupère les détails d'un plan depuis le cache
 */
export function getCachedPlanDetail(planId: string): any | null {
  return getCache(`plan_${planId}`, CACHE_DURATION.PLAN_DETAIL)
}

/**
 * Nettoie tous les caches expirés
 */
export function cleanExpiredCache(): void {
  try {
    const keys = Object.keys(localStorage)
    const now = Date.now()

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const cacheData: CacheData = JSON.parse(cached)
            // Supprimer les caches de l'ancienne version
            if (cacheData.version !== CACHE_VERSION) {
              localStorage.removeItem(key)
            }
          }
        } catch {
          // Ignorer les erreurs de parsing
        }
      }
    })
  } catch (error) {
    console.error('Erreur nettoyage cache:', error)
  }
}

/**
 * Vide tout le cache
 */
export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Erreur vidage cache:', error)
  }
}

