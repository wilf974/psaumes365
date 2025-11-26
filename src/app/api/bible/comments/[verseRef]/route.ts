import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/bible/comments/[verseRef]
 * Récupère le commentaire pour un verset spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { verseRef: string } }
) {
  try {
    const verseRef = decodeURIComponent(params.verseRef)

    const comment = await prisma.commentedVerse.findUnique({
      where: { verseRef },
    })

    if (!comment || !comment.isActive) {
      return NextResponse.json({ comment: null })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Erreur récupération commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bible/comments/[verseRef]
 * Désactive un commentaire (Admin uniquement)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { verseRef: string } }
) {
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier les permissions (Admin uniquement)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    const verseRef = decodeURIComponent(params.verseRef)

    // Désactiver le commentaire au lieu de le supprimer
    await prisma.commentedVerse.update({
      where: { verseRef },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Commentaire désactivé' })
  } catch (error) {
    console.error('Erreur suppression commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

