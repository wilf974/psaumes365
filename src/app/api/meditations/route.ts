import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/meditations
 * Récupère toutes les méditations guidées actives pour les utilisateurs
 */
export async function GET() {
  try {
    const meditations = await prisma.guidedMeditation.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        verseRef: true,
        verseText: true,
        theme: true,
        reflection: true,
        estimatedDuration: true,
        audioUrl: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ meditations })
  } catch (error) {
    console.error('Erreur récupération méditations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

