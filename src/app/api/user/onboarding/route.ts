import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API Route pour marquer l'onboarding comme complété
 * POST /api/user/onboarding
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { hasCompletedOnboarding: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur onboarding:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

/**
 * API Route pour vérifier si l'onboarding est complété
 * GET /api/user/onboarding
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ hasCompletedOnboarding: false }, { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { hasCompletedOnboarding: true },
    })

    return NextResponse.json({
      hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
    })
  } catch (error) {
    console.error('Erreur vérification onboarding:', error)
    return NextResponse.json({ hasCompletedOnboarding: false }, { status: 200 })
  }
}

