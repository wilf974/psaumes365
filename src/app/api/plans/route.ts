import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PLANS_DATA } from '@/data/plans'

/**
 * GET /api/plans
 * Récupère tous les plans actifs (BDD + plans système)
 * Accessible à tous les utilisateurs authentifiés
 */
export async function GET() {
  try {
    // Récupérer les plans actifs de la base de données
    const dbPlans = await prisma.plan.findMany({
      where: {
        isActive: true,
      },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
          select: {
            dayNumber: true,
            verseRef: true,
            title: true,
            meditation: true,
            prayer: true,
          },
        },
        _count: {
          select: {
            progress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Convertir les plans de la BDD en format compatible avec PLANS_DATA
    const dbPlansFormatted = dbPlans.map((plan) => ({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      theme: plan.theme,
      durationDays: plan.durationDays,
      imageUrl: plan.imageUrl || null,
      imageGradient: plan.imageGradient || 'from-olive-400 to-ciel-400',
      icon: plan.icon || '📖',
      days: plan.days.map((day) => ({
        day: day.dayNumber,
        title: day.title,
        verseRef: day.verseRef,
        verseText: '', // À récupérer depuis l'API Bible si nécessaire
        meditation: day.meditation,
        prayer: day.prayer,
      })),
    }))

    // Récupérer les IDs des plans système supprimés
    const deletedSystemPlans = await prisma.deletedSystemPlan.findMany({
      select: { planId: true },
    })
    const deletedPlanIds = new Set(deletedSystemPlans.map((d) => d.planId))

    // Combiner avec les plans système
    // Filtrer les plans système qui existent déjà en BDD ou qui ont été supprimés
    const dbPlanIds = new Set(dbPlans.map((p) => p.id))
    const systemPlans = PLANS_DATA.filter(
      (p) => !dbPlanIds.has(p.id) && !deletedPlanIds.has(p.id)
    )

    // Combiner : plans BDD d'abord, puis plans système
    const allPlans = [...dbPlansFormatted, ...systemPlans]

    return NextResponse.json(allPlans)
  } catch (error) {
    console.error('Erreur récupération plans:', error)
    // En cas d'erreur, retourner au moins les plans système
    return NextResponse.json(PLANS_DATA)
  }
}

