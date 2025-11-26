import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/stats
 * Récupère les statistiques de méditation de l'utilisateur
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer les sessions de méditation (optimisé avec index)
    const sessions = await prisma.meditationSession.findMany({
      where: { userId }, // Utilise @@index([userId])
      orderBy: { completedAt: 'desc' }, // Utilise @@index([userId, completedAt])
      select: {
        id: true,
        duration: true,
        completedAt: true,
        planId: true,
      },
    })

    // Récupérer les progressions de plans
    const planProgress = await prisma.planProgress.findMany({
      where: { userId },
    })

    // Calcul des statistiques
    const totalSessions = sessions.length
    const totalMinutes = Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)
    
    // Jours uniques de méditation
    const uniqueDays = new Set(
      sessions.map(s => s.completedAt.toISOString().split('T')[0])
    )
    const totalDays = uniqueDays.size

    // Calcul du streak (jours consécutifs)
    const streak = calculateStreak(sessions)

    // Plans complétés
    const plansCompleted = planProgress.filter(p => p.completedAt !== null).length
    const plansInProgress = planProgress.filter(p => p.completedAt === null).length

    // Dernière activité
    const lastSession = sessions[0]?.completedAt || null

    // Sessions par semaine (4 dernières semaines)
    const weeklyData = getWeeklyData(sessions)

    return NextResponse.json({
      totalSessions,
      totalMinutes,
      totalDays,
      streak,
      plansCompleted,
      plansInProgress,
      lastSession,
      weeklyData,
    })
  } catch (error) {
    console.error('Erreur stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * POST /api/stats
 * Enregistre une session de méditation
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, dayNumber, duration, verseRef } = body

    const meditationSession = await prisma.meditationSession.create({
      data: {
        userId: session.user.id,
        planId,
        dayNumber,
        duration: duration || 300, // 5 min par défaut
        verseRef,
      },
    })

    return NextResponse.json(meditationSession)
  } catch (error) {
    console.error('Erreur création session:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * Calcule le nombre de jours consécutifs de méditation
 */
function calculateStreak(sessions: { completedAt: Date }[]): number {
  if (sessions.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dates = sessions
    .map(s => {
      const d = new Date(s.completedAt)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
    .filter((v, i, a) => a.indexOf(v) === i) // Unique
    .sort((a, b) => b - a) // Décroissant

  // Vérifier si aujourd'hui ou hier a une session
  const todayTime = today.getTime()
  const yesterdayTime = todayTime - 86400000

  if (dates[0] !== todayTime && dates[0] !== yesterdayTime) {
    return 0 // Streak cassé
  }

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    if (dates[i - 1] - dates[i] === 86400000) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/**
 * Récupère les données des 4 dernières semaines
 */
function getWeeklyData(sessions: { completedAt: Date }[]): number[] {
  const weeks: number[] = [0, 0, 0, 0]
  const now = new Date()

  sessions.forEach(s => {
    const diff = now.getTime() - s.completedAt.getTime()
    const weekIndex = Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
    if (weekIndex < 4) {
      weeks[weekIndex]++
    }
  })

  return weeks.reverse() // Plus ancien au plus récent
}


