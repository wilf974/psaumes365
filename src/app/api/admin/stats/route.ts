import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdmin, canCreatePlans } from '@/lib/permissions'

/**
 * GET /api/admin/stats
 * Récupère les statistiques de l'application
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userIsAdmin = session ? await isAdmin() : false
    const userCanCreate = session ? await canCreatePlans() : false

    if (!session || (!userIsAdmin && !userCanCreate)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    if (userIsAdmin) {
      // Stats complètes pour admin
      const [totalUsers, totalPlans, activePlans, totalSessions, recentUsers] =
        await Promise.all([
          prisma.user.count(),
          prisma.plan.count(),
          prisma.plan.count({ where: { isActive: true } }),
          prisma.meditationSession.count(),
          prisma.user.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
              },
            },
          }),
        ])

      return NextResponse.json({
        totalUsers,
        totalPlans,
        activePlans,
        totalSessions,
        recentUsers,
      })
    } else {
      // Stats limitées pour contributeur
      const userId = session.user.id
      const [totalPlans, activePlans] = await Promise.all([
        prisma.plan.count({ where: { createdById: userId } }),
        prisma.plan.count({
          where: { createdById: userId, isActive: true },
        }),
      ])

      return NextResponse.json({
        totalPlans,
        activePlans,
      })
    }
  } catch (error) {
    console.error('Erreur récupération stats:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

