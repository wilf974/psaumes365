import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getPlanById } from '@/data/plans'

/**
 * GET /api/plans/[id]
 * Récupère un plan spécifique par son ID (BDD ou plan système)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id

    // Vérifier si le plan système a été supprimé
    const deletedPlan = await prisma.deletedSystemPlan.findUnique({
      where: { planId },
    })
    if (deletedPlan) {
      return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 })
    }

    // D'abord, essayer de charger depuis les données statiques
    const staticPlan = getPlanById(planId)
    if (staticPlan) {
      return NextResponse.json(staticPlan)
    }

    // Sinon, charger depuis la base de données
    const dbPlan = await prisma.plan.findUnique({
      where: {
        id: planId,
        isActive: true,
      },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    })

    if (!dbPlan) {
      return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 })
    }

    // Convertir en format compatible
    const plan = {
      id: dbPlan.id,
      title: dbPlan.title,
      description: dbPlan.description,
      theme: dbPlan.theme,
      durationDays: dbPlan.durationDays,
      imageUrl: dbPlan.imageUrl || null,
      imageGradient: dbPlan.imageGradient || 'from-olive-400 to-ciel-400',
      icon: dbPlan.icon || '📖',
      days: dbPlan.days.map((day) => ({
        day: day.dayNumber,
        title: day.title,
        verseRef: day.verseRef,
        verseText: day.verseText || day.verseRef, // Utiliser verseText si disponible, sinon verseRef
        meditation: day.meditation,
        prayer: day.prayer,
      })),
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Erreur récupération plan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

