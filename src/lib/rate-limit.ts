/**
 * Système de rate limiting simple pour les API
 * Utilise un Map en mémoire (pour production, utiliser Redis)
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Store en mémoire (à remplacer par Redis en production)
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Options de rate limiting
 */
export interface RateLimitOptions {
  windowMs: number // Fenêtre de temps en millisecondes
  maxRequests: number // Nombre maximum de requêtes
  identifier?: string // Identifiant unique (IP, userId, etc.)
}

/**
 * Vérifie si une requête dépasse la limite
 * @param identifier - Identifiant unique (IP, userId, etc.)
 * @param options - Options de rate limiting
 * @returns true si la limite est dépassée, false sinon
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetTime: number } {
  const { windowMs, maxRequests } = options
  const now = Date.now()
  const key = `${identifier}:${windowMs}`

  // Nettoyer les entrées expirées (garbage collection simple)
  if (rateLimitStore.size > 10000) {
    // Nettoyer les entrées expirées si le store devient trop grand
    for (const [k, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }
  }

  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    // Nouvelle fenêtre ou fenêtre expirée
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: maxRequests - 1, resetTime }
  }

  if (entry.count >= maxRequests) {
    // Limite dépassée
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }

  // Incrémenter le compteur
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Obtient l'identifiant de rate limiting depuis la requête
 * Utilise l'IP ou l'ID utilisateur si authentifié
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  // Priorité : userId si authentifié, sinon IP
  if (userId) {
    return `user:${userId}`
  }

  // Extraire l'IP depuis les headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  return `ip:${ip}`
}

/**
 * Presets de rate limiting pour différents types d'endpoints
 */
export const RATE_LIMITS = {
  // Limites strictes pour l'authentification
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 tentatives par 15 minutes
  },
  // Limites pour les API publiques
  PUBLIC_API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requêtes par minute
  },
  // Limites pour les API authentifiées
  AUTHENTICATED_API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120, // 120 requêtes par minute
  },
  // Limites pour la génération audio (coûteuse)
  AUDIO_GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 générations par minute
  },
  // Limites pour les recherches
  SEARCH: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 recherches par minute
  },
}

