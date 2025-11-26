import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateId } from '@/lib/validation'

/**
 * GET /api/meditations/[id]
 * Récupère une méditation guidée spécifique (active uniquement)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idValidation = validateId(params.id, 'ID méditation')
    if (!idValidation.valid) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const meditation = await prisma.guidedMeditation.findUnique({
      where: { id: params.id, isActive: true },
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

    if (!meditation) {
      return NextResponse.json({ error: 'Méditation non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ meditation })
  } catch (error) {
    console.error('Erreur récupération méditation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

