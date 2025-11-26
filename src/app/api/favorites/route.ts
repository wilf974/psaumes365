import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/favorites
 * Récupère les versets favoris de l'utilisateur
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const favorites = await prisma.favoriteVerse.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Erreur favoris:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * POST /api/favorites
 * Ajoute un verset aux favoris
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { verseRef, verseText, note } = body

    if (!verseRef || !verseText) {
      return NextResponse.json({ error: 'Référence et texte requis' }, { status: 400 })
    }

    // Vérifier si déjà en favori
    const existing = await prisma.favoriteVerse.findUnique({
      where: {
        userId_verseRef: {
          userId: session.user.id,
          verseRef,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Déjà en favori' }, { status: 409 })
    }

    const favorite = await prisma.favoriteVerse.create({
      data: {
        userId: session.user.id,
        verseRef,
        verseText,
        note,
      },
    })

    return NextResponse.json(favorite)
  } catch (error) {
    console.error('Erreur ajout favori:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/favorites
 * Supprime un verset des favoris
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const verseRef = searchParams.get('verseRef')

    if (!verseRef) {
      return NextResponse.json({ error: 'Référence requise' }, { status: 400 })
    }

    await prisma.favoriteVerse.delete({
      where: {
        userId_verseRef: {
          userId: session.user.id,
          verseRef,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression favori:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


