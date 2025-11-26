import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/journal/[id] - Récupère une entrée spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entrée non trouvée' }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Erreur GET journal entry:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * PUT /api/journal/[id] - Met à jour une entrée
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { content, verseRef } = body

    // Vérifier que l'entrée appartient à l'utilisateur
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Entrée non trouvée' }, { status: 404 })
    }

    const entry = await prisma.journalEntry.update({
      where: { id: params.id },
      data: {
        content: content?.trim() || existingEntry.content,
        verseRef: verseRef?.trim() || existingEntry.verseRef,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Erreur PUT journal entry:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/journal/[id] - Supprime une entrée
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'entrée appartient à l'utilisateur
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Entrée non trouvée' }, { status: 404 })
    }

    await prisma.journalEntry.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE journal entry:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


