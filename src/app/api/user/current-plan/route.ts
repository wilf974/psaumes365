import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PLANS_DATA } from '@/data/plans'

/**
 * API Route pour récupérer le plan en cours de l'utilisateur
 * GET /api/user/current-plan
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Récupérer le plan en cours (le plus récent non terminé)
    const planProgress = await prisma.planProgress.findFirst({
      where: {
        userId: user.id,
        completedAt: null, // Plan non terminé
      },
      orderBy: {
        startedAt: 'desc', // Le plus récent
      },
    })

    if (!planProgress) {
      return NextResponse.json({ currentPlan: null })
    }

    // Vérifier si c'est un plan système ou un plan de la BDD
    const systemPlan = PLANS_DATA.find((p) => p.id === planProgress.planId)
    
    let planData
    if (systemPlan) {
      // Plan système
      planData = {
        id: systemPlan.id,
        title: systemPlan.title,
        description: systemPlan.description,
        durationDays: systemPlan.durationDays,
        icon: systemPlan.icon,
        imageGradient: systemPlan.imageGradient,
        imageUrl: null,
        totalDays: systemPlan.days.length,
      }
    } else {
      // Plan de la BDD
      const dbPlan = await prisma.plan.findUnique({
        where: { id: planProgress.planId },
        include: {
          days: {
            orderBy: {
              dayNumber: 'asc',
            },
          },
        },
      })

      if (!dbPlan) {
        return NextResponse.json({ currentPlan: null })
      }

      planData = {
        id: dbPlan.id,
        title: dbPlan.title,
        description: dbPlan.description,
        durationDays: dbPlan.durationDays,
        icon: dbPlan.icon,
        imageGradient: dbPlan.imageGradient,
        imageUrl: dbPlan.imageUrl,
        totalDays: dbPlan.days.length,
      }
    }

    // Calculer le pourcentage de progression
    const totalDays = planData.totalDays
    const completedDaysCount = planProgress.completedDays.length
    const progressPercent = totalDays > 0 ? (completedDaysCount / totalDays) * 100 : 0

    return NextResponse.json({
      currentPlan: {
        id: planData.id,
        title: planData.title,
        description: planData.description,
        durationDays: planData.durationDays,
        icon: planData.icon,
        imageGradient: planData.imageGradient,
        imageUrl: planData.imageUrl,
        currentDay: planProgress.currentDay,
        completedDays: planProgress.completedDays,
        totalDays,
        progressPercent: Math.round(progressPercent),
        startedAt: planProgress.startedAt,
      },
    })
  } catch (error) {
    console.error('Erreur récupération plan en cours:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}

