import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitIdentifier, RateLimitOptions } from '@/lib/rate-limit'

/**
 * Middleware de rate limiting pour les API routes
 * @param request - La requête Next.js
 * @param options - Options de rate limiting
 * @param userId - ID utilisateur optionnel (si authentifié)
 * @returns NextResponse avec headers de rate limiting ou null si autorisé
 */
export function rateLimitMiddleware(
  request: NextRequest,
  options: RateLimitOptions,
  userId?: string
): NextResponse | null {
  const identifier = getRateLimitIdentifier(request, userId)
  const result = checkRateLimit(identifier, options)

  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Trop de requêtes. Veuillez réessayer plus tard.',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      { status: 429 }
    )

    // Ajouter les headers de rate limiting
    response.headers.set('X-RateLimit-Limit', options.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
    response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString())

    return response
  }

  // Ajouter les headers même si autorisé
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', options.maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())

  return null // null signifie que la requête peut continuer
}

