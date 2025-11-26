import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { validateText } from '@/lib/validation'

/**
 * GET /api/journal - Récupère les entrées du journal de l'utilisateur
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Erreur GET journal:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/journal - Crée une nouvelle entrée de journal
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Rate limiting pour les API authentifiées
    const rateLimitResponse = rateLimitMiddleware(
      request,
      RATE_LIMITS.AUTHENTICATED_API,
      session.user.id
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()
    const { content, verseRef } = body

    // Validation renforcée
    const contentValidation = validateText(content, {
      minLength: 1,
      maxLength: 50000, // 50k caractères pour le journal
      required: true,
    })

    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      )
    }

    const entry = await prisma.journalEntry.create({
      data: {
        content: contentValidation.cleaned || content.trim(),
        verseRef: verseRef?.trim() || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Erreur POST journal:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


