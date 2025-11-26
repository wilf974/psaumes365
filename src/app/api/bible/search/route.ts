import { NextRequest, NextResponse } from 'next/server'
import { searchVerses, parseReference, getPassage } from '@/lib/bible-api'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * API Route pour rechercher des versets
 * GET /api/bible/search?q=query&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting pour les recherches
    const session = await getServerSession(authOptions)
    const rateLimitResponse = rateLimitMiddleware(
      request,
      RATE_LIMITS.SEARCH,
      session?.user?.id
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    // Validation renforcée
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'La requête doit contenir au moins 2 caractères' },
        { status: 400 }
      )
    }

    if (query.length > 200) {
      return NextResponse.json(
        { error: 'La requête est trop longue (max 200 caractères)' },
        { status: 400 }
      )
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'La limite doit être entre 1 et 50' },
        { status: 400 }
      )
    }

    // Vérifier si c'est une référence biblique (ex: "Jean 3:16")
    const referenceId = parseReference(query)
    
    if (referenceId) {
      // Si c'est une référence, récupérer le passage directement
      const passage = await getPassage(referenceId)
      if (passage) {
        return NextResponse.json({
          results: [{
            id: passage.id,
            reference: passage.reference,
            content: passage.content,
            bookId: '',
            chapterId: '',
            verseId: passage.id,
          }],
          total: 1,
        })
      }
    }

    // Sinon, faire une recherche textuelle
    const results = await searchVerses(query, limit)
    
    return NextResponse.json({
      results,
      total: results.length,
    })
  } catch (error) {
    console.error('Erreur API recherche:', error)
    return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 })
  }
}

