import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/bible/comments
 * Récupère les commentaires pour un verset ou une liste de versets
 * Query params: verseRef (ex: "Jean 3:16")
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const verseRef = searchParams.get('verseRef')
    const theme = searchParams.get('theme')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (verseRef) {
      // Récupérer le commentaire pour un verset spécifique
      const comment = await prisma.commentedVerse.findUnique({
        where: { verseRef },
      })

      if (!comment || !comment.isActive) {
        return NextResponse.json({ comment: null })
      }

      return NextResponse.json({ comment })
    }

    // Récupérer une liste de versets commentés
    const where: any = { isActive: true }
    if (theme) {
      where.theme = theme
    }

    const comments = await prisma.commentedVerse.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        verseRef: true,
        verseText: true,
        commentary: true,
        theme: true,
        author: true,
        translation: true,
      },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Erreur récupération commentaires:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bible/comments
 * Crée ou met à jour un commentaire pour un verset (Admin/Contributor uniquement)
 */
export async function POST(request: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier les permissions (Admin ou Contributor)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'CONTRIBUTOR')) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    const body = await request.json()
    const { verseRef, verseText, commentary, theme, author, translation } = body

    // Validation
    if (!verseRef || !verseText || !commentary) {
      return NextResponse.json(
        { error: 'verseRef, verseText et commentary sont requis' },
        { status: 400 }
      )
    }

    // Créer ou mettre à jour le commentaire
    const commentedVerse = await prisma.commentedVerse.upsert({
      where: { verseRef },
      update: {
        verseText,
        commentary,
        theme: theme || null,
        author: author || null,
        translation: translation || 'LSG',
        updatedAt: new Date(),
      },
      create: {
        verseRef,
        verseText,
        commentary,
        theme: theme || null,
        author: author || null,
        translation: translation || 'LSG',
      },
    })

    return NextResponse.json({ comment: commentedVerse }, { status: 201 })
  } catch (error) {
    console.error('Erreur création commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

